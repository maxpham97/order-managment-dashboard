import { AlertTriangle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder, useUpdateOrder } from "../../api/order/orderQueries";
import { buildOrderDetailPath } from "../../constants/router-paths";
import { EditOrderForm } from "../../features/order-edit/components/EditOrderForm";
import type { DraftFormValues } from "../../features/order-new/schema/order-draft.schema";
import { orderToFormValues } from "../../lib/utils/order-form.utils";

const FORM_ID = "edit-order-form";

function EditSkeleton() {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-56" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
    );
}

export default function OrderEditPage() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: order, isLoading, isError, refetch } = useOrder(id);
    const { mutate: updateOrder, isPending } = useUpdateOrder();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1440px] px-6 py-8">
                    <EditSkeleton />
                </div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertTriangle className="h-10 w-10 text-destructive/60" />
                    <p className="text-sm font-medium text-muted-foreground">Failed to load order.</p>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Only pending orders are editable
    if (order.status !== "pending") {
        return <Navigate to={buildOrderDetailPath(id)} replace />;
    }

    const handleSubmit = (values: DraftFormValues) => {
        updateOrder({ id, values }, {
            onSuccess: () => navigate(buildOrderDetailPath(id)),
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1440px] px-6 py-8 space-y-6">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        to={buildOrderDetailPath(id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to {order.referenceNumber}
                    </Link>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Edit {order.referenceNumber}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Make changes and save. Only available while order is{" "}
                                <span className="font-medium text-amber-600">Pending</span>.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link to={buildOrderDetailPath(id)}>Cancel</Link>
                            </Button>
                            <Button
                                type="submit"
                                form={FORM_ID}
                                size="sm"
                                disabled={isPending}
                                className="gap-1.5 min-w-16"
                            >
                                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                {isPending ? "Saving…" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form card */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <EditOrderForm
                        formId={FORM_ID}
                        defaultValues={orderToFormValues(order)}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
