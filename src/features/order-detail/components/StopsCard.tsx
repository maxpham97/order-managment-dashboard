import { cn } from "@/lib/utils";
import type { Order } from "../../../types/order/order";

interface StopsCardProps {
    order: Order;
}

const STOP_TYPE_LABELS: Record<string, string> = {
    pick_up:  "Pick Up",
    drop_off: "Drop Off",
    stop:     "Stop",
};

const APPT_TYPE_LABELS: Record<string, string> = {
    fixed:  "Fixed",
    window: "Window",
    fcfs:   "FCFS",
};

const STOP_DOT: Record<string, string> = {
    pick_up:  "bg-emerald-500",
    drop_off: "bg-red-500",
    stop:     "bg-blue-400",
};

const STOP_TYPE_COLOR: Record<string, string> = {
    pick_up:  "text-emerald-600 dark:text-emerald-400",
    drop_off: "text-red-500 dark:text-red-400",
    stop:     "text-blue-600 dark:text-blue-400",
};

const APPT_TYPE_VARIANT: Record<string, string> = {
    fixed:  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    window: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    fcfs:   "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
};

function formatApptDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function StopsCard({ order }: StopsCardProps) {
    const stops = order.stops.slice().sort((a, b) => a.order - b.order);

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold">Stops</h2>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                    {stops.length}
                </span>
            </div>

            <div className="px-6 py-5">
                {stops.map((stop, i) => {
                    const isLast = i === stops.length - 1;
                    return (
                        <div key={stop.id} className="flex gap-5">
                            {/* Timeline */}
                            <div className="flex flex-col items-center pt-0.5">
                                <div
                                    className={cn(
                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm",
                                        STOP_DOT[stop.type],
                                    )}
                                >
                                    {i + 1}
                                </div>
                                {!isLast && (
                                    <div className="mt-2 w-px flex-1 bg-border/60 min-h-[40px]" />
                                )}
                            </div>

                            {/* Content */}
                            <div className={cn("flex-1 min-w-0", !isLast && "pb-7")}>
                                {/* Top row: type label + appt type badge */}
                                <div className="flex items-center justify-between gap-3">
                                    <span className={cn("text-xs font-bold tracking-wide uppercase", STOP_TYPE_COLOR[stop.type])}>
                                        {STOP_TYPE_LABELS[stop.type]}
                                        {stop.locationName && (
                                            <span className="ml-1.5 font-medium normal-case tracking-normal text-foreground">
                                                · {stop.locationName}
                                            </span>
                                        )}
                                    </span>
                                    <span className={cn(
                                        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                                        APPT_TYPE_VARIANT[stop.appointmentType],
                                    )}>
                                        {APPT_TYPE_LABELS[stop.appointmentType]}
                                    </span>
                                </div>

                                {/* Address */}
                                <p className="mt-1.5 text-sm font-medium text-foreground">
                                    {stop.address.city}, {stop.address.state}{" "}
                                    <span className="font-mono text-muted-foreground">{stop.address.zip}</span>
                                </p>

                                {/* Date */}
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {formatApptDate(stop.appointmentDate)}
                                </p>

                                {/* Meta */}
                                {(stop.refNumber || stop.notes) && (
                                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground/70">
                                        {stop.refNumber && (
                                            <span>Ref: <span className="font-medium">{stop.refNumber}</span></span>
                                        )}
                                        {stop.notes && <span>{stop.notes}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
