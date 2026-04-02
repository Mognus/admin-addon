"use client";

import { Rows3, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/ActionButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

interface PaginationBarProps {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onFirst: () => void;
    onPrev: () => void;
    onNext: () => void;
    onLast: () => void;
    onLimitChange: (limit: number) => void;
}

export function PaginationBar({
    page,
    totalPages,
    totalItems,
    limit,
    onFirst,
    onPrev,
    onNext,
    onLast,
    onLimitChange,
}: PaginationBarProps) {
    return (
        <div className="shrink-0 flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({totalItems} total items)
            </p>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Rows3 className="h-4 w-4" />
                    <Select
                        value={String(limit)}
                        onValueChange={(val) => onLimitChange(Number(val))}
                    >
                        <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1">
                    <ActionButton icon={ChevronsLeft} variant="outline" onClick={onFirst} disabled={page === 1} />
                    <ActionButton icon={ChevronLeft} variant="outline" onClick={onPrev} disabled={page === 1} />
                    <ActionButton icon={ChevronRight} variant="outline" onClick={onNext} disabled={page === totalPages} />
                    <ActionButton icon={ChevronsRight} variant="outline" onClick={onLast} disabled={page === totalPages} />
                </div>
            </div>
        </div>
    );
}
