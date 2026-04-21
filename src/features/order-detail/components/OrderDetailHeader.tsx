import { ArrowLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildOrderEditPath } from "../../../constants/router-paths";
import { StatusBadge } from "../../orders/components/cells/StatusBadge";
import type { Order } from "../../../types/order/order";
import type { OrderStatus } from "../../../types/order/order-types";
import { ROUTERS_PATHS } from "../../../constants/router-paths";

interface OrderDetailHeaderProps {
    order: Order;
    onStatusChange: (orderId: string, status: OrderStatus, reason?: string) => Promise<void> | void;
    onDelete: () => void;
    isDeleting?: boolean;
}

export function OrderDetailHeader({
    order,
    onStatusChange,
    onDelete,
    isDeleting,
}: OrderDetailHeaderProps) {
    const routeCities = order.stops
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((s) => s.address.city);

    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <Link
                to={ROUTERS_PATHS.ORDERS}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Orders
            </Link>

            {/* Main header row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{order.referenceNumber}</h1>
                        <StatusBadge
                            status={order.status}
                            orderId={order.id}
                            onStatusChange={onStatusChange}
                        />
                    </div>

                    {/* Route trail */}
                    <div className="flex items-center flex-wrap gap-1.5 text-sm">
                        {routeCities.map((city, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && (
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                                )}
                                <span className={cn(
                                    i === 0 || i === routeCities.length - 1
                                        ? "font-semibold text-foreground"
                                        : "font-medium text-muted-foreground",
                                )}>
                                    {city}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                        <Button variant="outline" size="sm" asChild className="gap-1.5">
                            <Link to={buildOrderEditPath(order.id)}>
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                            </Link>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
