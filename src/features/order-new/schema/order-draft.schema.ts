import { z } from "zod";

export const stopSchema = z.object({
    id: z.string(),
    type: z.enum(["pick_up", "drop_off", "stop"]),
    locationName: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required").max(2, "Use 2-letter state code"),
    zip: z.string().min(5, "ZIP is required"),
    refNumber: z.string().optional(),
    appointmentType: z.enum(["fixed", "window", "fcfs"]),
    appointmentDate: z.string().min(1, "Date is required"),
    appointmentTime: z.string().min(1, "Time is required"),
    notes: z.string().optional(),
});

export const orderDraftSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    referenceNumber: z.string().min(1, "Reference number is required"),
    carrierId: z.string().min(1, "Carrier is required"),
    carrierName: z.string(),
    carrierMcNumber: z.string(),
    equipmentType: z.enum(["dry_van", "reefer", "flatbed", "step_deck"]),
    loadType: z.enum(["ftl", "ltl"]),
    rate: z.coerce
        .number({ error: "Must be a number" })
        .min(1, "Rate is required"),
    weight: z.coerce
        .number({ error: "Must be a number" })
        .min(1, "Weight is required"),
    notes: z.string().optional(),
    stops: z
        .array(stopSchema)
        .min(2, "At least 2 stops required")
        .max(5, "Maximum 5 stops allowed")
        .refine((s) => s.some((x) => x.type === "pick_up"), "At least one Pick Up required")
        .refine((s) => s.some((x) => x.type === "drop_off"), "At least one Drop Off required"),
});

export type DraftFormValues = z.infer<typeof orderDraftSchema>;
export type StopFormValues = z.infer<typeof stopSchema>;
