import { Package, Plus, TruckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ROUTERS_PATHS } from "../../constants/router-paths";
import { LocalDraftsSection } from "../../features/orders/components/LocalDraftsSection";
import { OrdersTable } from "../../features/orders/components/table/OrdersTable";
import { useLocalDrafts } from "../../features/orders/hooks/useLocalDrafts";
import { useOrdersTableState } from "../../features/orders/hooks/useOrdersTableState";
import type { Order } from "../../types/order/order";

export default function OrdersPage() {
    const navigate = useNavigate();
    const tableState = useOrdersTableState();
    const { drafts, saveDraft, discardDraft, discardAll } = useLocalDrafts();

    const handleDuplicateDraft = (order: Order) => {
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

    return (
        <div className="min-h-screen bg-background">
            {/* Top accent line */}
            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent" />

            <div className="mx-auto max-w-[1440px] px-6 py-7 space-y-6">

                {/* Page header */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-5 shadow-sm">
                    <div className="absolute inset-0 bg-linear-to-r from-primary/6 via-primary/2 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <TruckIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                                        Orders
                                    </h1>
                                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                                        TMS
                                    </span>
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Transportation Management System
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate(ROUTERS_PATHS.ORDERS_NEW)}
                            className="gap-2 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            New Order
                        </Button>
                    </div>
                </div>

                {/* Drafts */}
                <LocalDraftsSection
                    drafts={drafts}
                    onDiscard={discardDraft}
                    onDiscardAll={discardAll}
                />

                {/* Table card */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">All Orders</span>
                        <Separator orientation="vertical" className="mx-1 h-4" />
                        <span className="text-xs text-muted-foreground">
                            Manage and track your shipments
                        </span>
                    </div>
                    <div className="p-5">
                        <OrdersTable {...tableState} onDuplicateDraft={handleDuplicateDraft} />
                    </div>
                </div>
            </div>
        </div>
    );
}
