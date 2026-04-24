"use client";

import { Columns3 } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/action-button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnToggleProps {
    table: Table<any>;
}

export function ColumnToggle({ table }: ColumnToggleProps) {
    const togglableColumns = table.getAllColumns().filter(
        (col) => col.getCanHide()
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ActionButton icon={Columns3} label="Columns" variant="outline" size="default" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {togglableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(value)}
                        onSelect={(e) => e.preventDefault()}
                    >
                        {String(column.columnDef.header ?? column.id)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
