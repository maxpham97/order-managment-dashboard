import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTERS_PATHS } from "../constants/router-paths";

const OrdersPage        = lazy(() => import("../pages/order"));
const NewOrderDraftPage = lazy(() => import("../pages/order-new"));
const OrderDetailPage   = lazy(() => import("../pages/order-detail"));
const OrderEditPage     = lazy(() => import("../pages/order-edit"));

export const RenderRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Navigate to={ROUTERS_PATHS.ORDERS} replace />} />
                <Route path={ROUTERS_PATHS.ORDERS}        element={<OrdersPage />} />
                <Route path={ROUTERS_PATHS.ORDERS_NEW}    element={<NewOrderDraftPage />} />
                <Route path={ROUTERS_PATHS.ORDERS_DETAIL} element={<OrderDetailPage />} />
                <Route path={ROUTERS_PATHS.ORDERS_EDIT}   element={<OrderEditPage />} />
            </Routes>
        </Suspense>
    );
};
