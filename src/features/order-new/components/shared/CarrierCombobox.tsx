import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCarriers } from "../../../../api/order/orderQueries";
import type { Carrier } from "../../../../types/order/order-types";

interface CarrierComboboxProps {
    value: string;
    onChange: (carrier: Carrier) => void;
    error?: string;
}

export function CarrierCombobox({ value, onChange, error }: CarrierComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { data: carriers = [], isLoading } = useCarriers();

    const selected = carriers.find((c) => c.id === value);
    const filtered = carriers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.mcNumber.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "h-8 w-full justify-between font-normal",
                        !selected && "text-muted-foreground",
                        error && "border-destructive",
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : selected ? (
                        <span className="truncate">
                            {selected.name}{" "}
                            <span className="text-muted-foreground">· {selected.mcNumber}</span>
                        </span>
                    ) : (
                        "Search carrier…"
                    )}
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-40" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or MC#…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                    />
                </div>
                <div className="max-h-56 overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                        <p className="py-4 text-center text-xs text-muted-foreground">
                            No carriers found
                        </p>
                    ) : (
                        filtered.map((carrier) => (
                            <button
                                key={carrier.id}
                                onClick={() => {
                                    onChange(carrier);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                            >
                                <Check
                                    className={cn(
                                        "h-3.5 w-3.5 shrink-0 text-primary",
                                        carrier.id === value ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                <div className="min-w-0 text-left">
                                    <p className="truncate font-medium">{carrier.name}</p>
                                    <p className="font-mono text-[10px] text-muted-foreground">
                                        {carrier.mcNumber}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
