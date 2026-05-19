import { mutateFetch } from "@/lib/api/fetcher";
import type { AdminRecord } from "./api-server";

export async function fetchAdminCreate(apiPath: string, data: AdminRecord): Promise<AdminRecord> {
    return mutateFetch<AdminRecord>(apiPath, {
        method: "POST",
        body: data,
    });
}

export async function fetchAdminUpdate(apiPath: string, id: string | number, data: AdminRecord): Promise<AdminRecord> {
    return mutateFetch<AdminRecord>(`${apiPath}/${id}`, {
        method: "PUT",
        body: data,
    });
}

export async function fetchAdminDelete(apiPath: string, id: string | number): Promise<void> {
    await mutateFetch<unknown>(`${apiPath}/${id}`, {
        method: "DELETE",
    });
}
