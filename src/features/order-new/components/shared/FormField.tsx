import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function FormField({ label, error, required, className, children }: FormFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <label className="text-xs font-medium text-muted-foreground">
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-[11px] font-medium text-destructive leading-tight">{error}</p>
            )}
        </div>
    );
}
