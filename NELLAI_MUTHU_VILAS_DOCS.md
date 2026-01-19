# Nellai Muthu Vilas - Project Documentation

## 1. Project Overview & Current Stage
**Nellai Muthu Vilas** is a premium digital sweet shop application designed to bring the traditional taste of Tirunelveli sweets to the digital age.

**Current Stage**: **Beta / Pre-Production**
- **Frontend**: Core UI/UX implementation is complete, including a premium "Royal/Traditional" theme.
- **Order Flow**: Fully functional with support for "Immediate" (same-day) and "Pre-order" (bulk/future) bookings.
- **Backend API**: Basic API routes for Products and Orders are implemented using Next.js API Routes and Prisma.
- **Database**: SQLite (dev) is currently connected. Migration to a production DB (Postgres/MySQL) is required for go-live.

## 2. Technology Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) - For server-side rendering and API routes.
- **Language**: TypeScript - For type safety and robustness.
- **Styling**: Tailwind CSS - For rapid, custom UI development without heavy CSS files.
- **Database ORM**: Prisma - For easy database interaction.
- **Database**: SQLite (Local Dev) / PostgreSQL (Recommended for Prod).
- **Icons**: Lucide React.
- **Animation**: Framer Motion.

## 3. Backend Connectivity & Order Logic
The application uses a **Serverless-compatible** backend architecture via Next.js API Routes.

### How it works:
1.  **Client**: User selects items -> Cart -> Checkout.
2.  **API Call**: `POST /api/orders` sent with payload `{ items, branchId, pickupTime, orderType }`.
3.  **Server**:
    - Validates Session (if logged in).
    - Validates Payload (items exist, branch selected).
    - Creates Order in Database via Prisma.
    - Returns Order ID.

### Real-time Implementation (For Live)
To make this "Real-time" (i.e., shop receives orders instantly):
1.  **Polling (Current/Simple)**: The Admin dashboard can poll `GET /api/orders` every 30 seconds to check for new orders.
2.  **WebSockets (Advanced)**: Use a service like **Pusher** or **Socket.io** (requires a separate server context) to push new orders to the Admin screen instantly.
    - *Recommendation*: Start with SWR/TanStack Query polling (interval 15s) for simplicity and reliability in Serverless environments.

## 4. Deployment Guide (How to make it Live)
To take this project from your laptop to the world:

### Step 1: Database Cloud Hosting
- Create a PostgreSQL database on a provider like **Neon.tech**, **Supabase**, or **AWS RDS**.
- Update `.env` file with the new `DATABASE_URL`.
- Run `npx prisma db push` to sync the schema.

### Step 2: Application Hosting
- **Vercel** is the recommended host for Next.js.
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables in Vercel Settings (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).
4.  Deploy.

### Step 3: Domain
- Buy a domain (e.g., `nellaimuthuvilas.com`).
- Connect it to Vercel via the Domains tab.

## 5. Recent Fixes & Features
- **Order Failed Fix**: Enhanced validation in checkout to prevent failures when branch isn't selected or time is invalid.
- **Festival Mode**: Added logic to restrict Pre-orders to 3 days in advance during festivals (Configurable via `IS_FESTIVAL_MODE` const).
- **UI Enhancements**: Added Back buttons, improved Cart visuals, and clearer distinctions between order types.
