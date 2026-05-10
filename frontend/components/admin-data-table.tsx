"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/addons/ui-core-addon/frontend/domains/table/data-table/data-table";
import { useAdminTable } from "../hooks/useAdminTable";
import type { AdminRenderers } from "../hooks/useAdminTable";
import type { AdminRecord, AdminSchema } from "../lib/api-server";
import { AdminAddTrigger } from "./admin-add-trigger";

interface AdminDataTableProps {
    schema: AdminSchema;
    rows: AdminRecord[];
    total: number;
    renderers?: AdminRenderers;
    className?: string;
    defaultPage?: number;
    defaultLimit?: number;
}

export function AdminDataTable({ schema, rows, total, renderers, className, defaultPage, defaultLimit }: AdminDataTableProps) {
    const router = useRouter();
    const table = useAdminTable({ schema, renderers, defaultPage, defaultLimit });

    return (
        <DataTable
            table={table}
            rows={rows}
            getRowKey={(row, index) => String(row.id ?? index)}
            total={total}
            addTrigger={<AdminAddTrigger schema={schema} onCreated={() => router.refresh()} />}
            className={className}
            tableProps={{ classNames: { th: "font-syne uppercase tracking-[0.15em]" } }}
        />
    );
}
