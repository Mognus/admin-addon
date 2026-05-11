"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/addons/ui-core-addon/frontend/components/modal/modal";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import { toastError } from "@/lib/api/toast";
import { fetchAdminUpdate, fetchAdminDelete } from "../lib/api-client";
import type { AdminRecord, AdminSchema } from "../lib/api-server";
import { FormField } from "@/addons/ui-core-addon/frontend/domains/form/form-field";
import { generateZodSchema } from "@/addons/ui-core-addon/frontend/domains/form/schema-generator";

interface AdminRowActionsModalProps {
    schema: AdminSchema;
    row: AdminRecord;
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    onDeleted?: () => void;
}

export function AdminRowActionsModal({ schema, row, open, onClose, onUpdated, onDeleted }: AdminRowActionsModalProps) {
    const editFields = schema.fields.filter((f) => !f.editHidden);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const zodSchema = generateZodSchema(editFields);

    const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: Object.fromEntries(
            editFields.map((f) => [f.name, row[f.name] ?? ""]),
        ),
    });

    async function onSubmit(values: Record<string, unknown>) {
        try {
            await fetchAdminUpdate(schema.name, row.id as string | number, values);
            onUpdated?.();
            onClose();
        } catch (e) {
            toastError(e);
        }
    }

    async function handleDelete() {
        try {
            await fetchAdminDelete(schema.name, row.id as string | number);
            onDeleted?.();
            onClose();
        } catch (e) {
            toastError(e);
        } finally {
            setConfirmDelete(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={`Edit ${schema.displayName}`} className="w-full max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                    {editFields.map((field) => (
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

                <div className="flex justify-between gap-2 border-t border-input pt-4">
                    {confirmDelete
                        ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sure?</span>
                                <Button
                                    type="button"
                                    onClick={handleDelete}
                                    className="border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    Yes, delete
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="border border-input px-3 py-1.5 text-sm hover:bg-accent"
                                >
                                    Cancel
                                </Button>
                            </div>
                        )
                        : (
                            <Button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                            >
                                Delete
                            </Button>
                        )}

                    <div className="flex gap-2">
                        <Button type="button" onClick={onClose} className="border border-input px-4 py-2 text-sm hover:bg-accent">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-foreground px-4 py-2 text-sm text-background hover:opacity-80">
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
