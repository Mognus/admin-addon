"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { mutate } from "swr";
import { Modal } from "@/components/Modal";
import { ActionButton } from "@/addons/ui-core-addon/frontend/components/action-button";
import { Button } from "@/components/ui/button";
import { deleteRecord } from "../lib/api";

interface DeleteModalProps {
    modelName: string;
    recordId: string | number;
    displayName?: string;
}

export function DeleteModal({ modelName, recordId, displayName }: DeleteModalProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteRecord(modelName, String(recordId));
            mutate(`/admin/api/${modelName}`);
            mutate((key) => typeof key === "string" && key.startsWith(`/admin/api/${modelName}?`));
            setOpen(false);
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <ActionButton
                icon={Trash2}
                variant="ghost"
                iconClassName="text-destructive"
                onClick={() => setOpen(true)}
            />
            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Confirm Deletion"
                description={
                    displayName
                        ? `Are you sure you want to delete "${displayName}"? This action cannot be undone.`
                        : "Are you sure you want to delete this record? This action cannot be undone."
                }
            >
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
