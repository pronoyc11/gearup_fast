# GearUp Frontend

Next.js App Router frontend for the GearUp sports and outdoor gear rental API.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Shadcn-style UI primitives in `components/ui`
- TanStack Query for API/server state
- Custom JWT auth with cookies, localStorage, and `proxy.ts` route protection
- Stripe checkout redirect through the backend payment session endpoint

## Environment

The frontend API base URL is controlled from `.env`.

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-gold.vercel.app
```

To use a local backend, change it to:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then restart the frontend dev server. Next.js only reads `.env` values at server startup.

The runtime config is centralized in:

```text
config/env.ts
```

The API client uses that config from:

```text
lib/api.ts
```

## Project Structure

```text
app/                     Route files only. Thin exports to feature modules.
features/                Page-level modules grouped by domain.
  auth/                  Login and registration screens.
  gear/                  Gear list and gear details/rental flow.
  customer/              Customer dashboard and payment page.
  provider/              Provider inventory and order management.
  admin/                 Admin moderation and management dashboard.
  account/               Profile update/delete.
  payment/               Payment success/cancel pages.
components/              Shared app components.
components/ui/           Shadcn-style primitives: Button, Input, Card, Badge, etc.
config/                  Environment/config values.
lib/                     API client, auth helpers, shared types, UI helpers.
proxy.ts                 Protected dashboard route middleware.
```

## Main Routes

```text
/                         Home with featured gear
/gear                     Browse, search, and filter gear
/gear/[id]                Gear details, reviews, rental order form
/auth/login               Login
/auth/register            Customer/provider registration
/account                  Profile update/delete
/dashboard/customer       Customer orders, payments, reviews
/dashboard/customer/orders/[id]/pay
/dashboard/provider       Provider inventory overview
/dashboard/provider/gear/new
/dashboard/provider/orders
/dashboard/admin          User, category, gear, rental moderation
/payment/success
/payment/cancel
```

## Run Locally

```bash
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

Build and lint:

```bash
pnpm lint
pnpm build
```

## Test Accounts

Seeded backend password:

```text
Password123!
```

```text
Admin:    admin@gearup.test
Provider: ironhouse@gearup.test
Provider: pitchperfect@gearup.test
Provider: courtside@gearup.test
Customer: ayesha@gearup.test
Customer: tanvir@gearup.test
Customer: nabila@gearup.test
```

## Manual Testing Checklist

Public:

- Open `/` and confirm featured gear loads.
- Open `/gear`, test search, category, brand, price, and availability filters.
- Open a gear details page and confirm image, price, category, stock, specifications, and reviews appear.

Auth:

- Register a new customer and provider from `/auth/register`.
- Login with seeded customer/provider/admin accounts.
- Confirm each role redirects to the correct dashboard.
- Try opening a dashboard while logged out and confirm it redirects to `/auth/login`.

Customer:

- Login as a customer.
- Create a rental from `/gear/[id]` with future dates.
- Confirm the order appears in `/dashboard/customer`.
- Cancel a `PLACED` order.
- For a `CONFIRMED` order, open the pay page and confirm it attempts Stripe checkout.
- After returned items exist, submit a review from the dashboard.

Provider:

- Login as a provider.
- Add gear from `/dashboard/provider/gear/new`.
- Confirm listed gear appears in provider inventory.
- Open `/dashboard/provider/orders`.
- Move valid items through available actions: `PLACED -> CONFIRMED`, `PAID -> PICKED_UP`, `PICKED_UP -> RETURNED`.

Admin:

- Login as admin.
- Confirm dashboard stats load.
- Search users.
- Suspend and activate a user.
- Create/delete categories.
- Inspect gear listings and rental orders.

Payments:

- Payment page can only start Stripe when the parent order is `CONFIRMED`.
- `/payment/success` and `/payment/cancel` display clear outcomes.

## Notes

- Backend endpoints are mapped to the actual GearUp backend routes, for example `/api/category`, `/api/rental/customer`, and `/api/payment/create-session`.
- Auth token is stored in `localStorage` for API calls and in cookies for route protection.
- If you change `.env`, restart `pnpm dev`.
