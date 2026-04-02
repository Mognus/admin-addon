"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Schema } from "../types";

interface FilterTagsProps {
    filters: Record<string, string>;
    schema: Schema;
    onRemove: (key: string) => void;
}

function getFilterLabel(key: string, value: string, schema: Schema): string {
    if (key === "search") return `Search: ${value}`;
    const fieldName = key.replace(/__\w+$/, ""); // strip __contains, __gte etc.
    const label = schema.fields.find((f) => f.name === fieldName)?.label ?? fieldName;
    return `${label}: ${value}`;
}

export function FilterTags({ filters, schema, onRemove }: FilterTagsProps) {
    const active = Object.entries(filters).filter(([, v]) => v);
    if (active.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {active.map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1 pr-1">
                    <span>{getFilterLabel(key, value, schema)}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(key)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
    );
}
