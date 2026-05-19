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

interface AdminListParams {
    page?: number;
    limit?: number;
    filters?: Record<string, string>;
}


export async function fetchAdminList(apiPath: string, params: AdminListParams = {}): Promise<AdminListResponse> {
    const { page = 1, limit = 20, filters = {} } = params;
    const filterParams = Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [`filters[${k}]`, v]),
    );
    const query = new URLSearchParams({ page: String(page), limit: String(limit), ...filterParams });
    return serverFetch<AdminListResponse>(`${apiPath}?${query}`, {
        withAuth: true,
    });
}
