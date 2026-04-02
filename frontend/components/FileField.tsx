"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Field } from "../types";

interface FileFieldProps {
    field: Field;
    defaultValue?: string;
}

export function FileField({ field, defaultValue }: FileFieldProps) {
    const [mode, setMode] = useState<"upload" | "url">("upload");
    const [preview, setPreview] = useState<string | null>(null);

    const acceptMap = field.accept
        ? { [field.accept]: field.accept === "model/gltf-binary" ? [".glb"] : [] }
        : { "image/*": [] };

    const showUrlToggle = !field.accept || field.accept.startsWith("image");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: ([file]) => { if (file) setPreview(URL.createObjectURL(file)); },
        multiple: false,
        accept: acceptMap,
        noClick: false,
    });

    return (
        <div className="space-y-2">
            {showUrlToggle && (
                <div className="flex rounded-md border border-input overflow-hidden text-sm w-fit">
                    <button
                        type="button"
                        onClick={() => setMode("upload")}
                        className={`px-3 py-1.5 ${mode === "upload" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("url")}
                        className={`px-3 py-1.5 ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
                    >
                        URL
                    </button>
                </div>
            )}

            <div className="h-32">
                {mode === "upload" ? (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "flex items-center justify-center h-full w-full rounded-md border-2 border-dashed border-input bg-background text-sm text-muted-foreground cursor-pointer transition-colors",
                            isDragActive && "border-primary bg-primary/5 text-primary"
                        )}
                    >
                        <input {...getInputProps()} name="file" />
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-full max-w-full rounded object-contain" />
                        ) : (
                            <p>{isDragActive ? "Datei ablegen..." : "Datei hierher ziehen oder klicken"}</p>
                        )}
                    </div>
                ) : (
                    <Input
                        name={field.name}
                        type="text"
                        placeholder="https://..."
                        defaultValue={defaultValue || ""}
                        className="h-full"
                    />
                )}
            </div>
        </div>
    );
}
