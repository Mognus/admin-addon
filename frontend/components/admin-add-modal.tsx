"use client";

import { useState } from "react";
import { Modal } from "@/addons/ui-core-addon/frontend/components/modal/modal";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import { Select } from "@/addons/ui-core-addon/frontend/components/select/select";
import { TextInput } from "@/addons/ui-core-addon/frontend/components/primitives/input/text-input";
import { toastError } from "@/lib/api/toast";
import { fetchAdminCreate } from "../lib/api-client";
import type { AdminField, AdminSchema } from "../lib/api-server";

function FormField({ field, value, onChange }: {
    field: AdminField;
    value: unknown;
    onChange: (value: unknown) => void;
}) {
    if (field.type === "boolean") {
        return (
            <label className="flex items-center gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4"
                />
                {field.label}
            </label>
        );
    }

    if (field.type === "relation" && field.options?.length) {
        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">{field.label}{field.required && " *"}</label>
                <Select
                    options={field.options.map((o) => ({ value: String(o.value), label: o.label }))}
                    value={String(value ?? "")}
                    onChange={onChange}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{field.label}{field.required && " *"}</label>
            <div className="border border-input px-3 py-2">
                <TextInput
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={String(value ?? "")}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.label}
                />
            </div>
        </div>
    );
}

interface AdminAddModalProps {
    schema: AdminSchema;
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export function AdminAddModal({ schema, open, onClose, onCreated }: AdminAddModalProps) {
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
