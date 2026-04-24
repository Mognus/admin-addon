"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/action-button";
import type { Schema } from "../types";

interface SearchBarProps {
    schema: Schema;
    onSearch: (filters: Record<string, string>) => void;
    activeFilters?: Record<string, string>;
}

const GLOBAL_KEY = "__global__";

export function SearchBar({ schema, onSearch, activeFilters }: SearchBarProps) {
    const [field, setField] = useState(GLOBAL_KEY);
    const [value, setValue] = useState("");

    // Clear input value when all filters are removed externally (e.g. via FilterTags).
    // Field selection is intentional user state – don't reset it.
    useEffect(() => {
        if (activeFilters && Object.keys(activeFilters).length === 0) {
            setValue("");
        }
    }, [activeFilters]);

    const searchableFields = schema.fields.filter(
        (f) => schema.searchable.includes(f.name)
    );

    const selectedLabel = field === GLOBAL_KEY
        ? "All fields"
        : searchableFields.find((f) => f.name === field)?.label ?? field;

    const buildAndEmit = useCallback(
        (f: string, v: string) => {
            // Emit only the current field's filter as a single key-value.
            // AdminModelView merges it into the full filter state.
            const key = f === GLOBAL_KEY ? "search" : `${f}__contains`;
            onSearch({ [key]: v });
        },
        [onSearch]
    );

    const handleValueChange = (v: string) => {
        setValue(v);
        buildAndEmit(field, v);
    };

    const handleFieldChange = (f: string) => {
        setField(f);
        // Restore the active value for this field if it exists
        const key = f === GLOBAL_KEY ? "search" : `${f}__contains`;
        setValue(activeFilters?.[key] ?? "");
    };

    const handleClear = () => {
        const key = field === GLOBAL_KEY ? "search" : `${field}__contains`;
        setValue("");
        onSearch({ [key]: "" }); // empty value → merge logic removes the key
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={field} onValueChange={handleFieldChange}>
                <SelectTrigger className="h-9 w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={GLOBAL_KEY}>All fields</SelectItem>
                    {searchableFields.length > 0 && (
                        <>
                            <SelectSeparator />
                            {searchableFields.map((f) => (
                                <SelectItem key={f.name} value={f.name}>
                                    {f.label}
                                </SelectItem>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={`Search ${selectedLabel}...`}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="pl-8 w-48"
                />
            </div>

            {value && (
                <ActionButton icon={X} variant="ghost" onClick={handleClear} />
            )}
        </div>
    );
}
