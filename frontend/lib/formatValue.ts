import type { Field } from "../types";

export function formatValue(value: any, field: Field): string {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (field.type === "relation" && field.options) {
        const option = field.options.find((o) => o.value === value);
        return option?.label || String(value);
    }
    if (field.type === "object" && typeof value === "object") {
        return value.name ?? value.label ?? value.title ?? JSON.stringify(value);
    }
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}
