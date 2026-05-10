"use client";

import { useTable } from "@/addons/ui-core-addon/frontend/domains/table/hooks/useTable";
import type { UseTableReturn } from "@/addons/ui-core-addon/frontend/domains/table/hooks/useTable";
import type { Column } from "@/addons/ui-core-addon/frontend/domains/table/types";
import type { AdminRecord, AdminSchema } from "../lib/api-server";

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

interface UseAdminTableOptions {
    schema: AdminSchema;
    defaultPage?: number;
    defaultLimit?: number;
}

export function useAdminTable({ schema, defaultPage, defaultLimit }: UseAdminTableOptions): UseTableReturn<AdminRecord> {
    const columns: Column<AdminRecord>[] = schema.fields
        .filter((f) => !f.tableHidden)
        .map((f) => ({
            key: f.name,
            header: f.label,
            render: (row) => formatValue(row[f.name]),
        }));

    return useTable<AdminRecord>({
        columns,
        searchableKeys: schema.searchable,
        defaultPage,
        defaultLimit,
    });
}
