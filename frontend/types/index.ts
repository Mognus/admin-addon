// Admin Module Types

export interface SelectOption {
    value: number | string;
    label: string;
}

export interface Field {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "enum" | "relation" | "object" | "file";
    label: string;
    required: boolean;
    readonly: boolean;
    tableHidden?: boolean;  // Hide from table view
    editHidden?: boolean;   // Hide in edit form
    createHidden?: boolean; // Hide in create form
    enumValues?: string[];
    options?: SelectOption[]; // For relation fields
    uploadUrl?: string;       // For file fields
    accept?: string;          // File accept filter e.g. ".glb", "image/*"
}

export interface Schema {
    name: string;
    displayName: string;
    fields: Field[];
    searchable: string[];
}

export interface ModelInfo {
    name: string;
    displayName: string;
}

export interface ListResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ListParams {
    page?: number;
    limit?: number;
    [key: string]: any; // Dynamic filters
}
