"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { Schema } from "../types";

export function useAdminSchema(modelName: string | null, fallbackData?: Schema) {
    return useSWR<Schema>(
        modelName ? `/admin/api/${modelName}/schema` : null,
        fetcher,
        { revalidateOnFocus: false, fallbackData }
    );
}
