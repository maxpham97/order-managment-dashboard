import { useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { OrderSortField } from "../../../api/order/orderService";
import type { OrderStatus } from "../../../types/order/order-types";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc";

export interface OrdersTableState {
    page: number;
    pageSize: number;
    sortBy: OrderSortField;
    sortOrder: "asc" | "desc";
    statuses: OrderStatus[];
    search: string;
    debouncedSearch: string;
}

export interface OrdersTableActions {
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (field: OrderSortField) => void;
    toggleStatus: (status: OrderStatus) => void;
    setSearch: (search: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function useOrdersTableState(): OrdersTableState & OrdersTableActions {
    const [page, setPageRaw] = useState(1);
    const [pageSize, setPageSizeRaw] = useState<number>(10);
    const [sortBy, setSortByRaw] = useState<OrderSortField>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(DEFAULT_SORT_ORDER);
    const [statuses, setStatuses] = useState<OrderStatus[]>([]);
    const [search, setSearchRaw] = useState("");

    const debouncedSearch = useDebounce(search, 300);

    const resetPage = () => setPageRaw(1);

    const setPage = (p: number) => setPageRaw(p);

    const setPageSize = (size: number) => {
        setPageSizeRaw(size);
        resetPage();
    };

    const setSorting = (field: OrderSortField) => {
        if (field === sortBy) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortByRaw(field);
            setSortOrder("asc");
        }
        resetPage();
    };

    const toggleStatus = (status: OrderStatus) => {
        setStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
        );
        resetPage();
    };

    const setSearch = (value: string) => {
        setSearchRaw(value);
        resetPage();
    };

    const clearFilters = () => {
        setStatuses([]);
        setSearchRaw("");
        resetPage();
    };

    const hasActiveFilters = statuses.length > 0 || search.length > 0;

    return {
        page,
        pageSize,
        sortBy,
        sortOrder,
        statuses,
        search,
        debouncedSearch,
        setPage,
        setPageSize,
        setSorting,
        toggleStatus,
        setSearch,
        clearFilters,
        hasActiveFilters,
    };
}
