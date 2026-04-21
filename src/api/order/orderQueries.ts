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
        mutationFn: ({ id, status }: Parameters<typeof orderService.updateOrderStatus>[0] extends string
            ? { id: string; status: Parameters<typeof orderService.updateOrderStatus>[1] }
            : never) => orderService.updateOrderStatus(id, status),
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
