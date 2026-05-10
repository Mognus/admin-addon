"use client";

import { Select } from "@/addons/ui-core-addon/frontend/components/select/select";
import { TextInput } from "@/addons/ui-core-addon/frontend/components/primitives/input/text-input";
import type { AdminField } from "../lib/api-server";

interface FormFieldProps {
    field: AdminField;
    value: unknown;
    onChange: (value: unknown) => void;
}

export function FormField({ field, value, onChange }: FormFieldProps) {
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
                    disabled={field.readonly}
                />
            </div>
        </div>
    );
}
