"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Modal } from "@/addons/ui-core-addon/frontend/components/modal/modal";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import { toastError } from "@/lib/api/toast";
import { fetchAdminCreate } from "../lib/api-client";
import type { AdminSchema } from "../lib/api-server";
import { FormField } from "@/addons/ui-core-addon/frontend/domains/form/form-field";
import { generateZodSchema } from "@/addons/ui-core-addon/frontend/domains/form/schema-generator";

interface AdminAddModalProps {
    schema: AdminSchema;
    apiPath: string;
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

function AdminAddModal({ schema, apiPath, open, onClose, onCreated }: AdminAddModalProps) {
    const fields = schema.fields.filter((f) => !f.readonly && !f.createHidden);

    const zodSchema = generateZodSchema(fields);

    const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: Object.fromEntries(
            fields.map((f) => [f.name, f.type === "boolean" ? false : ""]),
        ),
    });

    async function onSubmit(values: Record<string, unknown>) {
        try {
            await fetchAdminCreate(apiPath, values);
            reset();
            onCreated?.();
            onClose();
        } catch (e) {
            toastError(e);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={`Add ${schema.displayName}`} className="w-full max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                    {fields.map((field) => (
                        <Controller
                            key={field.name}
                            name={field.name}
                            control={control}
                            render={({ field: ctrl }) => (
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        field={field}
                                        value={ctrl.value}
                                        onChange={ctrl.onChange}
                                    />
                                    {errors[field.name] && (
                                        <span className="text-xs text-destructive">
                                            {errors[field.name]?.message as string}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    ))}
                </div>
                <div className="flex justify-end gap-2 border-t border-input pt-4">
                    <Button type="button" onClick={onClose} className="border border-input px-4 py-2 text-sm hover:bg-accent">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-foreground px-4 py-2 text-sm text-background hover:opacity-80">
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

interface AdminAddTriggerProps {
    schema: AdminSchema;
    apiPath: string;
    onCreated?: () => void;
}

export function AdminAddTrigger({ schema, apiPath, onCreated }: AdminAddTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="border border-input px-3 py-1.5 text-sm hover:bg-accent">
                <Plus className="h-4 w-4" />
                Add
            </Button>
            <AdminAddModal
                schema={schema}
                apiPath={apiPath}
                open={open}
                onClose={() => setOpen(false)}
                onCreated={onCreated}
            />
        </>
    );
}
