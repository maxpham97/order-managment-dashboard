import type { Order } from "../../../types/order/order";

interface OrderInfoCardProps {
    order: Order;
}

const EQUIPMENT_LABELS: Record<string, string> = {
    dry_van:   "Dry Van",
    reefer:    "Reefer",
    flatbed:   "Flatbed",
    step_deck: "Step Deck",
};

const LOAD_TYPE_LABELS: Record<string, string> = {
    ftl: "FTL",
    ltl: "LTL",
};

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {label}
            </dt>
            <dd className="text-sm font-medium leading-snug text-foreground">{children}</dd>
        </div>
    );
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold">Order Info</h2>
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-3 lg:grid-cols-6">
                <InfoCell label="Client">{order.clientName}</InfoCell>

                <InfoCell label="Carrier">
                    <span className="flex flex-col gap-0.5">
                        <span>{order.carrier.name}</span>
                        <span className="font-mono text-[11px] font-normal text-muted-foreground">
                            {order.carrier.mcNumber}
                        </span>
                    </span>
                </InfoCell>

                <InfoCell label="Equipment">
                    {EQUIPMENT_LABELS[order.equipmentType] ?? order.equipmentType}
                </InfoCell>

                <InfoCell label="Load Type">
                    {LOAD_TYPE_LABELS[order.loadType] ?? order.loadType}
                </InfoCell>

                <InfoCell label="Rate">
                    <span className="text-emerald-600 dark:text-emerald-400">
                        ${order.rate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                </InfoCell>

                <InfoCell label="Weight">
                    {order.weight.toLocaleString("en-US")} lbs
                </InfoCell>
            </dl>

            {order.notes && (
                <div className="border-t border-border px-6 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                        Notes
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{order.notes}</p>
                </div>
            )}
        </div>
    );
}
