import type { DraftFormValues, StopFormValues } from "../../features/order-new/schema/order-draft.schema";
import type { DraftTab, DraftsState } from "../../types/order/draft-tab";

export const generateRefNumber = (): string => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return `ORD-${year}-${num}`;
};

export const createDefaultStop = (type: StopFormValues["type"]): StopFormValues => ({
    id: crypto.randomUUID(),
    type,
    locationName: "",
    city: "",
    state: "",
    zip: "",
    refNumber: "",
    appointmentType: "fixed",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
});

export const createDefaultFormValues = (): Partial<DraftFormValues> => ({
    clientName: "",
    referenceNumber: generateRefNumber(),
    carrierId: "",
    carrierName: "",
    carrierMcNumber: "",
    equipmentType: "dry_van",
    loadType: "ftl",
    notes: "",
    stops: [createDefaultStop("pick_up"), createDefaultStop("drop_off")],
});

export const createTab = (formData?: Partial<DraftFormValues>): DraftTab => ({
    id: crypto.randomUUID(),
    formData: formData ?? createDefaultFormValues(),
    savedAt: null,
});

export const getDefaultDraftsState = (): DraftsState => {
    const tab = createTab();
    return { tabs: [tab], activeTabId: tab.id };
};
