# API Integration

Base URL is read from `NEXT_PUBLIC_API_URL` in `shared/config/env.ts`. The deployed backend base URL is `https://gearup-backend-soqv.onrender.com`. Requests use `shared/api/axios.ts`, which unwraps the backend `{ data }` response and attaches the bearer token from `useAuthStore`.

## Auth

| Frontend | Backend endpoint |
| --- | --- |
| `features/auth/components/login-form.tsx` | `POST /api/auth/login` |
| `features/auth/components/register-form.tsx` | `POST /api/auth/register` |
| `features/auth/hooks/use-current-user.ts` | `GET /api/user/me` |

## Account

| Frontend | Backend endpoint |
| --- | --- |
| `features/account/components/profile-form.tsx` | `GET /api/user/me` |
| `features/account/components/profile-form.tsx` | `PATCH /api/user/update-profile` |
| `features/account/components/profile-form.tsx` | `DELETE /api/user/delete-profile` |

## Gear And Categories

| Frontend | Backend endpoint |
| --- | --- |
| `features/gear/pages/gear-list-page.tsx`, `features/gear/components/gear-grid.tsx` | `GET /api/gear` |
| `features/gear/pages/gear-details-page.tsx` | `GET /api/gear/:gearId` |
| `features/gear/components/create-gear-form.tsx` | `POST /api/gear` |
| `features/dashboard/components/provider-inventory-manager.tsx` | `PATCH /api/gear/:gearId`, `DELETE /api/gear/:gearId` |
| `features/category/hooks/use-categories.ts` | `GET /api/category`, `POST /api/category`, `DELETE /api/category/:categoryId` |

## Rentals And Payments

| Frontend | Backend endpoint |
| --- | --- |
| `features/cart/components/cart-page-content.tsx` | `POST /api/rental/customer` |
| `features/dashboard/pages/customer-dashboard-page.tsx` | `GET /api/rental/customer`, `PATCH /api/rental/customer/cancel/:orderId`, `PATCH /api/rental/customer/items/:itemId/cancel` |
| `features/dashboard/pages/customer-order-details-page.tsx` | `GET /api/rental/customer/:orderId` |
| `features/dashboard/pages/provider-dashboard-page.tsx`, `features/dashboard/pages/provider-orders-page.tsx` | `GET /api/rental/provider` |
| `features/dashboard/pages/provider-orders-page.tsx` | `PATCH /api/rental/provider/items/:itemId` |
| `features/payment/pages/checkout-page.tsx` | `POST /api/payment/create-session` |
| `features/dashboard/pages/customer-dashboard-page.tsx` | `GET /api/payment` |

## Reviews And Admin

| Frontend | Backend endpoint |
| --- | --- |
| `features/review/components/review-list.tsx` | `GET /api/review/:gearId` |
| `features/review/components/create-review-form.tsx` | `POST /api/review/create` |
| `features/review/components/review-list.tsx` | `PATCH /api/review/:reviewId`, `DELETE /api/review/:reviewId` |
| `features/dashboard/pages/admin-dashboard-page.tsx` | `GET /api/admin/users`, `PATCH /api/admin/users/:userId`, `GET /api/admin/gear`, `GET /api/admin/rentals` |
