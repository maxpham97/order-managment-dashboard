import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_DRAFT_TABS } from "../constants/draft.constants";
import type { DraftTab } from "../../../lib/store/slices/drafts-slice";

interface DraftTabsProps {
    tabs: DraftTab[];
    activeTabId: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
    onAdd: () => void;
}

const tabLabel = (tab: DraftTab, index: number): string => {
    const ref = tab.formData.referenceNumber;
    if (ref && ref.trim()) return ref;
    return `Draft #${index + 1}`;
};

export function DraftTabs({ tabs, activeTabId, onSelect, onClose, onAdd }: DraftTabsProps) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab, index) => {
                const isActive = tab.id === activeTabId;
                return (
                    <div key={tab.id} className="flex shrink-0 items-center">
                        <button
                            onClick={() => onSelect(tab.id)}
                            className={cn(
                                "group flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                        >
                            <span className="max-w-[120px] truncate">{tabLabel(tab, index)}</span>
                            {tab.savedAt && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" title="Draft saved" />
                            )}
                        </button>
                        {tabs.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose(tab.id);
                                }}
                                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus:opacity-100"
                                aria-label="Close tab"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                );
            })}

            {tabs.length < MAX_DRAFT_TABS && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={onAdd}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="New draft"
                    title="New draft"
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}
