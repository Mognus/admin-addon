import { type ColumnDef } from "@tanstack/react-table";
import { EditModal } from "@/addons/admin-addon/frontend/components/EditModal";
import { DeleteModal } from "@/addons/admin-addon/frontend/components/DeleteModal";
import { formatValue } from "@/addons/admin-addon/frontend/lib/formatValue";
import type { Schema } from "@/addons/admin-addon/frontend/types";

export function buildColumns(schema: Schema, modelName: string): ColumnDef<any>[] {
    const visibleFields = schema.fields.filter((f) => !f.tableHidden);
    return [
        ...visibleFields.map((field) => ({
            id: field.name,
            accessorKey: field.name,
            header: field.label,
            enableSorting: !["object", "file", "boolean"].includes(field.type),
            cell: ({ getValue }: any) => formatValue(getValue(), field),
        })),
        {
            id: "_actions",
            header: () => <span className="flex justify-end">Actions</span>,
            enableHiding: false,
            cell: ({ row }: any) => (
                <div className="flex justify-end gap-2">
                    <EditModal
                        modelName={modelName}
                        schema={schema}
                        recordId={row.original.id}
                        initialData={row.original}
                    />
                    <DeleteModal
                        modelName={modelName}
                        recordId={row.original.id}
                        displayName={row.original.name || row.original.title || row.original.email}
                    />
                </div>
            ),
        },
    ];
}
