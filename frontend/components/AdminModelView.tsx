"use client";

import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    type VisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import type { SortParams } from "@/addons/admin-addon/frontend/hooks/useAdminList";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { DataTable } from "@/addons/admin-addon/frontend/components/DataTable";
import { CreateModal } from "@/addons/admin-addon/frontend/components/CreateModal";
import { ColumnToggle } from "@/addons/admin-addon/frontend/components/ColumnToggle";
import { PaginationBar } from "@/addons/admin-addon/frontend/components/PaginationBar";
import { SearchBar } from "@/addons/admin-addon/frontend/components/SearchBar";
import { FilterTags } from "@/addons/admin-addon/frontend/components/FilterTags";
import { useAdminSchema } from "@/addons/admin-addon/frontend/hooks/useAdminSchema";
import { useAdminList } from "@/addons/admin-addon/frontend/hooks/useAdminList";
import type { Schema, ListResponse } from "@/addons/admin-addon/frontend/types";
import { buildColumns } from "@/addons/admin-addon/frontend/lib/buildColumns";

interface AdminModelViewProps {
    model: string;
    initialSchema: Schema;
    initialData: ListResponse;
}

export function AdminModelView({ model, initialSchema, initialData }: AdminModelViewProps) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const sortParams: SortParams | undefined = sorting.length > 0
        ? { sort_by: sorting[0].id, sort_order: sorting[0].desc ? "desc" : "asc" }
        : undefined;

    const { data: schema } = useAdminSchema(model, initialSchema);
    const { data, error } = useAdminList(model, page, limit, searchFilters, sortParams, initialData);

    const handleSearch = (delta: Record<string, string>) => {
        // Merge the incoming filter into existing ones.
        // Empty value removes the key, non-empty value adds/updates it.
        setSearchFilters((prev) => {
            const next = { ...prev };
            Object.entries(delta).forEach(([k, v]) => {
                if (v) next[k] = v;
                else delete next[k];
            });
            return next;
        });
        setPage(1);
    };

    const handleRemoveFilter = (key: string) => {
        const next = { ...searchFilters };
        delete next[key];
        setSearchFilters(next);
        setPage(1);
    };

    const totalPages = data ? Math.ceil(data.total / limit) : 0;
    const columns = schema ? buildColumns(schema, model) : [];

    const table = useReactTable({
        data: data?.items ?? [],
        columns,
        state: { columnVisibility, sorting },
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="flex flex-col flex-1 min-h-0 m-2">
                <CardHeader className="shrink-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        {schema && (
                            <SearchBar
                                schema={schema}
                                onSearch={handleSearch}
                                activeFilters={searchFilters}
                            />
                        )}
                        <div className="flex items-center gap-2">
                            <ColumnToggle table={table} />
                            {schema && <CreateModal modelName={model} schema={schema} />}
                        </div>
                    </div>
                    {/* Fixed height prevents layout shift when filters are added/removed */}
                    <div className="h-3 flex items-center">
                        {schema && (
                            <FilterTags
                                filters={searchFilters}
                                schema={schema}
                                onRemove={handleRemoveFilter}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                            {error instanceof Error ? error.message : "An error occurred"}
                        </div>
                    )}
                    {data && schema && (
                        <div className="flex flex-col flex-1 min-h-0">
                            <DataTable table={table} />
                            {data.total > 0 && (
                                <PaginationBar
                                    page={page}
                                    totalPages={totalPages}
                                    totalItems={data.total}
                                    limit={limit}
                                    onFirst={() => setPage(1)}
                                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    onLast={() => setPage(totalPages)}
                                    onLimitChange={(newLimit) => {
                                        setLimit(newLimit);
                                        setPage(1);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
        </Card>
    );
}
