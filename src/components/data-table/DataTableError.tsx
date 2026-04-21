import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DataTableErrorProps {
    message?: string;
    onRetry?: () => void;
}

export function DataTableError({
    message = "Failed to load data.",
    onRetry,
}: DataTableErrorProps) {
    return (
        <div className="flex min-h-[260px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-destructive/25 bg-destructive/4">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">Something went wrong</p>
                    <p className="mt-1 max-w-[280px] text-xs text-muted-foreground">{message}</p>
                </div>
            </div>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                </Button>
            )}
        </div>
    );
}
