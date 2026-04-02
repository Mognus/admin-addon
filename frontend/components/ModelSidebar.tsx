"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ModelInfo } from "../types";

interface ModelSidebarProps {
    models: ModelInfo[];
    selectedModel: string | null;
    loading: boolean;
    onSelect: (modelName: string) => void;
}

export function ModelSidebar({ models, selectedModel, loading, onSelect }: ModelSidebarProps) {
    return (
        <div className="flex flex-col min-h-0">
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-base">Models</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {loading && !models.length && (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    )}
                    {models.map((model) => (
                        <Button
                            key={model.name}
                            variant={selectedModel === model.name ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => onSelect(model.name)}
                        >
                            {model.displayName}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
