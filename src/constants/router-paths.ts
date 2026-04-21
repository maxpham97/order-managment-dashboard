export const ROUTERS_PATHS = {
    ORDERS: '/orders',
    ORDERS_NEW: '/orders/new',
    ORDERS_DETAIL: '/orders/:id',
    ORDERS_EDIT: '/orders/:id/edit',
} as const;

export const buildOrderDetailPath = (id: string) => `/orders/${id}`;
export const buildOrderEditPath   = (id: string) => `/orders/${id}/edit`;
