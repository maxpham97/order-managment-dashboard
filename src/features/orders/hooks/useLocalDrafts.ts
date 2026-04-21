import { useCallback, useEffect, useState } from "react";
import type { LocalDraft } from "../../../types/order/order-draft";
import type { OrderDto } from "../../../types/order/order-dto";

const STORAGE_KEY = "tms_order_drafts";

const readFromStorage = (): LocalDraft[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
};

const writeToStorage = (drafts: LocalDraft[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export function useLocalDrafts() {
    const [drafts, setDrafts] = useState<LocalDraft[]>(readFromStorage);

    useEffect(() => {
        writeToStorage(drafts);
    }, [drafts]);

    const saveDraft = useCallback((formData: Partial<OrderDto>, title?: string) => {
        const draft: LocalDraft = {
            id: crypto.randomUUID(),
            title: title ?? `Draft — ${new Date().toLocaleDateString()}`,
            formData,
            savedAt: new Date().toISOString(),
        };
        setDrafts((prev) => [draft, ...prev]);
        return draft.id;
    }, []);

    const discardDraft = useCallback((id: string) => {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
    }, []);

    const discardAll = useCallback(() => setDrafts([]), []);

    return { drafts, saveDraft, discardDraft, discardAll };
}
