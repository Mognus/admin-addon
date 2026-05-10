"use client";

import { useTable } from "@/addons/ui-core-addon/frontend/domains/table/hooks/useTable";
import type { UseTableReturn } from "@/addons/ui-core-addon/frontend/domains/table/hooks/useTable";
import type { Column } from "@/addons/ui-core-addon/frontend/domains/table/types";
import type { ReactNode } from "react";
import type { AdminRecord, AdminSchema } from "../lib/api-server";

export type AdminRenderers = Partial<Record<string, (value: unknown) => ReactNode>>;

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

interface UseAdminTableOptions {
    schema: AdminSchema;
    renderers?: AdminRenderers;
    defaultPage?: number;
    defaultLimit?: number;
}

export function useAdminTable({ schema, renderers, defaultPage, defaultLimit }: UseAdminTableOptions): UseTableReturn<AdminRecord> {
    const columns: Column<AdminRecord>[] = schema.fields
        .filter((f) => !f.tableHidden)
        .map((f) => ({
            key: f.name,
            header: f.label,
            type: f.type,
            render: renderers?.[f.name]
                ? (row) => renderers[f.name]!(row[f.name])
                : (row) => formatValue(row[f.name]),
        }));

    return useTable<AdminRecord>({
        columns,
        searchableKeys: schema.searchable,
        defaultPage,
        defaultLimit,
    });
}
