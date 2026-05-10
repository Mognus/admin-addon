"use client";

import { useState } from "react";
import { Modal } from "@/addons/ui-core-addon/frontend/components/modal/modal";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import { toastError } from "@/lib/api/toast";
import { fetchAdminUpdate, fetchAdminDelete } from "../lib/api-client";
import type { AdminRecord, AdminSchema } from "../lib/api-server";
import { FormField } from "./form-field";

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

    const [values, setValues] = useState<AdminRecord>(() =>
        Object.fromEntries(editFields.map((f) => [f.name, row[f.name] ?? ""])),
    );
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    function handleChange(key: string, value: unknown) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    async function handleUpdate() {
        setLoading(true);
        try {
            const id = row.id as string | number;
            await fetchAdminUpdate(schema.name, id, values);
            onUpdated?.();
            onClose();
        } catch (e) {
            toastError(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setLoading(true);
        try {
            const id = row.id as string | number;
            await fetchAdminDelete(schema.name, id);
            onDeleted?.();
            onClose();
        } catch (e) {
            toastError(e);
        } finally {
            setLoading(false);
            setConfirmDelete(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={`Edit ${schema.displayName}`} className="w-full max-w-lg">
            <div className="flex flex-col gap-4">
                {editFields.map((field) => (
                    <FormField
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        onChange={(v) => handleChange(field.name, v)}
                    />
                ))}

                <div className="flex justify-between gap-2 border-t border-input pt-4">
                    {confirmDelete
                        ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sure?</span>
                                <Button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    {loading ? "Deleting..." : "Yes, delete"}
                                </Button>
                                <Button
                                    onClick={() => setConfirmDelete(false)}
                                    className="border border-input px-3 py-1.5 text-sm hover:bg-accent"
                                >
                                    Cancel
                                </Button>
                            </div>
                        )
                        : (
                            <Button
                                onClick={() => setConfirmDelete(true)}
                                className="border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                            >
                                Delete
                            </Button>
                        )}

                    <div className="flex gap-2">
                        <Button onClick={onClose} className="border border-input px-4 py-2 text-sm hover:bg-accent">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-foreground px-4 py-2 text-sm text-background hover:opacity-80"
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
