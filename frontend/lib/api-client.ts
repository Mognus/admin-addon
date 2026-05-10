import { mutateFetch } from "@/lib/api/fetcher";
import type { AdminRecord } from "./api-server";

export async function fetchAdminCreate(model: string, data: AdminRecord): Promise<AdminRecord> {
    return mutateFetch<AdminRecord>(`/admin/${encodeURIComponent(model)}`, {
        method: "POST",
        body: data,
    });
}
