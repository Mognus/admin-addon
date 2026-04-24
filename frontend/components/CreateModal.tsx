"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Modal } from "@/components/Modal";
import { Plus } from "lucide-react";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/action-button";
import { Button } from "@/components/ui/button";
import { SchemaForm } from "./SchemaForm";
import { createRecord, createRecordMultipart } from "../lib/api";
import type { Schema } from "../types";

interface CreateModalProps {
    modelName: string;
    schema: Schema;
}

export function CreateModal({ modelName, schema }: CreateModalProps) {
    const [open, setOpen] = useState(false);

    const handleSubmit = async (data: Record<string, any> | FormData) => {
        if (data instanceof FormData) {
            await createRecordMultipart(modelName, data);
        } else {
            await createRecord(modelName, data);
        }
        mutate(`/admin/api/${modelName}`);
        mutate((key) => typeof key === "string" && key.startsWith(`/admin/api/${modelName}?`));
        setOpen(false);
    };

    return (
        <>
            <ActionButton icon={Plus} label={`Create ${schema.displayName}`} onClick={() => setOpen(true)} size="default" />

            <Modal
                open={open}
                onOpenChange={setOpen}
                title={`Create ${schema.displayName}`}
                description={`Fill in the form below to create a new ${schema.displayName.toLowerCase()}.`}
            >
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                    <SchemaForm
                        schema={schema}
                        onSubmit={handleSubmit}
                        mode="create"
                        formId="create-modal-form"
                    />
                </div>
                <div className="shrink-0 flex justify-end pt-4 border-t mt-4">
                    <Button type="submit" form="create-modal-form">Create</Button>
                </div>
            </Modal>
        </>
    );
}
