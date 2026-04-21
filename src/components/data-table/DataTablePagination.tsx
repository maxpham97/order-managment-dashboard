import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    total: number;
    pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
    table,
    total,
    pageSizeOptions = [10, 25, 50],
}: DataTablePaginationProps<TData>) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const from = total === 0 ? 0 : pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, total);
    const pageCount = Math.ceil(total / pageSize);

    return (
        <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-xs text-muted-foreground">
                {total === 0 ? (
                    "No results"
                ) : (
                    <>
                        Showing{" "}
                        <span className="font-semibold text-foreground">{from}–{to}</span>
                        {" "}of{" "}
                        <span className="font-semibold text-foreground">{total}</span>
                        {" "}orders
                    </>
                )}
            </p>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Per page</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(v) => table.setPageSize(Number(v))}
                    >
                        <SelectTrigger className="h-8 w-14 border-border/60 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((s) => (
                                <SelectItem key={s} value={String(s)} className="text-xs">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="min-w-[72px] text-center text-xs font-medium text-foreground">
                        {pageCount === 0 ? "—" : `${pageIndex + 1} / ${pageCount}`}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => table.setPageIndex(pageCount - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
