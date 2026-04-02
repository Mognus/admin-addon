"use client";

import { useActionState } from "react";
import type { Schema, Field } from "../types";
import { schemaToZod } from "../lib/schema-to-zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileField } from "./FileField";

interface SchemaFormProps {
    schema: Schema;
    onSubmit: (data: Record<string, any> | FormData) => Promise<void>;
    initialData?: Record<string, any>;
    mode?: "create" | "edit";
    submitLabel?: string;
    formId?: string;
}

interface FormState {
    errors?: Record<string, string[] | undefined> | null;
    success?: boolean;
}

function isFieldActive(field: Field, mode: "create" | "edit") {
    if (field.readonly) return false;
    if (mode === "edit" && field.editHidden) return false;
    if (mode === "create" && field.createHidden) return false;
    return true;
}

export function SchemaForm({
    schema,
    onSubmit,
    initialData,
    mode = "create",
    submitLabel = "Submit",
    formId,
}: SchemaFormProps) {
    const zodSchema = schemaToZod(schema, mode);
    const hasFileField = schema.fields.some((f) => f.type === "file" && isFieldActive(f, mode));

    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        async (prevState, formData) => {
            try {
                if (hasFileField) {
                    await onSubmit(formData);
                } else {
                    // Build JSON object and validate with Zod
                    const data: Record<string, any> = {};
                    schema.fields.forEach((field) => {
                        if (!isFieldActive(field, mode)) return;
                        const value = formData.get(field.name);
                        if (field.type === "boolean") {
                            data[field.name] = value === "on";
                        } else if (field.type === "number") {
                            data[field.name] = value ? Number(value) : undefined;
                        } else {
                            data[field.name] = value || undefined;
                        }
                    });

                    const result = zodSchema.safeParse(data);
                    if (!result.success) {
                        return { errors: result.error.flatten().fieldErrors, success: false };
                    }
                    await onSubmit(result.data);
                }
                return { success: true, errors: null };
            } catch (error) {
                return {
                    errors: { _form: [error instanceof Error ? error.message : "Failed to submit form"] },
                    success: false,
                };
            }
        },
        { errors: null, success: false }
    );

    return (
        <form id={formId} action={formAction} className="space-y-4">
            {state.errors?._form && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {state.errors._form.join(", ")}
                </div>
            )}

            {schema.fields.map((field) => {
                if (!isFieldActive(field, mode)) return null;

                const defaultValue = initialData?.[field.name];
                const fieldErrors = state.errors?.[field.name];

                return (
                    <div key={field.name} className="space-y-2">
                        <label htmlFor={field.name} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </label>

                        {field.type === "boolean" ? (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    defaultChecked={defaultValue === true}
                                    disabled={field.readonly}
                                />
                                <label htmlFor={field.name} className="text-sm text-muted-foreground">
                                    Enable {field.label}
                                </label>
                            </div>
                        ) : field.type === "file" ? (
                            <FileField field={field} defaultValue={defaultValue} />
                        ) : field.type === "relation" ? (
                            <select
                                id={field.name}
                                name={field.name}
                                defaultValue={defaultValue ?? ""}
                                disabled={field.readonly || !field.options?.length}
                                required={field.required}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {field.options?.length ? (
                                    <>
                                        <option value="">Select {field.label}</option>
                                        {field.options.map((opt) => (
                                            <option key={String(opt.value)} value={String(opt.value)}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">No options available</option>
                                )}
                            </select>
                        ) : field.enumValues && field.enumValues.length > 0 ? (
                            <select
                                id={field.name}
                                name={field.name}
                                defaultValue={defaultValue || ""}
                                disabled={field.readonly}
                                required={field.required}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select {field.label}</option>
                                {field.enumValues.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                id={field.name}
                                name={field.name}
                                type={
                                    field.type === "number" ? "number" :
                                    field.type === "date" ? "date" : "text"
                                }
                                defaultValue={defaultValue || ""}
                                disabled={field.readonly}
                                required={field.required}
                            />
                        )}

                        {fieldErrors && (
                            <p className="text-sm text-destructive">{fieldErrors.join(", ")}</p>
                        )}
                    </div>
                );
            })}

            {!formId && (
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Submitting..." : submitLabel}
                    </Button>
                </div>
            )}
        </form>
    );
}

