# Good Dog Mail Club

A warm, nostalgic membership experience where every dog receives a real piece of mail and a cozy digital adventure each month.

## Stack
- Next.js + React
- Tailwind CSS for styling
- Prisma ORM with PostgreSQL
- Stripe-ready subscription flow (mock checkout wired)
- JWT-based auth stored in HTTP-only cookies

## Getting Started
1. Copy `.env.example` to `.env` and update credentials (PostgreSQL URL, JWT secret, Stripe keys).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migrations and generate the client:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:generate
   ```
4. Seed the database with an admin, demo member, and starter adventure:
   ```bash
   npm run prisma:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Default Accounts
- Admin: `admin@gooddogmail.club` / `admin123`
- Demo member: `buddy-parent@example.com` / `buddy123`

## Project Areas
- Public marketing: `/`
- Signup & checkout: `/signup` → `/checkout`
- Member portal: `/app` (This Month, Archive, Birthday, Account)
- Admin: `/admin`, `/admin/adventures`, `/admin/mail-export`

## Notes
- Checkout is mocked but structured for Stripe Checkout. Update API route with live keys when ready.
- Adventure completion is tracked per dog per month.
