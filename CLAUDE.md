# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MAVERICK** is a Bengali e-commerce website for a men's clothing store specializing in hoodies. The site features a landing page and order form with a glassmorphism design aesthetic. It's built as a Next.js 15 application with TypeScript.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server on port 3001
npm run dev

# Build for production (standalone output)
npm run build

# Start production server
npm start
# Server logs are tee'd to server.log

# Lint code
npm run lint

# Database operations (Prisma with PostgreSQL)
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database with admin user
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Package Manager**: npm (NOT bun/yarn)
- **Styling**: Tailwind CSS 4 with custom glassmorphism effects
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Custom JWT-based auth for admin panel
- **Language**: TypeScript (strict mode)

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Order form page (main route)
│   ├── shop-page/         # Landing page with hero and showcase
│   ├── admin/             # Admin panel (protected)
│   │   ├── login/         # Admin login
│   │   ├── dashboard/     # Dashboard with stats
│   │   ├── orders/        # Order management
│   │   │   └── [id]/      # Individual order details
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   └── middleware.ts  # Auth middleware
│   ├── api/               # API routes
│   │   ├── submit-order/  # Order submission endpoint
│   │   └── admin/         # Admin API endpoints
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles + glassmorphism classes
├── components/
│   └── ui/               # shadcn/ui components (auto-generated)
├── hooks/                # Custom React hooks
└── lib/
    ├── utils.ts          # Utilities (cn() helper for class merging)
    └── db.ts             # Prisma client singleton
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seeding script
```

### Page Routes

- `/` - Order form with product selection, color/size picker, form validation in Bengali
- `/shop-page` - Landing page with glassmorphism design, showcasing services and products
- `/admin/login` - Admin authentication page
- `/admin/dashboard` - Admin dashboard with order statistics
- `/admin/orders` - Order management interface
- `/admin/orders/[id]` - Individual order details with status updates

### API Routes

- `POST /api/submit-order` - Submit new customer order
- `POST /api/admin/login` - Admin login with bcrypt password verification
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/orders` - Fetch all orders (protected)
- `GET /api/admin/orders/[id]` - Fetch single order (protected)
- `PATCH /api/admin/orders/[id]` - Update order status (protected)
- `GET /api/admin/stats` - Fetch dashboard statistics (protected)

### Database Schema

**Order Model:**
- `id`: String (CUID)
- `name`: String
- `mobile`: String
- `address`: String
- `products`: String[] (array of product IDs)
- `sizes`: String[] (array of sizes)
- `quantity`: Int
- `status`: String (pending, confirmed, cancelled, delivered)
- Indexed on: mobile, createdAt, status

**Admin Model:**
- `id`: String (CUID)
- `username`: String (unique)
- `password`: String (bcrypt hashed)
- `email`: String? (optional)

### Glassmorphism Design System

The app uses custom CSS classes defined in `src/app/globals.css` for glass effects:

- `.glass` - Basic glass effect (blur 10px, semi-transparent)
- `.glass-dark` - Darker glass variant (blur 12px)
- `.glass-strong` - Stronger glass effect (blur 16px)
- `.glass-card` - Card glass with shadow (blur 20px)
- `.glass-gradient` - Gradient glass effect

All glass classes have dark mode variants (`.dark .glass`, etc.) for proper theming.

### shadcn/ui Configuration

- Style: `new-york`
- Base color: `neutral`
- Icon library: `lucide`
- Path aliases: `@/components`, `@/lib`, `@/hooks`

When adding new shadcn/ui components, use `npx shadcn@latest add <component>`.

### Form Patterns

The order form (`/page.tsx`) demonstrates the standard pattern:
- Client component with `'use client'` directive
- React Hook Form with Zod schema validation
- localStorage persistence for form data
- Loading and success states
- Bengali validation messages

### Authentication Pattern

Admin authentication uses:
- JWT tokens stored in HTTP-only cookies
- Middleware at `src/middleware.ts` protecting admin routes
- bcrypt for password hashing
- jose library for JWT signing/verification

### Business Logic

**Pricing & Delivery:**
- Drop Shoulder T-shirt price: 490৳ per piece
- Delivery: Currently FREE (limited time offer)
- Regular delivery charges (currently waived):
  - Inside Dhaka: 70৳
  - Outside Dhaka: 120৳
- Cash on delivery nationwide
- Helpline: 01406037913

**Product Details:**
- 10 product variants (product1 - product10)
- Available sizes: M, L, XL
- Fabric: Interlock Cotton & Rib Cotton
- GSM: 220 (premium quality)
- Drop shoulder design

## Important Notes

- **Package Manager**: Use `npm` (not bun/yarn)
- **Production Build**: Uses standalone output for optimized deployment
- **Build Configuration**: TypeScript and ESLint errors are ignored during builds (see `next.config.ts`)
- **Theme**: Amber/orange gradient as primary color throughout the app
- **Language**: The order form uses Bengali for validation messages and UI text
- **Navigation**: Use `<a>` tags for external/route navigation to avoid React component issues
- **Dev Server Port**: Runs on port 3001 (not 3000)
- **Database**: PostgreSQL (not SQLite) - ensure DATABASE_URL is set in .env
