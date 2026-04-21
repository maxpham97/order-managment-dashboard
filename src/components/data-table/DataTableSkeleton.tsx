import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
}

export function DataTableSkeleton({ columnCount, rowCount = 10 }: DataTableSkeletonProps) {
    return (
        <div className="w-full overflow-auto rounded-lg border border-border/60">
            <Table>
                <TableHeader>
                    <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i} className="h-10 px-4">
                                <Skeleton className="h-3 w-16 rounded-sm" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, rowIdx) => (
                        <TableRow
                            key={rowIdx}
                            className="border-border/40"
                        >
                            {Array.from({ length: columnCount }).map((_, colIdx) => (
                                <TableCell key={colIdx} className="px-4 py-2.5">
                                    <Skeleton
                                        className="h-4 rounded-sm"
                                        style={{ width: `${45 + ((rowIdx * columnCount + colIdx) % 5) * 12}%` }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
