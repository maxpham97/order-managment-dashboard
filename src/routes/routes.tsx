import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTERS_PATHS } from "../constants/router-paths";

const OrdersPage = lazy(() => import("../pages/order"));

export const RenderRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Navigate to={ROUTERS_PATHS.ORDERS} replace />} />
                <Route path={ROUTERS_PATHS.ORDERS} element={<OrdersPage />} />
                <Route path={`${ROUTERS_PATHS.ORDERS}/*`} element={<OrdersPage />} />
            </Routes>
        </Suspense>
    );
};
