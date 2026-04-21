import { useEffect, useRef } from "react";
import { DRAFT_STORAGE_KEY } from "../constants/draft.constants";
import type { DraftFormValues } from "../schema/order-draft.schema";
import { markSaved, updateTabData, type DraftTab } from "../../../lib/store/slices/drafts-slice";
import { useAppDispatch } from "../../../lib/store/hooks";

/** Persists draft workspace to localStorage whenever tabs change. */
export function useDraftStorageSync(tabs: DraftTab[], activeTabId: string | null) {
    useEffect(() => {
        try {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ tabs, activeTabId }));
        } catch {
            // storage quota exceeded — silently ignore
        }
    }, [tabs, activeTabId]);
}

/** Auto-saves active form data to Redux every 5s and on window blur. */
export function useDraftAutoSave(
    tabId: string | null,
    getValues: () => Partial<DraftFormValues>,
) {
    const dispatch = useAppDispatch();
    const getValuesRef = useRef(getValues);
    getValuesRef.current = getValues;

    const save = () => {
        if (!tabId) return;
        // structuredClone breaks the shallow-reference chain:
        // getValues() returns objects shared with RHF's _formValues.
        // Without cloning, Immer freezes those same references when storing
        // in Redux, which makes _formValues read-only → crash on move/register.
        dispatch(updateTabData({ id: tabId, formData: structuredClone(getValuesRef.current()) }));
        dispatch(markSaved(tabId));
    };

    // Save every 5 seconds
    useEffect(() => {
        if (!tabId) return;
        const interval = setInterval(save, 5000);
        return () => clearInterval(interval);
    }, [tabId]);  // eslint-disable-line react-hooks/exhaustive-deps

    // Save on window blur
    useEffect(() => {
        window.addEventListener("blur", save);
        return () => window.removeEventListener("blur", save);
    }, [tabId]);  // eslint-disable-line react-hooks/exhaustive-deps

    return { saveNow: save };
}
