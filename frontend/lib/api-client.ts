import { mutateFetch } from "@/lib/api/fetcher";
import type { AdminRecord } from "./api-server";

export async function fetchAdminCreate(model: string, data: AdminRecord): Promise<AdminRecord> {
    return mutateFetch<AdminRecord>(`/admin/${encodeURIComponent(model)}`, {
        method: "POST",
        body: data,
    });
}

export async function fetchAdminUpdate(model: string, id: string | number, data: AdminRecord): Promise<AdminRecord> {
    return mutateFetch<AdminRecord>(`/admin/${encodeURIComponent(model)}/${id}`, {
        method: "PUT",
        body: data,
    });
}

export async function fetchAdminDelete(model: string, id: string | number): Promise<void> {
    await mutateFetch<unknown>(`/admin/${encodeURIComponent(model)}/${id}`, {
        method: "DELETE",
    });
}
