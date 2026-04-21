import { maybeThrow, networkDelay } from "../../lib/mock/network.mock";
import { MOCK_CARRIERS, MOCK_ORDERS } from "../../lib/mock/order/orders.mock";
import type { Order } from "../../types/order/order";
import type { OrderStatus } from "../../types/order/order-types";

export type OrderSortField = keyof Pick<
    Order,
    "createdAt" | "rate" | "weight" | "referenceNumber" | "clientName" | "status"
> | "pickupDate";

export interface GetOrdersParams {
    page: number;
    pageSize: number;
    sortBy?: OrderSortField;
    sortOrder?: "asc" | "desc";
    statuses?: OrderStatus[];
    search?: string;
}

export interface GetOrdersResult {
    data: Order[];
    total: number;
}

// in-memory store for status overrides
const statusOverrides = new Map<string, OrderStatus>();

const resolveStatus = (order: Order): Order =>
    statusOverrides.has(order.id) ? { ...order, status: statusOverrides.get(order.id)! } : order;

const getPickupDate = (order: Order): string =>
    order.stops.find((s) => s.type === "pick_up")?.appointmentDate ?? order.createdAt;

class OrderService {
    getOrders = async (params: GetOrdersParams): Promise<GetOrdersResult> => {
        await networkDelay();
        maybeThrow();

        const { page, pageSize, sortBy = "createdAt", sortOrder = "desc", statuses, search } = params;

        let result = MOCK_ORDERS.map(resolveStatus);

        if (statuses && statuses.length > 0) {
            result = result.filter((o) => statuses.includes(o.status));
        }

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.referenceNumber.toLowerCase().includes(q) ||
                    o.clientName.toLowerCase().includes(q) ||
                    o.carrier.name.toLowerCase().includes(q),
            );
        }

        result.sort((a, b) => {
            const aVal = sortBy === "pickupDate" ? getPickupDate(a) : String(a[sortBy as keyof Order] ?? "");
            const bVal = sortBy === "pickupDate" ? getPickupDate(b) : String(b[sortBy as keyof Order] ?? "");
            return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        const total = result.length;
        const data = result.slice((page - 1) * pageSize, page * pageSize);

        return { data, total };
    };

    getOrder = async (id: string): Promise<Order> => {
        await networkDelay();
        maybeThrow();

        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (!order) throw new Error(`Order "${id}" not found`);
        return resolveStatus(order);
    };

    updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
        await networkDelay();
        maybeThrow();

        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (!order) throw new Error(`Order "${id}" not found`);

        statusOverrides.set(id, status);
        return resolveStatus(order);
    };

    deleteOrder = async (id: string): Promise<void> => {
        await networkDelay();
        maybeThrow();

        const idx = MOCK_ORDERS.findIndex((o) => o.id === id);
        if (idx === -1) throw new Error(`Order "${id}" not found`);
        MOCK_ORDERS.splice(idx, 1);
        statusOverrides.delete(id);
    };

    getCarriers = async () => {
        await networkDelay();
        maybeThrow();
        return [...MOCK_CARRIERS];
    };
}

export const orderService = new OrderService();
