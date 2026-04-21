import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    STATUS_CONFIG,
    STATUS_TRANSITIONS,
} from "../../constants/status-config";
import type { OrderStatus } from "../../../../types/order/order-types";

interface StatusBadgeProps {
    status: OrderStatus;
    orderId: string;
    onStatusChange?: (orderId: string, status: OrderStatus, reason?: string) => Promise<void> | void;
}

export function StatusBadge({ status, orderId, onStatusChange }: StatusBadgeProps) {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
    const config = STATUS_CONFIG[status];
    const transitions = STATUS_TRANSITIONS[status];
    const isTerminal = transitions.length === 0;

    const badge = (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all select-none",
                config.className,
                !isTerminal && onStatusChange && "cursor-pointer hover:opacity-80 active:scale-95",
            )}
        >
            <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                config.dot,
                status === "in_transit" && "animate-pulse",
            )} />
            {config.label}
            {!isTerminal && onStatusChange && (
                <ChevronDown className={cn("h-2.5 w-2.5 opacity-50 transition-transform", open && "rotate-180")} />
            )}
        </span>
    );

    if (isTerminal || !onStatusChange) return badge;

    const handleChange = async (next: OrderStatus, reason?: string) => {
        setPendingStatus(next);
        try {
            await onStatusChange(orderId, next, reason);
            setOpen(false);
            setConfirmOpen(false);
            setCancelReason("");
        } finally {
            setPendingStatus(null);
        }
    };

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>{badge}</DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                    <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Change status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {transitions.map((next) => {
                        const nextConfig = STATUS_CONFIG[next];
                        const isLoading = pendingStatus === next;
                        return (
                            <DropdownMenuItem
                                key={next}
                                className="gap-2.5 text-sm"
                                disabled={Boolean(pendingStatus)}
                                onClick={() => {
                                    if (next === "cancelled") {
                                        setConfirmOpen(true);
                                        return;
                                    }
                                    void handleChange(next);
                                }}
                            >
                                <span className={cn("h-2 w-2 shrink-0 rounded-full", nextConfig.dot)} />
                                <span className="font-medium">{nextConfig.label}</span>
                                {isLoading && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                                {status === next && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cancellation requires a reason. This note will be stored in status history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Reason *</label>
                        <Input
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={pendingStatus === "cancelled"}>
                            Back
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (!cancelReason.trim()) return;
                                void handleChange("cancelled", cancelReason.trim());
                            }}
                            disabled={!cancelReason.trim() || pendingStatus === "cancelled"}
                        >
                            {pendingStatus === "cancelled" ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Cancelling...
                                </span>
                            ) : (
                                "Confirm Cancel"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
