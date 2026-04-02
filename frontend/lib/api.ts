import { mutateFetch } from "@/lib/api/fetcher";


/**
 * Admin API - Mutation operations only
 *
 * For READ operations, use SWR directly:
 * useSWR('/admin/api/models', fetcher)
 * useSWR(`/admin/api/${model}?page=${page}&limit=${limit}`, fetcher)
 */
export const adminAPI = {
    // Create item
    create: async <T = any>(model: string, data: Record<string, any>): Promise<T> => {
        return mutateFetch<T>(`/admin/api/${model}`, {
            method: "POST",
            body: data,
        });
    },

    // Update item
    update: async <T = any>(
        model: string,
        id: string | number,
        data: Record<string, any>
    ): Promise<T> => {
        return mutateFetch<T>(`/admin/api/${model}/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    // Delete item
    delete: async (model: string, id: string | number): Promise<void> => {
        return mutateFetch<void>(`/admin/api/${model}/${id}`, {
            method: "DELETE",
        });
    },
};

// Convenience exports for direct usage
export const createRecord = adminAPI.create;
export const updateRecord = adminAPI.update;
export const deleteRecord = adminAPI.delete;

export const createRecordMultipart = async <T = any>(model: string, data: FormData): Promise<T> =>
    mutateFetch<T>(`/admin/api/${model}`, { method: "POST", body: data, multipart: true });

export const updateRecordMultipart = async <T = any>(model: string, id: string | number, data: FormData): Promise<T> =>
    mutateFetch<T>(`/admin/api/${model}/${id}`, { method: "PUT", body: data, multipart: true });
