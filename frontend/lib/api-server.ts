import { serverFetch } from "@/lib/api/api-server";
import type { FieldDefinition, SelectOption } from "@/addons/ui-core-addon/frontend/domains/form/field-definition";

export type { FieldDefinition, SelectOption };

export interface AdminModel {
    name: string;
    displayName: string;
}

export type AdminSelectOption = SelectOption;

export interface AdminField extends FieldDefinition {
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

interface AdminListParams {
    page?: number;
    limit?: number;
    filters?: Record<string, string>;
}


export async function fetchAdminList(model: string, params: AdminListParams = {}): Promise<AdminListResponse> {
    const { page = 1, limit = 20, filters = {} } = params;
    // grpc-gateway maps map<string,string> fields via filters[key]=value syntax
    const filterParams = Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [`filters[${k}]`, v]),
    );
    const query = new URLSearchParams({ page: String(page), limit: String(limit), ...filterParams });
    return serverFetch<AdminListResponse>(`/admin/${encodeURIComponent(model)}?${query}`, {
        withAuth: true,
    });
}
