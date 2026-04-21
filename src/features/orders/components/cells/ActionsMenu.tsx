import {
    Copy,
    Eye,
    MoreHorizontal,
    Pencil,
    RefreshCw,
    Trash2,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import type { Order } from "../../../../types/order/order";

interface ActionsMenuProps {
    order: Order;
    onView?: (order: Order) => void;
    onEdit?: (order: Order) => void;
    onDuplicate?: (order: Order) => void;
    onDelete?: (order: Order) => void;
    isDeleting?: boolean;
}

export function ActionsMenu({
    order,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    isDeleting,
}: ActionsMenuProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const canEdit = order.status === "pending";
    const canDelete = order.status === "pending";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-60 hover:opacity-100"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2" onClick={() => onView?.(order)}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                    </DropdownMenuItem>

                    {canEdit && (
                        <DropdownMenuItem className="gap-2" onClick={() => onEdit?.(order)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="gap-2" onClick={() => onDuplicate?.(order)}>
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate as Draft
                    </DropdownMenuItem>

                    <DropdownMenuItem className="gap-2" disabled>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Change Status
                    </DropdownMenuItem>

                    {canDelete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 text-destructive focus:text-destructive"
                                onClick={() => setConfirmOpen(true)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Order{" "}
                            <span className="font-semibold text-foreground">
                                {order.referenceNumber}
                            </span>{" "}
                            will be permanently deleted. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                onDelete?.(order);
                                setConfirmOpen(false);
                            }}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
