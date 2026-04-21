import type { OrderStatus } from "../../../types/order/order-types";

export interface StatusConfig {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    dot: string;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    pending: {
        label: "Pending",
        variant: "outline",
        className: "border-amber-400/60 bg-amber-400/10 text-amber-600 dark:text-amber-400",
        dot: "bg-amber-400",
    },
    in_transit: {
        label: "In Transit",
        variant: "outline",
        className: "border-blue-400/60 bg-blue-400/10 text-blue-600 dark:text-blue-400",
        dot: "bg-blue-400",
    },
    delivered: {
        label: "Delivered",
        variant: "outline",
        className: "border-emerald-400/60 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-400",
    },
    cancelled: {
        label: "Cancelled",
        variant: "outline",
        className: "border-red-400/60 bg-red-400/10 text-red-500 dark:text-red-400",
        dot: "bg-red-400",
    },
};

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["in_transit", "cancelled"],
    in_transit: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];
