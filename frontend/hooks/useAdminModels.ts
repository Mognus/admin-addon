"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { ModelInfo } from "../types";

export function useAdminModels(initialModels?: ModelInfo[]) {
    return useSWR<{ models: ModelInfo[] }>("/admin/api/models", fetcher, {
        fallbackData: initialModels ? { models: initialModels } : undefined,
        revalidateOnFocus: true,
    });
}
