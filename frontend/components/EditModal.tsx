"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Modal } from "@/components/Modal";
import { Pencil } from "lucide-react";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/ActionButton";
import { Button } from "@/components/ui/button";
import { SchemaForm } from "./SchemaForm";
import { updateRecord, updateRecordMultipart } from "../lib/api";
import type { Schema } from "../types";

interface EditModalProps {
    modelName: string;
    schema: Schema;
    recordId: string | number;
    initialData: Record<string, any>;
}

export function EditModal({ modelName, schema, recordId, initialData }: EditModalProps) {
    const [open, setOpen] = useState(false);

    const handleSubmit = async (data: Record<string, any> | FormData) => {
        if (data instanceof FormData) {
            await updateRecordMultipart(modelName, String(recordId), data);
        } else {
            await updateRecord(modelName, String(recordId), data);
        }

        // Revalidate SWR cache
        mutate(`/admin/api/${modelName}`);
        mutate((key) => typeof key === "string" && key.startsWith(`/admin/api/${modelName}?`));
        mutate(`/admin/api/${modelName}/${recordId}`);

        // Close modal
        setOpen(false);
    };

    return (
        <>
            <ActionButton icon={Pencil} variant="ghost" onClick={() => setOpen(true)} />

            <Modal
                open={open}
                onOpenChange={setOpen}
                title={`Edit ${schema.displayName}`}
                description={`Update the ${schema.displayName.toLowerCase()} information below.`}
            >
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                    <SchemaForm
                        schema={schema}
                        onSubmit={handleSubmit}
                        initialData={initialData}
                        mode="edit"
                        formId="edit-modal-form"
                    />
                </div>
                <div className="shrink-0 flex justify-end pt-4 border-t mt-4">
                    <Button type="submit" form="edit-modal-form">Save Changes</Button>
                </div>
            </Modal>
        </>
    );
}
