import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { RootState } from '../store';
import { DRAFT_STORAGE_KEY, MAX_DRAFT_TABS } from '../../../features/order-new/constants/draft.constants';
import type { DraftFormValues } from '../../../features/order-new/schema/order-draft.schema';
import type { DraftsState } from '../../../types/order/draft-tab';
import {
    createDefaultStop,
    createTab,
    getDefaultDraftsState,
} from '../../utils/draft.utils';

export type { DraftTab } from '../../../types/order/draft-tab';
export { createDefaultFormValues } from '../../utils/draft.utils';

// ─── Load from localStorage ───────────────────────────────────────────────────

const loadFromStorage = (): DraftsState => {
    try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!raw) return getDefaultDraftsState();
        const parsed = JSON.parse(raw) as DraftsState;
        if (!parsed.tabs?.length) return getDefaultDraftsState();
        return parsed;
    } catch {
        return getDefaultDraftsState();
    }
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const MAX_STOPS = 5;

const draftsSlice = createSlice({
    name: 'drafts',
    initialState: loadFromStorage,
    reducers: {
        addTab(state) {
            if (state.tabs.length >= MAX_DRAFT_TABS) return;
            const tab = createTab();
            state.tabs.push(tab);
            state.activeTabId = tab.id;
        },

        removeTab(state, action: PayloadAction<string>) {
            const idx = state.tabs.findIndex((t) => t.id === action.payload);
            if (idx === -1 || state.tabs.length <= 1) return;
            state.tabs.splice(idx, 1);
            if (state.activeTabId === action.payload) {
                state.activeTabId = state.tabs[Math.max(0, idx - 1)].id;
            }
        },

        setActiveTab(state, action: PayloadAction<string>) {
            if (state.tabs.some((t) => t.id === action.payload)) {
                state.activeTabId = action.payload;
            }
        },

        updateTabData(
            state,
            action: PayloadAction<{ id: string; formData: Partial<DraftFormValues> }>,
        ) {
            const tab = state.tabs.find((t) => t.id === action.payload.id);
            if (tab) tab.formData = action.payload.formData;
        },

        markSaved(state, action: PayloadAction<string>) {
            const tab = state.tabs.find((t) => t.id === action.payload);
            if (tab) tab.savedAt = new Date().toISOString();
        },

        clearAll(state) {
            const tab = createTab();
            state.tabs = [tab];
            state.activeTabId = tab.id;
        },

        addStopToActive(state) {
            const tab = state.tabs.find((t) => t.id === state.activeTabId);
            if (!tab?.formData.stops) return;
            const stops = tab.formData.stops;
            if (stops.length >= MAX_STOPS) return;
            stops.splice(stops.length - 1, 0, createDefaultStop('stop'));
        },
    },
});

const {
    addTab,
    removeTab,
    setActiveTab,
    updateTabData,
    markSaved,
    clearAll,
    addStopToActive,
} = draftsSlice.actions;

export { updateTabData, markSaved };

// ─── Hooks ────────────────────────────────────────────────────────────────────

// INSTEAD USE useAppSelector
export const useGetDraftsState = () =>
    useAppSelector((state: RootState) => state[draftsSlice.name]);

// INSTEAD USE useDispatch
export const useSetDraftsState = () => {
    const dispatch = useAppDispatch();
    return {
        addTab: () => dispatch(addTab()),
        removeTab: (id: string) => dispatch(removeTab(id)),
        setActiveTab: (id: string) => dispatch(setActiveTab(id)),
        updateTabData: (id: string, formData: Partial<DraftFormValues>) =>
            dispatch(updateTabData({ id, formData })),
        markSaved: (id: string) => dispatch(markSaved(id)),
        clearAll: () => dispatch(clearAll()),
        addStopToActive: () => dispatch(addStopToActive()),
    };
};

export default draftsSlice;
