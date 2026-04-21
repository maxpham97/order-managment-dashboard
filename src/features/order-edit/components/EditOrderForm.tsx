import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { orderDraftSchema, type DraftFormValues } from "../../order-new/schema/order-draft.schema";
import { ClientSection } from "../../order-new/components/sections/ClientSection";
import { OrderSection } from "../../order-new/components/sections/OrderSection";
import { StopsSection } from "../../order-new/components/sections/StopsSection";

interface EditOrderFormProps {
    formId: string;
    defaultValues: DraftFormValues;
    onSubmit: (values: DraftFormValues) => void;
}

export function EditOrderForm({ formId, defaultValues, onSubmit }: EditOrderFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DraftFormValues>({
        resolver: zodResolver(orderDraftSchema),
        defaultValues: structuredClone(defaultValues),
    });

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-6">
            <ClientSection register={register} errors={errors} />
            <Separator />
            <OrderSection register={register} control={control} errors={errors} />
            <Separator />
            <StopsSection register={register} control={control} errors={errors} />
        </form>
    );
}
