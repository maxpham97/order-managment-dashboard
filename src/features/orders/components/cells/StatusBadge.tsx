import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    STATUS_CONFIG,
    STATUS_TRANSITIONS,
} from "../../constants/status-config";
import type { OrderStatus } from "../../../../types/order/order-types";

interface StatusBadgeProps {
    status: OrderStatus;
    orderId: string;
    onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export function StatusBadge({ status, orderId, onStatusChange }: StatusBadgeProps) {
    const [open, setOpen] = useState(false);
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

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>{badge}</DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Change status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {transitions.map((next) => {
                    const nextConfig = STATUS_CONFIG[next];
                    return (
                        <DropdownMenuItem
                            key={next}
                            className="gap-2.5 text-sm"
                            onClick={() => {
                                onStatusChange(orderId, next);
                                setOpen(false);
                            }}
                        >
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", nextConfig.dot)} />
                            <span className="font-medium">{nextConfig.label}</span>
                            {status === next && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
