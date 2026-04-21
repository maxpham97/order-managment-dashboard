import { maybeThrow, networkDelay } from "../../lib/mock/network.mock";
import { MOCK_CARRIERS, MOCK_ORDERS } from "../../lib/mock/order/orders.mock";
import type { DraftFormValues } from "../../features/order-new/schema/order-draft.schema";
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

    updateOrderStatus = async (
        id: string,
        status: OrderStatus,
        reason?: string,
    ): Promise<Order> => {
        await networkDelay();
        maybeThrow();

        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (!order) throw new Error(`Order "${id}" not found`);

        const current = resolveStatus(order);
        if (current.status === status) return current;

        statusOverrides.set(id, status);
        order.statusHistory.push({
            from: current.status,
            to: status,
            changedAt: new Date().toISOString(),
            note: reason?.trim() ? reason.trim() : undefined,
        });
        order.updatedAt = new Date().toISOString();

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

    updateOrder = async (id: string, values: DraftFormValues): Promise<Order> => {
        await networkDelay();
        maybeThrow();

        const idx = MOCK_ORDERS.findIndex((o) => o.id === id);
        if (idx === -1) throw new Error(`Order "${id}" not found`);

        const existing = MOCK_ORDERS[idx];
        const carrier = MOCK_CARRIERS.find((c) => c.id === values.carrierId) ?? existing.carrier;

        MOCK_ORDERS[idx] = {
            ...existing,
            clientName: values.clientName,
            referenceNumber: values.referenceNumber,
            carrier,
            equipmentType: values.equipmentType,
            loadType: values.loadType,
            rate: Number(values.rate),
            weight: Number(values.weight),
            notes: values.notes ?? "",
            stops: values.stops.map((s, i) => ({
                id: s.id,
                type: s.type,
                order: i + 1,
                address: { city: s.city, state: s.state, zip: s.zip },
                locationName: s.locationName || undefined,
                refNumber: s.refNumber || undefined,
                appointmentType: s.appointmentType,
                appointmentDate: s.appointmentDate && s.appointmentTime
                    ? `${s.appointmentDate}T${s.appointmentTime}:00`
                    : s.appointmentDate || null,
                notes: s.notes || undefined,
            })),
            updatedAt: new Date().toISOString(),
        };

        return resolveStatus(MOCK_ORDERS[idx]);
    };

    getCarriers = async () => {
        await networkDelay();
        maybeThrow();
        return [...MOCK_CARRIERS];
    };
}

export const orderService = new OrderService();
