import { serverFetch } from "@/lib/api/api-server";

export interface AdminModel {
    name: string;
    displayName: string;
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
