import { serverFetch } from "@/lib/api/api-server";

export interface AdminModel {
    name: string;
    displayName: string;
}

export interface AdminSelectOption {
    value: string | number;
    label: string;
}

export interface AdminField {
    name: string;
    type: string;
    label: string;
    required: boolean;
    readonly: boolean;
    tableHidden?: boolean;
    editHidden?: boolean;
    createHidden?: boolean;
    options?: AdminSelectOption[];
}

export interface AdminSchema {
    name: string;
    displayName: string;
    fields: AdminField[];
    searchable: string[];
}

export type AdminRecord = Record<string, unknown>;

export interface AdminListResponse {
    items: AdminRecord[];
    total: number;
    page: number;
    limit: number;
}

interface AdminModelsResponse {
    models: AdminModel[];
}

export async function fetchAdminModels(): Promise<AdminModel[]> {
    const response = await serverFetch<AdminModelsResponse>("/admin/models", {
        withAuth: true,
    });

    return response.models;
}

export async function fetchAdminSchema(model: string): Promise<AdminSchema> {
    return serverFetch<AdminSchema>(`/admin/${encodeURIComponent(model)}/schema`, {
        withAuth: true,
    });
}

interface AdminListParams {
    page?: number;
    limit?: number;
    filters?: Record<string, string>;
}


export async function fetchAdminList(model: string, params: AdminListParams = {}): Promise<AdminListResponse> {
    const { page = 1, limit = 20, filters = {} } = params;
    const query = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    return serverFetch<AdminListResponse>(`/admin/${encodeURIComponent(model)}?${query}`, {
        withAuth: true,
    });
}
