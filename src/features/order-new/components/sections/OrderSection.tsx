import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { DraftFormValues } from "../../schema/order-draft.schema";
import { EQUIPMENT_OPTIONS, LOAD_TYPE_OPTIONS } from "../../constants/draft.constants";
import { FormField } from "../shared/FormField";
import { CarrierCombobox } from "../shared/CarrierCombobox";
import type { Carrier } from "../../../../types/order/order-types";

interface OrderSectionProps {
    register: UseFormRegister<DraftFormValues>;
    control: Control<DraftFormValues>;
    errors: FieldErrors<DraftFormValues>;
}

export function OrderSection({ register, control, errors }: OrderSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    2
                </span>
                <h2 className="text-sm font-semibold text-foreground">Order</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="Carrier" required error={errors.carrierId?.message} className="lg:col-span-2">
                    <Controller
                        name="carrierId"
                        control={control}
                        render={({ field }) => (
                            <CarrierCombobox
                                value={field.value ?? ""}
                                onChange={(carrier: Carrier) => {
                                    field.onChange(carrier.id);
                                    // also update display fields via setValue via control
                                }}
                                error={errors.carrierId?.message}
                            />
                        )}
                    />
                </FormField>

                <FormField label="Equipment Type" required error={errors.equipmentType?.message}>
                    <Controller
                        name="equipmentType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={errors.equipmentType ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EQUIPMENT_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>

                <FormField label="Load Type" required error={errors.loadType?.message}>
                    <Controller
                        name="loadType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={errors.loadType ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOAD_TYPE_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Rate ($)" required error={errors.rate?.message}>
                    <Input
                        {...register("rate")}
                        type="number"
                        min={0}
                        placeholder="1250"
                        className={errors.rate ? "border-destructive" : ""}
                    />
                </FormField>

                <FormField label="Weight (lbs)" required error={errors.weight?.message}>
                    <Input
                        {...register("weight")}
                        type="number"
                        min={0}
                        placeholder="12000"
                        className={errors.weight ? "border-destructive" : ""}
                    />
                </FormField>

                <FormField label="Note" error={errors.notes?.message}>
                    <Input
                        {...register("notes")}
                        placeholder="Fragile cargo, special instructions…"
                    />
                </FormField>
            </div>
        </section>
    );
}
