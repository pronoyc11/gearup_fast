# GearUp Frontend

GearUp Frontend is a role-aware sports and outdoor equipment rental web app built with Next.js App Router. It connects to the GearUp REST API and supports public gear browsing, cart-based rental ordering, Stripe checkout, profile management, provider inventory workflows, and admin moderation.

The application is organized around real product workflows:

- Customers browse gear, manage a cart, place rental orders, pay confirmed items, and review returned gear.
- Providers create gear listings, manage inventory, and update incoming rental item statuses.
- Admins inspect users, categories, gear listings, and rental activity.

## Project Links

| Resource | URL |
| --- | --- |
| Live backend base URL | `https://gearup-backend-soqv.onrender.com` |
| Backend repository | `https://github.com/pronoyc11/gearup-backend` |
| API integration map | [`API_INTEGRATION.md`](./API_INTEGRATION.md) |

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 App Router, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, custom UI primitives |
| Forms | React Hook Form, Zod |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| HTTP | Axios |
| Icons | Lucide React |
| Payments | Stripe Checkout redirect flow |
| Images | Next Image, Cloudinary upload for provider gear |

## Core Features

### Public Experience

- Home page with hero, featured gear, value sections, and CTA.
- About page describing the GearUp marketplace.
- Gear catalog with search, filters, sorting, pagination, availability badges, and detail pages.
- Public cart page. Users can add gear before logging in, but cart state is cleared after each login or logout so account sessions never share old cart data.
- Product detail pages with provider information, add-to-cart state, direct rental form, and reviews.

### Authentication And Routing

- Customer and provider registration.
- Login with bearer-token based API access.
- Auth state persisted in local storage and mirrored to cookies for route protection.
- Role-based redirects through `proxy.ts`.
- Login/register pages redirect authenticated users to their dashboard.
- Protected dashboards redirect logged-out visitors to `/auth/login`.

### Customer Flow

- Add available gear to cart.
- Place multi-item rental orders from the cart.
- Create direct single-gear rental orders from product details.
- View rental history and payment history.
- Cancel placed orders or placed order items.
- Pay confirmed orders or individual confirmed items through Stripe Checkout.
- Review returned or late-returned rental items.

### Provider Flow

- Create gear listings with category, pricing, stock, availability, image upload, description, and specifications notes.
- View provider-owned inventory.
- Update or delete owned gear from the provider dashboard.
- View incoming rental items.
- Move rental items through valid provider statuses.

### Admin Flow

- View dashboard stats for users, gear, and rentals.
- Search and moderate users.
- Activate or suspend users.
- Create and delete categories.
- Inspect gear and rental moderation panels.

### Account Flow

- View current profile.
- Update name, phone, and address.
- Delete profile when backend constraints allow it.
- Profile requests pass the current bearer token explicitly and refetch `/api/user/me` after updates so UI state reflects the backend source of truth.

## Repository Structure

```text
.
|-- app/                         Next.js route tree
|   |-- (auth)/                  Login and registration routes
|   |-- (protected)/             Account and role dashboards
|   `-- (public)/                Home, about, gear, cart, payment result pages
|-- components/                  Shared shell components and UI primitives
|   |-- ui/                      Button, card, input, select, textarea, badge
|   |-- navbar.tsx
|   |-- footer.tsx
|   |-- providers.tsx
|   |-- auth-hydrator.tsx
|   |-- theme-hydrator.tsx
|   `-- toast-viewport.tsx
|-- features/                    Feature-first application modules
|   |-- account/
|   |-- auth/
|   |-- cart/
|   |-- category/
|   |-- dashboard/
|   |-- gear/
|   |-- home/
|   |-- payment/
|   |-- rental/
|   `-- review/
|-- shared/                      Cross-feature infrastructure
|   |-- api/
|   |-- config/
|   |-- hooks/
|   |-- types/
|   `-- utils/
|-- stores/                      Zustand stores
|-- proxy.ts                     Route protection and role redirects
|-- API_INTEGRATION.md           Component-to-endpoint mapping
`-- README.md
```

## Feature Module Pattern

Most feature folders follow this shape:

```text
features/<feature>/
|-- api/                         HTTP functions for backend endpoints
|-- components/                  Feature-specific UI components
|-- hooks/                       TanStack Query mutations and queries
|-- pages/                       Route-level page components
|-- schemas/                     Zod form validation
|-- types/                       TypeScript domain types
`-- utils/                       Pure feature helpers when needed
```

Preferred implementation flow:

```text
types -> schemas -> api -> hooks -> components -> pages -> app route export
```

Rules of thumb:

- Route files under `app/` should stay thin and export feature pages.
- Feature components should use feature hooks or stores instead of calling Axios directly.
- Feature hooks should call feature API modules.
- Shared utilities should stay generic and free of feature-specific state.

## Route Map

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home page |
| `/about` | Public | Marketplace overview |
| `/gear` | Public | Gear catalog |
| `/gear/[id]` | Public | Gear details, cart, direct rental, reviews |
| `/cart` | Public | Persisted cart and rental order creation |
| `/auth/login` | Public, redirects if logged in | Login |
| `/auth/register` | Public, redirects if logged in | Customer/provider registration |
| `/account` | Authenticated | Profile view, update, delete |
| `/dashboard/customer` | Customer | Rental and payment dashboard |
| `/dashboard/customer/orders/[id]` | Customer | Rental order details |
| `/dashboard/customer/orders/[id]/pay` | Customer | Stripe checkout start |
| `/dashboard/provider` | Provider | Inventory overview |
| `/dashboard/provider/gear/new` | Provider | Create gear |
| `/dashboard/provider/orders` | Provider | Incoming rental item actions |
| `/dashboard/admin` | Admin | User/category/gear/rental moderation |
| `/payment/success` | Public | Stripe success return page |
| `/payment/cancel` | Public | Stripe cancellation return page |

## Route Protection

Route protection lives in [`proxy.ts`](./proxy.ts).

Public paths:

```text
/
/about
/gear
/gear/*
/cart
/auth/login
/auth/register
/payment/success
/payment/cancel
```

Protected role paths:

| Path prefix | Required role |
| --- | --- |
| `/dashboard/admin` | `ADMIN` |
| `/dashboard/provider` | `PROVIDER` |
| `/dashboard/customer` | `CUSTOMER` |

`/account` is protected for any authenticated role because it is not in the public path list.

Auth is mirrored into cookies:

- `gearup_token`
- `gearup_role`

These cookies let the proxy make route decisions before client-side hydration completes.

## State Management

### Server State

TanStack Query stores data fetched from the backend:

- gear catalog and gear details
- categories
- profile
- rentals
- payments
- reviews
- admin users, gear, and rentals

Query keys are scoped where needed to avoid stale data appearing across account switches.

### Auth State

[`stores/auth.store.ts`](./stores/auth.store.ts) stores:

- `accessToken`
- `user`
- `setAuth`
- `hydrate`
- `logout`

Auth data is persisted in `localStorage`:

- `gearup_token`
- `gearup_user`

On logout, auth storage, auth cookies, and cart state are cleared.

### Cart State

[`stores/cart.store.ts`](./stores/cart.store.ts) stores a persisted public cart:

- `items`
- `addGear`
- `removeItem`
- `updateQuantity`
- `clearSelected`
- `clearCart`

Important behavior:

- The cart page is public.
- The add-to-cart button shows `Already Added to Cart` once a gear item exists in the cart.
- Cart state is cleared on every successful login.
- Cart state is cleared on every logout.

### Theme State

[`stores/theme.store.ts`](./stores/theme.store.ts) stores light/dark mode and applies the `dark` class to the document root.

### Toast State

[`stores/toast.store.ts`](./stores/toast.store.ts) powers app-wide success, info, and error notifications through `components/toast-viewport.tsx`.

## API Layer

The Axios client is defined in [`shared/api/axios.ts`](./shared/api/axios.ts).

Responsibilities:

- apply `NEXT_PUBLIC_API_URL`
- send JSON requests
- include credentials
- attach `Authorization: Bearer <token>` from the auth store
- unwrap backend `{ data }` payloads
- normalize API errors into `Error` objects

Backend base URL is configured in [`shared/config/env.ts`](./shared/config/env.ts).

```ts
export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "https://gearup-backend-soqv.onrender.com",
};
```

For a complete component-to-endpoint list, see [`API_INTEGRATION.md`](./API_INTEGRATION.md).

## Backend Endpoint Summary

| Area | Endpoints used |
| --- | --- |
| Auth | `POST /api/auth/login`, `POST /api/auth/register` |
| User | `GET /api/user/me`, `PATCH /api/user/update-profile`, `DELETE /api/user/delete-profile` |
| Gear | `GET /api/gear`, `GET /api/gear/:gearId`, `POST /api/gear`, `PATCH /api/gear/:gearId`, `DELETE /api/gear/:gearId` |
| Category | `GET /api/category`, `POST /api/category`, `DELETE /api/category/:categoryId` |
| Customer rentals | `POST /api/rental/customer`, `GET /api/rental/customer`, `GET /api/rental/customer/:orderId`, cancel endpoints |
| Provider rentals | `GET /api/rental/provider`, `PATCH /api/rental/provider/items/:itemId` |
| Payments | `POST /api/payment/create-session`, `GET /api/payment` |
| Reviews | `GET /api/review/:gearId`, `POST /api/review/create`, `PATCH /api/review/:reviewId`, `DELETE /api/review/:reviewId` |
| Admin | `GET /api/admin/users`, `PATCH /api/admin/users/:userId`, `GET /api/admin/gear`, `GET /api/admin/rentals` |

## Environment Variables

Create `.env` in the project root.

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-soqv.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

For local backend development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Restart the dev server after changing environment variables.

Cloudinary is used by provider gear creation. The frontend upload helper expects a public cloud name and unsigned upload preset.

## Installation

This repository includes a `pnpm-lock.yaml`, so pnpm is the preferred package manager.

```bash
pnpm install
```

Using npm also works if you prefer:

```bash
npm install
```

## Development

Start the Next.js dev server:

```bash
pnpm dev
```

or:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
pnpm build
```

or:

```bash
npm run build
```

Start the production server:

```bash
pnpm start
```

or:

```bash
npm start
```

## Verification

Run lint:

```bash
pnpm lint
```

Run TypeScript check:

```bash
npx tsc --noEmit
```

Run production build:

```bash
pnpm build
```

## Seed Accounts

The backend seed data uses this password:

```text
Password123!
```

| Role | Email |
| --- | --- |
| Admin | `admin@gearup.test` |
| Provider | `ironhouse@gearup.test` |
| Provider | `pitchperfect@gearup.test` |
| Provider | `courtside@gearup.test` |
| Customer | `ayesha@gearup.test` |
| Customer | `tanvir@gearup.test` |
| Customer | `nabila@gearup.test` |

## Important Workflows

### Customer Rental From Cart

1. Browse `/gear`.
2. Open a gear detail page.
3. Add available gear to cart.
4. Open `/cart`.
5. Select cart items and choose future start/end dates.
6. Submit the rental order.
7. Open `/dashboard/customer` to track the order.
8. Pay confirmed orders or confirmed individual items.

### Customer Direct Rental

1. Open `/gear/[id]`.
2. Use the direct rental form.
3. Enter valid future dates and quantity.
4. Submit.
5. Track the order from the customer dashboard.

### Provider Inventory

1. Login as a provider.
2. Open `/dashboard/provider`.
3. Review provider-owned inventory and incoming rental item stats.
4. Open `/dashboard/provider/gear/new`.
5. Upload an image, choose a category, and create a gear listing.

### Provider Order Fulfillment

1. Login as a provider.
2. Open `/dashboard/provider/orders`.
3. Confirm placed rental items.
4. Continue valid status transitions as customers pay, pick up, and return gear.

### Admin Moderation

1. Login as admin.
2. Open `/dashboard/admin`.
3. Review platform stats.
4. Search users.
5. Suspend or activate user accounts.
6. Create or delete categories.
7. Inspect gear and rental moderation panels.

## Rental Status Model

The frontend supports these rental statuses:

```text
PLACED
PARTIALLY_CONFIRMED
CONFIRMED
PAID
PARTIALLY_PICKED_UP
PICKED_UP
PARTIALLY_RETURNED
RETURNED
LATE_RETURN
CANCELLED
```

Provider item transitions are handled through `/api/rental/provider/items/:itemId`. Payment is only enabled for confirmed orders or confirmed individual items.

## Payment Flow

Payments use Stripe Checkout through the backend.

1. Customer opens an order payment page.
2. Frontend calls `POST /api/payment/create-session`.
3. Backend returns a Stripe Checkout URL.
4. Frontend redirects with `window.location.href`.
5. Stripe returns to `/payment/success` or `/payment/cancel`.

The frontend does not process cards directly.

## Image Upload Flow

Provider gear creation supports image uploads through Cloudinary:

1. User selects a local image.
2. Frontend validates file type and size.
3. Frontend uploads to Cloudinary using the configured unsigned preset.
4. Returned image URL is saved in the gear creation payload.

Relevant files:

- `features/gear/components/create-gear-form.tsx`
- `features/gear/api/cloudinary.api.ts`
- `shared/config/env.ts`

## UI System

Shared UI primitives live in `components/ui/`:

- `Button`
- `Card`
- `Input`
- `Select`
- `Textarea`
- `Badge`

Global shell components:

- `Navbar`
- `Footer`
- `Providers`
- `AuthHydrator`
- `ThemeHydrator`
- `ToastViewport`

The design is intentionally practical and dashboard-friendly: compact cards, clear status badges, role-aware navigation, and restrained color usage.

## Error Handling

API errors are normalized in `shared/api/axios.ts`.

Feature components generally display errors through:

- inline red text for form or panel errors
- toast notifications for mutation failures
- protected-route redirects for missing auth

## Manual QA Checklist

### Public

- Open `/`.
- Toggle dark/light theme.
- Open `/about`.
- Open `/gear`.
- Search and filter gear.
- Open `/gear/[id]`.
- Add gear to cart and confirm the button changes to `Already Added to Cart`.
- Open `/cart` while logged out.

### Auth

- Register a customer.
- Register a provider.
- Login as customer, provider, and admin.
- Confirm each role redirects to the correct dashboard.
- Confirm cart clears after login.
- Logout and confirm cart clears again.
- Try opening protected dashboards logged out.

### Account

- Open `/account` after login.
- Update name, phone, or address.
- Confirm the visible profile updates without refresh.
- Delete a profile only when backend constraints allow it.

### Customer

- Create a rental from cart.
- Create a rental from product details.
- Cancel a placed order.
- Cancel a placed order item.
- Pay a confirmed order or confirmed item.
- Review returned gear.

### Provider

- Create gear.
- Upload an image.
- Edit/delete inventory from the provider dashboard.
- Confirm incoming rental items.
- Move items through valid fulfillment statuses.

### Admin

- Search users.
- Suspend and activate users.
- Create and delete categories.
- Inspect gear and rental moderation panels.

## Development Notes

- Keep route files thin.
- Add new backend calls in `features/<feature>/api`.
- Wrap API calls with TanStack Query hooks in `features/<feature>/hooks`.
- Put form schemas in `features/<feature>/schemas`.
- Reuse shared UI primitives before creating new UI components.
- Use `toArray` from `shared/api/response.ts` when an endpoint may return either an array or paginated list.
- Use `formatMoney`, status helpers, and date utilities rather than duplicating formatting logic.

## Troubleshooting

### The app is calling the wrong backend

Check `NEXT_PUBLIC_API_URL` in `.env`, then restart the dev server.

### Protected routes redirect unexpectedly

Check auth cookies and the role stored by `stores/auth.store.ts`. Route decisions are made in `proxy.ts`.

### Profile or dashboard data looks stale after switching accounts

Make sure logout/login cleared old auth state. User-specific React Query keys and explicit auth updates are used to avoid stale data, but browser storage from old builds can sometimes survive deployment changes.

### Cart data appears from an old session

The current implementation clears cart on login and logout. If old data persists after deploying a new build, clear the browser storage key `gearup_cart` once.

### Cloudinary upload fails

Verify:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- the upload preset allows unsigned uploads

## Related Documentation

- [`API_INTEGRATION.md`](./API_INTEGRATION.md) for frontend component to backend endpoint mapping.
- Backend repository: `https://github.com/pronoyc11/gearup-backend`
