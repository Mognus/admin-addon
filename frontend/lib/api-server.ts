// Server-side Admin API functions
// Uses the shared serverFetch utility

import { serverFetch } from "@/lib/api/api-server";
import type { ModelInfo, Schema, ListResponse } from "../types";

/**
 * Fetch all available models
 * Use in Server Components for initial load
 */
export async function fetchModels(): Promise<ModelInfo[]> {
    const data = await serverFetch<{ models: ModelInfo[] }>("/admin/api/models", { withAuth: true });
    return data.models;
}

/**
 * Fetch schema for a specific model
 */
export async function fetchModelSchema(model: string): Promise<Schema> {
    return serverFetch<Schema>(`/admin/api/${model}/schema`, { withAuth: true });
}

/**
 * Fetch paginated data for a specific model
 */
export async function fetchModelData<T = any>(
    model: string,
    params?: { page?: number; limit?: number; [key: string]: any }
): Promise<ListResponse<T>> {
    const queryParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.set(key, value.toString());
            }
        });
    }

    const url = `/admin/api/${model}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    return serverFetch<ListResponse<T>>(url, { withAuth: true });
}
