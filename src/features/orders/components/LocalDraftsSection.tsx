import { Clock, FileEdit, FileX, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { ROUTERS_PATHS } from "../../../constants/router-paths";
import type { LocalDraft } from "../../../types/order/order-draft";

interface LocalDraftsSectionProps {
    drafts: LocalDraft[];
    onDiscard: (id: string) => void;
    onDiscardAll: () => void;
}

export function LocalDraftsSection({ drafts, onDiscard, onDiscardAll }: LocalDraftsSectionProps) {
    const navigate = useNavigate();

    if (drafts.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-xl border border-amber-400/25 bg-amber-400/4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between bg-amber-400/6 px-5 py-3 border-b border-amber-400/20">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15">
                        <FileEdit className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-foreground">Unsaved Drafts</span>
                        <span className="ml-2 rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 ring-1 ring-amber-400/30">
                            {drafts.length}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDiscardAll}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                    <FileX className="h-3.5 w-3.5" />
                    Discard all
                </Button>
            </div>

            {/* Draft list */}
            <div className="divide-y divide-amber-400/10">
                {drafts.map((draft, i) => (
                    <div
                        key={draft.id}
                        className={cn(
                            "flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-amber-400/5",
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/12 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/20">
                                <span className="text-xs font-bold">{i + 1}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground leading-tight">
                                    {draft.title}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <Clock className="h-2.5 w-2.5 shrink-0" />
                                    <span>{formatTime(draft.savedAt)}</span>
                                    {draft.formData.referenceNumber && (
                                        <>
                                            <span className="text-muted-foreground/40">·</span>
                                            <span className="font-mono text-muted-foreground/80">
                                                {draft.formData.referenceNumber}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                            <Button
                                size="sm"
                                className="h-7 gap-1.5 bg-amber-500 text-xs text-white shadow-sm hover:bg-amber-600 dark:bg-amber-500/90"
                                onClick={() =>
                                    navigate(ROUTERS_PATHS.ORDERS_NEW, {
                                        state: { draftId: draft.id },
                                    })
                                }
                            >
                                <Pencil className="h-3 w-3" />
                                Resume
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => onDiscard(draft.id)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
