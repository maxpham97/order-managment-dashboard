import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { orderDraftSchema, type DraftFormValues } from "../schema/order-draft.schema";
import { useDraftAutoSave } from "../hooks/useDraftAutoSave";
import { ClientSection } from "./sections/ClientSection";
import { OrderSection } from "./sections/OrderSection";
import { StopsSection } from "./sections/StopsSection";

interface DraftWorkspaceFormProps {
    tabId: string;
    defaultValues: Partial<DraftFormValues>;
    onSubmit: (values: DraftFormValues) => void;
    formId: string;
}

export function DraftWorkspaceForm({
    tabId,
    defaultValues,
    onSubmit,
    formId,
}: DraftWorkspaceFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<DraftFormValues>({
        resolver: zodResolver(orderDraftSchema),
        // structuredClone breaks the Immer read-only freeze so RHF can mutate internally
        defaultValues: structuredClone(defaultValues) as DraftFormValues,
    });

    // When tab switches (tabId changes), reset the form with the new tab's data
    useEffect(() => {
        reset(structuredClone(defaultValues) as DraftFormValues);
    }, [tabId]); // eslint-disable-line react-hooks/exhaustive-deps

    useDraftAutoSave(tabId, getValues);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-5 py-5">
            <ClientSection register={register} errors={errors} />
            <Separator />
            <OrderSection register={register} control={control} errors={errors} />
            <Separator />
            <StopsSection register={register} control={control} errors={errors} />
        </form>
    );
}
