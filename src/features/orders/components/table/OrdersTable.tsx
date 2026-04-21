import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
    DataTable,
    DataTableError,
    DataTablePagination,
    DataTableSkeleton,
} from "@/components/data-table";
import { useDeleteOrder, useOrders, useUpdateOrderStatus } from "../../../../api/order/orderQueries";
import type { OrderSortField } from "../../../../api/order/orderService";
import { ROUTERS_PATHS } from "../../../../constants/router-paths";
import type { Order } from "../../../../types/order/order";
import type { OrderStatus } from "../../../../types/order/order-types";
import { useLocalDrafts } from "../../hooks/useLocalDrafts";
import type { OrdersTableState, OrdersTableActions } from "../../hooks/useOrdersTableState";
import { getOrderColumns } from "./columns";
import { OrdersTableToolbar } from "./OrdersTableToolbar";

const COLUMN_COUNT = 9;

type OrdersTableProps = Pick<
    OrdersTableState,
    "page" | "pageSize" | "sortBy" | "sortOrder" | "statuses" | "search" | "debouncedSearch"
> &
    Pick<OrdersTableActions, "setPage" | "setPageSize" | "setSorting" | "toggleStatus" | "setSearch" | "clearFilters" | "hasActiveFilters">;

export function OrdersTable({
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
}: OrdersTableProps) {
    const navigate = useNavigate();
    const { saveDraft } = useLocalDrafts();

    const { data, isLoading, isError, error, refetch } = useOrders({
        page,
        pageSize,
        sortBy,
        sortOrder,
        statuses,
        search: debouncedSearch,
    });

    const { mutate: updateStatus } = useUpdateOrderStatus();
    const { mutate: deleteOrder, variables: deletingId } = useDeleteOrder();

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        updateStatus({ id: orderId, status });
    };

    const handleDuplicate = (order: Order) => {
        saveDraft(
            {
                referenceNumber: `${order.referenceNumber}-COPY`,
                clientName: order.clientName,
                carrier: order.carrier,
                equipmentType: order.equipmentType,
                loadType: order.loadType,
                weight: order.weight,
                rate: order.rate,
                notes: order.notes,
                stops: [],
            },
            `Copy of ${order.referenceNumber}`,
        );
    };

    const columns = getOrderColumns({
        currentSort: sortBy,
        sortOrder,
        onSort: (f) => setSorting(f as OrderSortField),
        onStatusChange: handleStatusChange,
        onView: (o) => navigate(`${ROUTERS_PATHS.ORDERS}/${o.id}`),
        onEdit: (o) => navigate(`${ROUTERS_PATHS.ORDERS}/${o.id}/edit`),
        onDuplicate: handleDuplicate,
        onDelete: (o) => deleteOrder(o.id),
        deletingId: typeof deletingId === "string" ? deletingId : undefined,
    });

    const total = data?.total ?? 0;

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: Math.ceil(total / pageSize),
        state: {
            pagination: { pageIndex: page - 1, pageSize },
        },
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function"
                    ? updater({ pageIndex: page - 1, pageSize })
                    : updater;
            if (next.pageSize !== pageSize) {
                setPageSize(next.pageSize);
            } else {
                setPage(next.pageIndex + 1);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    return (
        <div className="space-y-3">
            <OrdersTableToolbar
                search={search}
                statuses={statuses}
                hasActiveFilters={hasActiveFilters}
                onSearchChange={setSearch}
                onStatusToggle={toggleStatus}
                onClearFilters={clearFilters}
            />

            {isError ? (
                <DataTableError
                    message={(error as Error)?.message}
                    onRetry={() => refetch()}
                />
            ) : isLoading ? (
                <DataTableSkeleton columnCount={COLUMN_COUNT} rowCount={pageSize} />
            ) : (
                <DataTable table={table} />
            )}

            {!isError && (
                <DataTablePagination
                    table={table}
                    total={total}
                    pageSizeOptions={[10, 25, 50]}
                />
            )}
        </div>
    );
}
