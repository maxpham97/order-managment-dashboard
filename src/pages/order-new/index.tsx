import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTERS_PATHS } from "../../constants/router-paths";
import { DraftWorkspace } from "../../features/order-new/components/DraftWorkspace";

export default function NewOrderDraftPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1440px] px-6 py-6 space-y-5">
                {/* Page header */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Link
                            to={ROUTERS_PATHS.ORDERS}
                            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Orders
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Draft Workspace</h1>
                    <p className="text-sm text-muted-foreground">
                        Create one or more drafts. When ready — submit to create an Order.
                    </p>
                </div>

                {/* Main workspace card */}
                <DraftWorkspace />
            </div>
        </div>
    );
}
