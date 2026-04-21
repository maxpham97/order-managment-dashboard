import { AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder, useDeleteOrder, useUpdateOrderStatus } from "../../api/order/orderQueries";
import { ROUTERS_PATHS } from "../../constants/router-paths";
import { OrderDetailHeader } from "../../features/order-detail/components/OrderDetailHeader";
import { OrderInfoCard } from "../../features/order-detail/components/OrderInfoCard";
import { StopsCard } from "../../features/order-detail/components/StopsCard";
import { StatusHistoryCard } from "../../features/order-detail/components/StatusHistoryCard";
import type { OrderStatus } from "../../types/order/order-types";

function OrderDetailSkeleton() {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <Skeleton className="h-64 rounded-xl lg:col-span-2" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: order, isLoading, isError, refetch } = useOrder(id);
    const { mutateAsync: updateStatus } = useUpdateOrderStatus();
    const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

    const handleStatusChange = async (orderId: string, status: OrderStatus, reason?: string) => {
        try {
            await updateStatus({ id: orderId, status, reason });
            toast.success(`Status changed to ${status.replace("_", " ")}`);
        } catch (e) {
            toast.error((e as Error)?.message ?? "Failed to update status");
            throw e;
        }
    };

    const handleDelete = () => {
        deleteOrder(id, {
            onSuccess: () => navigate(ROUTERS_PATHS.ORDERS),
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1200px] px-6 py-6">
                    <OrderDetailSkeleton />
                </div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertTriangle className="h-10 w-10 text-destructive/60" />
                    <p className="text-sm font-medium text-muted-foreground">
                        Failed to load order. It may not exist.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
                <OrderDetailHeader
                    order={order}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />

                <OrderInfoCard order={order} />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <StopsCard order={order} />
                    </div>
                    <div>
                        <StatusHistoryCard
                            order={order}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
