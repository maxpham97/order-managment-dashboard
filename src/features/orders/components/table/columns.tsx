import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Boxes, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "../../../../types/order/order";
import type { OrderStatus } from "../../../../types/order/order-types";
import { ActionsMenu } from "../cells/ActionsMenu";
import { RouteCell } from "../cells/RouteCell";
import { StatusBadge } from "../cells/StatusBadge";

const EQUIPMENT_LABELS: Record<string, string> = {
    dry_van: "Dry Van",
    reefer: "Reefer",
    flatbed: "Flatbed",
    step_deck: "Step Deck",
};

interface SortHeaderProps {
    label: string;
    field: string;
    currentSort: string;
    sortOrder: "asc" | "desc";
    onSort: (field: string) => void;
}

function SortHeader({ label, field, currentSort, sortOrder, onSort }: SortHeaderProps) {
    const isActive = currentSort === field;
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "-ml-2 h-7 gap-1 text-[11px] font-semibold tracking-widest uppercase",
                isActive
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground/80 hover:text-foreground",
            )}
            onClick={() => onSort(field)}
        >
            {label}
            {isActive ? (
                sortOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                ) : (
                    <ArrowDown className="h-3 w-3" />
                )
            ) : (
                <ArrowUpDown className="h-3 w-3 opacity-30" />
            )}
        </Button>
    );
}

interface ColumnsConfig {
    currentSort: string;
    sortOrder: "asc" | "desc";
    onSort: (field: string) => void;
    onStatusChange: (orderId: string, status: OrderStatus, reason?: string) => Promise<void> | void;
    onView: (order: Order) => void;
    onEdit: (order: Order) => void;
    onDuplicate: (order: Order) => void;
    onDelete: (order: Order) => void;
    deletingId?: string;
}

export function getOrderColumns({
    currentSort,
    sortOrder,
    onSort,
    onStatusChange,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    deletingId,
}: ColumnsConfig): ColumnDef<Order>[] {
    return [
        {
            accessorKey: "referenceNumber",
            size: 155,
            header: () => (
                <SortHeader
                    label="Ref #"
                    field="referenceNumber"
                    currentSort={currentSort}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="font-mono text-xs font-bold tracking-tight text-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
                    {row.original.referenceNumber}
                </span>
            ),
        },
        {
            accessorKey: "status",
            size: 145,
            header: () => (
                <SortHeader
                    label="Status"
                    field="status"
                    currentSort={currentSort}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.status}
                    orderId={row.original.id}
                    onStatusChange={onStatusChange}
                />
            ),
        },
        {
            id: "route",
            size: 270,
            header: () => (
                <span className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
                    Route
                </span>
            ),
            cell: ({ row }) => <RouteCell stops={row.original.stops} />,
        },
        {
            id: "carrier",
            size: 175,
            header: () => (
                <span className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
                    Carrier
                </span>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/15">
                        <Truck className="h-3.5 w-3.5 text-primary/70" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground leading-tight">
                            {row.original.carrier.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                            {row.original.carrier.mcNumber}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "equipmentType",
            size: 115,
            header: () => (
                <span className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
                    Equipment
                </span>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <span className="text-sm text-foreground">
                        {EQUIPMENT_LABELS[row.original.equipmentType] ?? row.original.equipmentType}
                    </span>
                </div>
            ),
        },
        {
            id: "pickupDate",
            size: 120,
            header: () => (
                <SortHeader
                    label="Pickup"
                    field="pickupDate"
                    currentSort={currentSort}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const pickup = row.original.stops.find((s) => s.type === "pick_up");
                if (!pickup?.appointmentDate)
                    return <span className="text-xs text-muted-foreground">—</span>;
                const date = new Date(pickup.appointmentDate);
                return (
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-foreground">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {date.toLocaleDateString("en-US", { year: "numeric" })}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "rate",
            size: 100,
            header: () => (
                <SortHeader
                    label="Rate"
                    field="rate"
                    currentSort={currentSort}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    ${row.original.rate.toLocaleString()}
                </span>
            ),
        },
        {
            id: "stops",
            size: 75,
            header: () => (
                <span className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
                    Stops
                </span>
            ),
            cell: ({ row }) => (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted/80 px-2 text-xs font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
                    {row.original.stops.length}
                </span>
            ),
        },
        {
            id: "actions",
            size: 48,
            cell: ({ row }) => (
                <ActionsMenu
                    order={row.original}
                    onView={onView}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    isDeleting={deletingId === row.original.id}
                />
            ),
        },
    ];
}
