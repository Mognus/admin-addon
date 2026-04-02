"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { ListResponse } from "../types";

export interface SortParams {
    sort_by: string;
    sort_order: "asc" | "desc";
}

export function useAdminList(
    modelName: string | null,
    page: number,
    limit: number,
    filters?: Record<string, string>,
    sortParams?: SortParams,
    fallbackData?: ListResponse,
) {
    const key = () => {
        if (!modelName) return null;
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (filters) Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        if (sortParams?.sort_by) {
            params.set("sort_by", sortParams.sort_by);
            params.set("sort_order", sortParams.sort_order);
        }
        return `/admin/api/${modelName}?${params.toString()}`;
    };

    return useSWR<ListResponse>(key(), fetcher, {
        revalidateOnFocus: true,
        keepPreviousData: true,
        fallbackData,
    });
}
