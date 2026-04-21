import type { Order } from "../../types/order/order";
import type { DraftFormValues, StopFormValues } from "../../features/order-new/schema/order-draft.schema";

/** Extracts "YYYY-MM-DD" from an ISO datetime string. */
const toDateInput = (iso: string | null): string => {
    if (!iso) return "";
    return iso.slice(0, 10);
};

/** Extracts "HH:MM" from an ISO datetime string. */
const toTimeInput = (iso: string | null): string => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Maps a persisted Order back to the form value shape used by DraftWorkspaceForm. */
export function orderToFormValues(order: Order): DraftFormValues {
    return {
        clientName: order.clientName,
        referenceNumber: order.referenceNumber,
        carrierId: order.carrier.id,
        carrierName: order.carrier.name,
        carrierMcNumber: order.carrier.mcNumber,
        equipmentType: order.equipmentType,
        loadType: order.loadType,
        rate: order.rate,
        weight: order.weight,
        notes: order.notes ?? "",
        stops: order.stops
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s): StopFormValues => ({
                id: s.id,
                type: s.type,
                locationName: s.locationName ?? "",
                city: s.address.city,
                state: s.address.state,
                zip: s.address.zip,
                refNumber: s.refNumber ?? "",
                appointmentType: s.appointmentType,
                appointmentDate: toDateInput(s.appointmentDate),
                appointmentTime: toTimeInput(s.appointmentDate),
                notes: s.notes ?? "",
            })),
    };
}
