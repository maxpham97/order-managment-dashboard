import { Plus } from "lucide-react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MIN_STOPS, MAX_STOPS } from "../../constants/draft.constants";
import type { DraftFormValues } from "../../schema/order-draft.schema";
import { createDefaultStop } from "../../../../lib/utils/draft.utils";
import { StopItem } from "./StopItem";

interface StopsSectionProps {
    register: UseFormRegister<DraftFormValues>;
    control: Control<DraftFormValues>;
    errors: FieldErrors<DraftFormValues>;
}

export function StopsSection({ register, control, errors }: StopsSectionProps) {
    const { fields, append, remove, move } = useFieldArray({ control, name: "stops" });

    const stopsArrayError = errors.stops?.root?.message ?? (errors.stops as { message?: string })?.message;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        3
                    </span>
                    <h2 className="text-sm font-semibold text-foreground">Stops</h2>
                </div>
                <span className="text-xs text-muted-foreground">
                    {fields.length} stop{fields.length !== 1 ? "s" : ""}
                    {" · "}
                    min {MIN_STOPS}, max {MAX_STOPS}
                </span>
            </div>

            {stopsArrayError && (
                <p className="text-xs font-medium text-destructive">{stopsArrayError}</p>
            )}

            <div className="space-y-2.5">
                {fields.map((field, index) => (
                    <StopItem
                        key={field.id}
                        index={index}
                        total={fields.length}
                        register={register}
                        control={control}
                        errors={errors}
                        canRemove={fields.length > MIN_STOPS}
                        onRemove={() => remove(index)}
                        onMoveUp={() => move(index, index - 1)}
                        onMoveDown={() => move(index, index + 1)}
                    />
                ))}
            </div>

            {fields.length < MAX_STOPS && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append(createDefaultStop("stop"))}
                    className="gap-1.5"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Stop
                </Button>
            )}
        </section>
    );
}
