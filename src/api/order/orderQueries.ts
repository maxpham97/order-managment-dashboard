import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../querykeys";
import { orderService, type GetOrdersParams } from "./orderService";

export const useOrders = (params: GetOrdersParams) =>
    useQuery({
        queryKey: queryKeys.orders.list(params),
        queryFn: () => orderService.getOrders(params),
        placeholderData: (prev) => prev,
    });

export const useOrder = (id: string) =>
    useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: () => orderService.getOrder(id),
        enabled: Boolean(id),
    });

export const useCarriers = () =>
    useQuery({
        queryKey: queryKeys.carriers.list(),
        queryFn: () => orderService.getCarriers(),
        staleTime: Infinity,
    });

export const useUpdateOrderStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            status,
            reason,
        }: { id: string; status: Parameters<typeof orderService.updateOrderStatus>[1]; reason?: string }) =>
            orderService.updateOrderStatus(id, status, reason),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.all });
        },
    });
};

export const useDeleteOrder = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => orderService.deleteOrder(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.all });
        },
    });
};

export const useUpdateOrder = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, values }: { id: string; values: Parameters<typeof orderService.updateOrder>[1] }) =>
            orderService.updateOrder(id, values),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
            qc.invalidateQueries({ queryKey: queryKeys.orders.lists() });
        },
    });
};
