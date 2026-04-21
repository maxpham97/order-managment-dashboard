import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Order } from "../../../../types/order/order";

interface RouteCellProps {
    stops: Order["stops"];
}

export function RouteCell({ stops: rawStops }: RouteCellProps) {
    const stops = [...rawStops].sort((a, b) => a.order - b.order);
    const pickup = stops.find((s) => s.type === "pick_up");
    const dropoff = stops.slice().reverse().find((s) => s.type === "drop_off");
    const middleCount = stops.length - (pickup ? 1 : 0) - (dropoff ? 1 : 0);

    if (!pickup && !dropoff) {
        return <span className="text-xs text-muted-foreground">—</span>;
    }

    const from = pickup ? `${pickup.address.city}, ${pickup.address.state}` : "—";
    const to = dropoff ? `${dropoff.address.city}, ${dropoff.address.state}` : "—";

    return (
        <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-foreground truncate max-w-[80px]">{from}</span>

            {/* Connector line */}
            <div className="flex shrink-0 items-center gap-1">
                <span className="h-px w-4 bg-border" />
                {middleCount > 0 ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-default rounded px-1 py-px text-[10px] font-semibold text-muted-foreground bg-muted/80 hover:bg-muted transition-colors">
                                +{middleCount}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                            {middleCount} intermediate stop{middleCount > 1 ? "s" : ""}
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <span className="h-1.5 w-1.5 rounded-full border-2 border-border bg-background" />
                )}
                <span className="h-px w-4 bg-border" />
            </div>

            <span className="text-muted-foreground truncate max-w-[80px]">{to}</span>
        </div>
    );
}
