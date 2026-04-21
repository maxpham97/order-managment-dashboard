import { cn } from "@/lib/utils";
import type { Order } from "../../../types/order/order";
import type { OrderStatus } from "../../../types/order/order-types";
import { STATUS_CONFIG, STATUS_TRANSITIONS } from "../../orders/constants/status-config";
import { StatusBadge } from "../../orders/components/cells/StatusBadge";

interface StatusHistoryCardProps {
    order: Order;
    onStatusChange: (orderId: string, status: OrderStatus, reason?: string) => Promise<void> | void;
}

function formatHistoryDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

const ACTION_LABEL: Record<string, string> = {
    pending:    "Created",
    in_transit: "Picked up",
    delivered:  "Delivered",
    cancelled:  "Cancelled",
};

export function StatusHistoryCard({ order, onStatusChange }: StatusHistoryCardProps) {
    const history = [...order.statusHistory].sort(
        (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime(),
    );

    const canChangeStatus = STATUS_TRANSITIONS[order.status].length > 0;

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold">Status History</h2>
                {canChangeStatus && (
                    <StatusBadge
                        status={order.status}
                        orderId={order.id}
                        onStatusChange={onStatusChange}
                    />
                )}
            </div>

            <div className="px-6 py-5">
                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No history recorded.</p>
                ) : (
                    <div className="space-y-0">
                        {history.map((entry, i) => {
                            const isLatest = i === history.length - 1;
                            const config = STATUS_CONFIG[entry.to];
                            const actionLabel = ACTION_LABEL[entry.to] ?? config.label;

                            return (
                                <div key={i} className="flex gap-4">
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center pt-1">
                                        <div
                                            className={cn(
                                                "h-3 w-3 shrink-0 rounded-full transition-all",
                                                config.dot,
                                                isLatest
                                                    ? "scale-125 ring-4 ring-offset-2 ring-offset-card opacity-100"
                                                    : "opacity-40",
                                            )}
                                            style={isLatest ? { "--tw-ring-color": "color-mix(in oklch, currentColor 20%, transparent)" } as React.CSSProperties : undefined}
                                        />
                                        {i < history.length - 1 && (
                                            <div className="mt-2 w-px flex-1 bg-border/50 min-h-[44px]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={cn("flex-1 min-w-0", i < history.length - 1 && "pb-6")}>
                                        {/* Action + badges */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={cn(
                                                "text-sm font-semibold",
                                                isLatest ? "text-foreground" : "text-muted-foreground",
                                            )}>
                                                {actionLabel}
                                            </span>
                                            <span className={cn(
                                                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                                config.className,
                                                !isLatest && "opacity-50",
                                            )}>
                                                {config.label}
                                            </span>
                                            {isLatest && (
                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                    Latest
                                                </span>
                                            )}
                                        </div>

                                        {/* Date */}
                                        <time className={cn(
                                            "mt-0.5 block text-xs",
                                            isLatest ? "text-muted-foreground" : "text-muted-foreground/60",
                                        )}>
                                            {formatHistoryDate(entry.changedAt)}
                                        </time>

                                        {/* Note */}
                                        {entry.note && (
                                            <p className="mt-1 text-xs text-muted-foreground italic">
                                                {entry.note}
                                            </p>
                                        )}

                                        {/* From */}
                                        {entry.from && (
                                            <p className="mt-0.5 text-[11px] text-muted-foreground/50">
                                                from{" "}
                                                <span className="font-medium">
                                                    {STATUS_CONFIG[entry.from]?.label ?? entry.from}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
