"use client";

import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps {
    table: Table<any>;
}

export function DataTable({ table }: DataTableProps) {
    return (
        <div className="flex-1 min-h-0 overflow-auto">
            <ShadTable>
                <TableHeader className="sticky top-0 z-10 bg-background">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const sorted = header.column.getIsSorted();
                                const canSort = header.column.getCanSort();
                                return (
                                    <TableHead
                                        key={header.id}
                                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        className={canSort ? "cursor-pointer select-none" : ""}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {canSort && (
                                                sorted === "asc" ? <ArrowUp className="h-3 w-3" /> :
                                                sorted === "desc" ? <ArrowDown className="h-3 w-3" /> :
                                                <ArrowUpDown className="h-3 w-3 opacity-40" />
                                            )}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </ShadTable>
        </div>
    );
}
