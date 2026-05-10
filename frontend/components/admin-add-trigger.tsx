"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/addons/ui-core-addon/frontend/components/primitives/buttons/button";
import type { AdminSchema } from "../lib/api-server";
import { AdminAddModal } from "./admin-add-modal";

interface AdminAddTriggerProps {
    schema: AdminSchema;
    onCreated?: () => void;
}

export function AdminAddTrigger({ schema, onCreated }: AdminAddTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="border border-input px-3 py-1.5 text-sm hover:bg-accent">
                <Plus className="h-4 w-4" />
                Add
            </Button>
            <AdminAddModal
                schema={schema}
                open={open}
                onClose={() => setOpen(false)}
                onCreated={onCreated}
            />
        </>
    );
}
