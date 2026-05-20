import { mutateFetch } from "@/lib/api/fetcher";
import type { AdminRecord } from "./api-server";

interface AdminDataResponse {
    data: AdminRecord;
}

export async function fetchAdminCreate(apiPath: string, data: AdminRecord): Promise<AdminRecord> {
    const response = await mutateFetch<AdminDataResponse>(apiPath, {
        method: "POST",
        body: data,
    });
    return response.data;
}

export async function fetchAdminUpdate(apiPath: string, id: string | number, data: AdminRecord): Promise<AdminRecord> {
    const response = await mutateFetch<AdminDataResponse>(`${apiPath}/${id}`, {
        method: "PUT",
        body: data,
    });
    return response.data;
}

export async function fetchAdminDelete(apiPath: string, id: string | number): Promise<void> {
    await mutateFetch<unknown>(`${apiPath}/${id}`, {
        method: "DELETE",
    });
}
