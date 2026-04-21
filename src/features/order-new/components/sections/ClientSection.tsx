import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { DraftFormValues } from "../../schema/order-draft.schema";
import { FormField } from "../shared/FormField";

interface ClientSectionProps {
    register: UseFormRegister<DraftFormValues>;
    errors: FieldErrors<DraftFormValues>;
}

export function ClientSection({ register, errors }: ClientSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    1
                </span>
                <h2 className="text-sm font-semibold text-foreground">Client</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Client Name" required error={errors.clientName?.message}>
                    <Input
                        {...register("clientName")}
                        placeholder="Acme Corp"
                        className={errors.clientName ? "border-destructive" : ""}
                    />
                </FormField>

                <FormField label="Reference #" required error={errors.referenceNumber?.message}>
                    <Input
                        {...register("referenceNumber")}
                        placeholder="ORD-2026-0001"
                        className={errors.referenceNumber ? "border-destructive" : ""}
                    />
                </FormField>
            </div>
        </section>
    );
}
