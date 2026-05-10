"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/addons/ui-core-addon/frontend/components/modal/modal";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import { toastError } from "@/lib/api/toast";
import { fetchAdminCreate } from "../lib/api-client";
import type { AdminSchema } from "../lib/api-server";
import { FormField } from "./form-field";

interface AdminAddModalProps {
    schema: AdminSchema;
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

function AdminAddModal({ schema, open, onClose, onCreated }: AdminAddModalProps) {
    const fields = schema.fields.filter((f) => !f.readonly && !f.createHidden);

    const initialValues = Object.fromEntries(
        fields.map((f) => [f.name, f.type === "boolean" ? false : ""]),
    );

    const [values, setValues] = useState<Record<string, unknown>>(initialValues);
    const [loading, setLoading] = useState(false);

    function handleChange(key: string, value: unknown) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            await fetchAdminCreate(schema.name, values);
            setValues(initialValues);
            onCreated?.();
            onClose();
        } catch (e) {
            toastError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={`Add ${schema.displayName}`} className="w-full max-w-lg">
            <div className="flex flex-col gap-4">
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        onChange={(v) => handleChange(field.name, v)}
                    />
                ))}
                <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={onClose} className="border border-input px-4 py-2 text-sm hover:bg-accent">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-foreground px-4 py-2 text-sm text-background hover:opacity-80">
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

interface AdminAddTriggerProps {
    schema: AdminSchema;
    onCreated?: () => void;
}

export function AdminAddTrigger({ schema, onCreated }: AdminAddTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="border border-input px-3 py-1.5 text-sm hover:bg-accent">
                <Plus className="h-4 w-4" />
                Add
            </Button>
            <AdminAddModal
                schema={schema}
                open={open}
                onClose={() => setOpen(false)}
                onCreated={onCreated}
            />
        </>
    );
}
