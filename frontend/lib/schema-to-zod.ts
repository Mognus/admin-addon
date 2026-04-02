import { z } from "zod";
import type { Schema, Field } from "../types";

/**
 * Converts a backend Schema to a Zod validation schema
 */
export function schemaToZod(schema: Schema, mode: "create" | "edit" = "create") {
    const shape: Record<string, z.ZodTypeAny> = {};

    schema.fields.forEach((field) => {
        // Skip readonly fields (always)
        if (field.readonly) {
            return;
        }

        if (mode === "edit" && field.editHidden) return;
        if (mode === "create" && field.createHidden) return;

        let zodField = fieldToZod(field);

        // Make optional if not required
        if (!field.required) {
            zodField = zodField.optional();
        }

        shape[field.name] = zodField;
    });

    return z.object(shape);
}

/**
 * Converts a single Field to a Zod type
 */
function fieldToZod(field: Field): z.ZodTypeAny {
    switch (field.type) {
        case "string":
            if (field.enumValues && field.enumValues.length > 0) {
                // Enum field
                return z.enum(field.enumValues as [string, ...string[]]);
            }
            return z.string().min(1, `${field.label} is required`);

        case "number":
            return z.coerce.number({
                message: `${field.label} must be a number`,
            });

        case "boolean":
            return z.coerce.boolean();

        case "date":
            return z.coerce.date({
                message: `${field.label} must be a valid date`,
            });

        case "relation":
            // Relation fields store the FK ID as a number
            return z.coerce.number({
                message: `${field.label} must be selected`,
            });

        case "file":
            return z.any(); // handled as multipart, skipped in client validation

        default:
            return z.string();
    }
}
