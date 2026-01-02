# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MAVERICK** is a Bengali e-commerce website for a men's clothing store specializing in hoodies. The site features a landing page and order form with a glassmorphism design aesthetic. It's built as a Next.js 15 application with TypeScript.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
# Dev server logs are tee'd to dev.log

# Build for production (standalone output)
npm run build

# Start production server
npm start
# Server logs are tee'd to server.log

# Lint code
npm run lint

# Database operations (Prisma with SQLite)
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Package Manager**: npm
- **Styling**: Tailwind CSS 4 with custom glassmorphism effects
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Database**: Prisma ORM with SQLite
- **Language**: TypeScript (strict mode)

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page (hero, services, categories, testimonials)
│   ├── order-now/         # Order form page
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles + glassmorphism classes
├── components/
│   └── ui/               # shadcn/ui components (auto-generated)
├── hooks/                # Custom React hooks
└── lib/                  # Utilities (cn() helper for class merging)
```

### Page Routes

- `/` - Landing page with glassmorphism design, showcasing services and products
- `/order-now` - Order form with product selection, color/size picker, form validation in Bengali

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

The order form (`/order-now`) demonstrates the standard pattern:
- Client component with `'use client'` directive
- React Hook Form with Zod schema validation
- localStorage persistence for form data
- Loading and success states
- Bengali validation messages

### Business Logic

**Pricing & Delivery:**
- Hoodie price: 550৳ per piece
- Delivery inside Dhaka: 70৳
- Delivery outside Dhaka: 120৳
- Free delivery for 2+ orders
- Cash on delivery nationwide
- Helpline: 01406037913

## Important Notes

- **Package Manager**: Use `npm` (not bun/yarn)
- **Production Build**: Uses standalone output for optimized deployment
- **Build Configuration**: TypeScript and ESLint errors are ignored during builds (see `next.config.ts`)
- **Theme**: Amber/orange gradient as primary color throughout the app
- **Language**: The order form uses Bengali for validation messages and UI text
- **Navigation**: Use `<a>` tags for external/route navigation to avoid React component issues
