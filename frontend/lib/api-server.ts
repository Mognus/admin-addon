import { serverFetch } from "@/lib/api/api-server";

export interface AdminModel {
    name: string;
    displayName: string;
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

export async function fetchAdminList(model: string): Promise<AdminListResponse> {
    return serverFetch<AdminListResponse>(`/admin/${encodeURIComponent(model)}`, {
        withAuth: true,
    });
}
