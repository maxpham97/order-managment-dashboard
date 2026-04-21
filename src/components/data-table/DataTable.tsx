import {
    flexRender,
    type Table as TanstackTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    className?: string;
}

export function DataTable<TData>({ table, className }: DataTableProps<TData>) {
    const rows = table.getRowModel().rows;
    const headers = table.getFlatHeaders();

    return (
        <div className={cn("w-full overflow-auto rounded-lg border border-border/60", className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow
                            key={hg.id}
                            className="border-border/60 bg-muted/40 hover:bg-muted/40"
                        >
                            {hg.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="h-10 px-4 text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase"
                                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={headers.length}
                                className="h-40 text-center"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <span className="text-lg">📦</span>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">No orders found</p>
                                    <p className="text-xs text-muted-foreground/60">Try adjusting your filters</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, i) => (
                            <TableRow
                                key={row.id}
                                className={cn(
                                    "border-border/40 transition-colors hover:bg-accent/40",
                                    i % 2 === 0 && "bg-card",
                                    i % 2 !== 0 && "bg-muted/10",
                                )}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4 py-2.5">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
