import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { DraftFormValues } from "../../schema/order-draft.schema";
import { APPT_TYPE_OPTIONS, STOP_TYPE_OPTIONS } from "../../constants/draft.constants";
import { FormField } from "../shared/FormField";

interface StopItemProps {
    index: number;
    total: number;
    register: UseFormRegister<DraftFormValues>;
    control: Control<DraftFormValues, any, any>;
    errors: FieldErrors<DraftFormValues>;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    canRemove: boolean;
}


export function StopItem({
    index,
    total,
    register,
    control,
    errors,
    onRemove,
    onMoveUp,
    onMoveDown,
    canRemove,
}: StopItemProps) {
    const stopErrors = errors.stops?.[index];

    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-muted/20 p-4 space-y-3 border-l-4 transition-colors",
                "border-l-border",
            )}
        >
            {/* Stop header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                        {index + 1}
                    </span>
                    <Controller
                        name={`stops.${index}.type`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-7 w-32 text-xs font-semibold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STOP_TYPE_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="flex items-center gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={onMoveUp}
                        disabled={index === 0}
                        className="text-muted-foreground"
                    >
                        <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={onMoveDown}
                        disabled={index === total - 1}
                        className="text-muted-foreground"
                    >
                        <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={onRemove}
                        disabled={!canRemove}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <FormField label="Location Name" className="sm:col-span-2">
                    <Input
                        {...register(`stops.${index}.locationName`)}
                        placeholder="Warehouse, terminal…"
                        className="h-8"
                    />
                </FormField>

                <FormField label="Ref #">
                    <Input
                        {...register(`stops.${index}.refNumber`)}
                        placeholder="PO-1234"
                        className="h-8"
                    />
                </FormField>

                <FormField label="Notes">
                    <Input
                        {...register(`stops.${index}.notes`)}
                        placeholder="Call on arrival…"
                        className="h-8"
                    />
                </FormField>
            </div>

            {/* Address */}
            <div className="grid grid-cols-3 gap-3">
                <FormField label="City" required error={stopErrors?.city?.message}>
                    <Input
                        {...register(`stops.${index}.city`)}
                        placeholder="Dallas"
                        className={cn("h-8", stopErrors?.city && "border-destructive")}
                    />
                </FormField>

                <FormField label="State" required error={stopErrors?.state?.message}>
                    <Input
                        {...register(`stops.${index}.state`)}
                        placeholder="TX"
                        maxLength={2}
                        className={cn("h-8 uppercase", stopErrors?.state && "border-destructive")}
                    />
                </FormField>

                <FormField label="ZIP" required error={stopErrors?.zip?.message}>
                    <Input
                        {...register(`stops.${index}.zip`)}
                        placeholder="75201"
                        className={cn("h-8", stopErrors?.zip && "border-destructive")}
                    />
                </FormField>
            </div>

            {/* Appointment */}
            <div className="grid grid-cols-3 gap-3">
                <FormField label="Date" required error={stopErrors?.appointmentDate?.message}>
                    <Input
                        {...register(`stops.${index}.appointmentDate`)}
                        type="date"
                        className={cn("h-8", stopErrors?.appointmentDate && "border-destructive")}
                    />
                </FormField>

                <FormField label="Time" required error={stopErrors?.appointmentTime?.message}>
                    <Input
                        {...register(`stops.${index}.appointmentTime`)}
                        type="time"
                        className={cn("h-8", stopErrors?.appointmentTime && "border-destructive")}
                    />
                </FormField>

                <FormField label="Appointment Type" error={stopErrors?.appointmentType?.message}>
                    <Controller
                        name={`stops.${index}.appointmentType`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {APPT_TYPE_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-sm">
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>
            </div>
        </div>
    );
}
