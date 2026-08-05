# GearUp Frontend

Enterprise-style Next.js 16 App Router frontend for the GearUp sports and outdoor gear rental backend.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- TanStack Query v5
- Zustand
- React Hook Form
- Zod
- Axios

## Architecture Rule

The project uses feature-based architecture.

```text
features/
  auth/
    api/
    components/
    hooks/
    pages/
    schemas/
    types/
    utils/
  gear/
  rental/
  payment/
  review/
  dashboard/
  account/
  category/
  home/
```

Implementation flow:

```text
types -> schemas -> api -> hooks -> components -> pages -> app route
```

Pages never call Axios directly. Components never call Axios directly.

## Important Folders

```text
app/
  (public)/             Public routes
  (auth)/               Login/register routes
  (protected)/          Dashboard/account routes

shared/
  api/axios.ts          Axios instance and interceptors
  api/response.ts       Response unwrapping helpers
  config/env.ts         Environment config
  types/                Shared infrastructure types
  utils/                Pure reusable utilities

stores/
  auth.store.ts         Zustand auth store only

components/ui/          shadcn/ui-style primitives
components/             Shared reusable app components
```

## API Flow

Example for gear:

```text
features/gear/types/gear.types.ts
features/gear/schemas/gear.schemas.ts
features/gear/api/gear.api.ts
features/gear/hooks/use-gears.ts
features/gear/components/gear-grid.tsx
features/gear/pages/gear-list-page.tsx
app/(public)/gear/page.tsx
```

Axios lives only in:

```text
shared/api/axios.ts
```

Feature API files call Axios:

```text
features/*/api/*.api.ts
```

React Query hooks call feature APIs:

```text
features/*/hooks/*
```

UI components call hooks, not Axios.

## State Management

Server state:

```text
TanStack Query
```

Examples:

- gear list
- rental orders
- payments
- admin users
- categories

Global client state:

```text
Zustand
```

Currently used for:

- auth token
- logged-in user
- logout
- auth hydration

Form state:

```text
React Hook Form
```

Validation:

```text
Zod schemas inside feature schemas folders
```

## Environment / Base URL

Control the backend URL from `.env`:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-gold.vercel.app
```

For local backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Restart the dev server after changing `.env`.

The value is read here:

```text
shared/config/env.ts
```

Then used by Axios here:

```text
shared/api/axios.ts
```

## Routes

```text
/                                      Home
/about                                 About GearUp
/gear                                  Browse gear
/gear/[id]                             Gear details and rental form
/auth/login                            Login
/auth/register                         Register
/account                               Profile
/dashboard/customer                    Customer dashboard
/dashboard/customer/orders/[id]/pay    Stripe checkout start
/dashboard/provider                    Provider dashboard
/dashboard/provider/gear/new           Create gear
/dashboard/provider/orders             Provider order actions
/dashboard/admin                       Admin dashboard
/payment/success                       Payment success UI
/payment/cancel                        Payment cancel UI
```

Protected routes are controlled by:

```text
proxy.ts
```

## Run

```bash
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Verify

```bash
pnpm lint
pnpm build
```

Both should pass.

## Seed Accounts

Password:

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

## Testing Checklist

Public:

- Visit `/`.
- Confirm featured gear loads with only a small featured set.
- Confirm Why Choose Us and CTA sections appear.
- Toggle dark/light mode from the navbar.
- Visit `/about`.
- Visit `/gear`.
- Test debounced search.
- Test category, brand, price, and availability filters without page reload.
- Confirm empty filters show `No gear exists` when no records match.
- Test pagination controls.
- Open `/gear/[id]`.
- Confirm image, price, stock, category, reviews, and rental form.

Auth:

- Register as customer.
- Register as provider.
- Login as customer/provider/admin.
- Confirm each role lands on the correct dashboard.
- Logout.
- Try opening `/dashboard/customer` logged out and confirm redirect to login.

Customer:

- Login as customer.
- Create a rental from a gear details page using future dates.
- Confirm order appears in `/dashboard/customer`.
- Cancel a `PLACED` order.
- If order is `CONFIRMED`, open pay page and verify Stripe redirect starts.
- Submit review for returned items.

Provider:

- Login as provider.
- Create gear from `/dashboard/provider/gear/new`.
- Confirm it appears in provider inventory.
- Open `/dashboard/provider/orders`.
- Move valid order items through available transitions.

Admin:

- Login as admin.
- Check dashboard stats.
- Search users.
- Suspend and activate users.
- Create and delete categories.
- Inspect gear and rental moderation panels.

Payment:

- Confirm checkout button is disabled unless order is `CONFIRMED`.
- Visit `/payment/success`.
- Visit `/payment/cancel`.

## Mental Model

When you want to change a feature, follow this path:

```text
1. types
2. schemas
3. api
4. hooks
5. components
6. pages
7. route export
```

Example: changing login validation means edit:

```text
features/auth/schemas/auth.schemas.ts
```

Changing login API route means edit:

```text
features/auth/api/auth.api.ts
```

Changing login UI means edit:

```text
features/auth/components/login-form.tsx
```
