# Order Management Dashboard (TMS)

Веб-приложение для управления заказами на перевозку в стиле Transportation Management System.
Основной сценарий: диспетчер видит список заказов, фильтрует/сортирует, меняет статусы, работает с черновиками и редактирует заказ.

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в dev-режиме
npm run dev

# Проверка типов
npx tsc --noEmit

# Сборка
npm run build
```

## Что реализовано

### Orders Table (`/orders`)

- серверная пагинация (10/25/50), сортировка, поиск, фильтры по статусам;
- inline-смена статуса с валидными переходами;
- действия строки: view, edit, duplicate as draft, delete;
- состояния: loading, empty, error + retry.

### Draft Workspace (`/orders/new`)

- вкладки черновиков (до 5), хранение в `localStorage`;
- форма на `react-hook-form + zod`;
- авто-сохранение черновиков;
- восстановление драфтов после перезагрузки.

### Order Detail (`/orders/:id`)

- хедер с маршрутной цепочкой;
- карточка заказа;
- таймлайн остановок;
- таймлайн истории статусов;
- смена статуса с UI-ограничениями.

### Edit Order (`/orders/:id/edit`)

- форма предзаполнена текущим заказом;
- редактирование доступно только для статуса `pending`;
- сохранение через mock API, затем возврат на страницу деталей.

## Бизнес-правила статусов

- допустимые переходы:
  - `pending -> in_transit | cancelled`
  - `in_transit -> delivered | cancelled`
  - `delivered` и `cancelled` — финальные;
- при выборе `cancelled` обязательно подтверждение и обязательная причина;
- причина сохраняется в `statusHistory`;
- во время запроса показывается loading, после завершения — toast (success/error).

## Стек

- `React 19`
- `TypeScript`
- `Vite`
- `Tailwind CSS` + `shadcn/ui`
- `TanStack Query`
- `TanStack Table`
- `Redux Toolkit` (для workspace-состояния черновиков)
- `react-hook-form` + `zod`
- `sonner` (toast-уведомления)

## Структура проекта (сокращенно)

```text
src/
  api/
    order/
  components/
    data-table/
    ui/
  constants/
  features/
    orders/
    order-new/
    order-detail/
    order-edit/
  lib/
    mock/
    store/
    utils/
  pages/
    order/
    order-new/
    order-detail/
    order-edit/
  providers/
  routes/
  types/
```

## Architectural decisions with reasoning

- **Feature-oriented структура**: фичи разделены по доменным сценариям (`orders`, `order-new`, `order-detail`, `order-edit`) для масштабируемости и локализации изменений.
- **Разделение UI и бизнес-логики**: общие компоненты в `components`, предметная логика в `features` и `api`, чтобы избежать связности и дублирования.
- **React Query для server-state**: кэш, инвалидация и единый async-пайплайн для таблицы, деталей, смены статуса и сохранений.
- **Redux только там, где нужен shared client-state**: workspace черновиков хранится централизованно, чтобы вкладки и активный драфт были консистентны.
- **Zod-схемы для форм**: строгая типизация и единый источник валидации для UI и API-данных.
- **Mock API с задержками/ошибками**: позволяет разрабатывать realistic UX до готового backend.

## Что улучшить при наличии времени

- добавить полноценный backend-контракт и optimistic updates с rollback;
- покрыть критические сценарии тестами (unit/integration/e2e);
- улучшить UI

## Команды

- `npm run dev` — dev-сервер
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — lint