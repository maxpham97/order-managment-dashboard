import { Check, ListFilter, Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../../../../types/order/order-types";
import { ALL_STATUSES, STATUS_CONFIG } from "../../constants/status-config";

interface OrdersTableToolbarProps {
    search: string;
    statuses: OrderStatus[];
    hasActiveFilters: boolean;
    onSearchChange: (value: string) => void;
    onStatusToggle: (status: OrderStatus) => void;
    onClearFilters: () => void;
}

export function OrdersTableToolbar({
    search,
    statuses,
    hasActiveFilters,
    onSearchChange,
    onStatusToggle,
    onClearFilters,
}: OrdersTableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-52 max-w-md">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                    placeholder="Search by ref #, client or carrier…"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-9 pl-9 pr-8 text-sm border-border/60 bg-background placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Status filter */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-9 gap-2 border-border/60 text-sm font-normal",
                            statuses.length > 0 && "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
                        )}
                    >
                        <ListFilter className="h-3.5 w-3.5" />
                        Status
                        {statuses.length > 0 && (
                            <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px] font-bold">
                                {statuses.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-52 p-1.5">
                    <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1">
                        <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Filter by status
                        </span>
                    </div>
                    <Separator className="mb-1" />
                    <div className="space-y-0.5">
                        {ALL_STATUSES.map((status) => {
                            const config = STATUS_CONFIG[status];
                            const selected = statuses.includes(status);
                            return (
                                <button
                                    key={status}
                                    onClick={() => onStatusToggle(status)}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                                        selected
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-muted text-foreground",
                                    )}
                                >
                                    <span className={cn("h-2 w-2 shrink-0 rounded-full ring-2 ring-offset-1", config.dot,
                                        selected ? "ring-current/30" : "ring-transparent"
                                    )} />
                                    <span className="flex-1 text-left font-medium">{config.label}</span>
                                    {selected && (
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Active filter chips */}
            {statuses.length > 0 && (
                <div className="flex items-center gap-1.5">
                    {statuses.map((status) => {
                        const config = STATUS_CONFIG[status];
                        return (
                            <button
                                key={status}
                                onClick={() => onStatusToggle(status)}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-70",
                                    config.className,
                                )}
                            >
                                <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                                {config.label}
                                <X className="h-3 w-3" />
                            </button>
                        );
                    })}
                </div>
            )}

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                </Button>
            )}
        </div>
    );
}
