import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTERS_PATHS } from "../../../constants/router-paths";
import { useDraftStorageSync } from "../hooks/useDraftAutoSave";
import type { DraftFormValues } from "../schema/order-draft.schema";
import {
    useGetDraftsState,
    useSetDraftsState,
} from "../../../lib/store/slices/drafts-slice";
import { DraftTabs } from "./DraftTabs";
import { DraftWorkspaceForm } from "./DraftWorkspaceForm";

const FORM_ID = "draft-workspace-form";

export function DraftWorkspace() {
    const navigate = useNavigate();
    const { tabs, activeTabId } = useGetDraftsState();
    const actions = useSetDraftsState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedIndicator, setSavedIndicator] = useState(false);

    const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

    // Sync to localStorage on state changes
    useDraftStorageSync(tabs, activeTabId);

    // Show "DRAFT SAVED" flash on savedAt change
    useEffect(() => {
        if (!activeTab?.savedAt) return;
        setSavedIndicator(true);
        const timer = setTimeout(() => setSavedIndicator(false), 2000);
        return () => clearTimeout(timer);
    }, [activeTab?.savedAt]);

    const handleSubmit = async (_values: DraftFormValues) => {
        setIsSubmitting(true);
        try {
            // Placeholder: send to API, then navigate back
            await new Promise((r) => setTimeout(r, 800));
            actions.removeTab(activeTab.id);
            navigate(ROUTERS_PATHS.ORDERS);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!activeTab) return null;

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            {/* Tab bar + header actions */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                <DraftTabs
                    tabs={tabs}
                    activeTabId={activeTabId}
                    onSelect={actions.setActiveTab}
                    onClose={actions.removeTab}
                    onAdd={actions.addTab}
                />

                <div className="flex shrink-0 items-center gap-1.5">
                    {savedIndicator && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 transition-opacity">
                            <CheckCircle2 className="h-3 w-3" />
                            DRAFT SAVED
                        </span>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={actions.clearAll}
                        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear All
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => navigate(ROUTERS_PATHS.ORDERS)}
                    >
                        Close
                    </Button>

                    <Button
                        type="submit"
                        form={FORM_ID}
                        size="sm"
                        className="h-7 gap-1.5 text-xs"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {isSubmitting ? "Submitting…" : "Submit Draft"}
                    </Button>
                </div>
            </div>

            {/* Form — keyed by tabId to force full re-init on tab switch */}
            <DraftWorkspaceForm
                key={activeTab.id}
                tabId={activeTab.id}
                defaultValues={activeTab.formData}
                onSubmit={handleSubmit}
                formId={FORM_ID}
            />
        </div>
    );
}
