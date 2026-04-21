import type { DraftFormValues } from "../../features/order-new/schema/order-draft.schema";

export interface DraftTab {
    id: string;
    formData: Partial<DraftFormValues>;
    savedAt: string | null;
}

export interface DraftsState {
    tabs: DraftTab[];
    activeTabId: string | null;
}
