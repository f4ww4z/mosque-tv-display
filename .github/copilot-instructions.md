# Mosque TV Display - AI Agent Guide

## Project Overview

Next.js 14 application for displaying prayer times and announcements on mosque/surau TVs. Data fetched from JAKIM e-solat portal (Malaysia). Supports multi-tenant architecture with admin dashboard for mosque management.

## Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with bcrypt (localStorage on client, Authorization header on server)
- **Styling**: Tailwind CSS with dynamic theme classes
- **Key Libraries**: moment-timezone, react-multi-carousel, qr-code-styling

### Core Structure

```
app/
  api/              # API routes with Next.js route handlers
  signage/[masjidId]/  # Public TV display view
  masjid/[id]/      # Admin dashboard
  admin/            # Superadmin area
components/
  Signage/          # TV display components
  MasjidDashboard/  # Admin management UI
lib/
  auth.ts           # JWT utilities
  requests.ts       # Auth middleware for API routes
  seed.ts           # Database seeding (Malaysia cities/zones)
prisma/
  schema.prisma     # Database schema
```

## Critical Patterns

### Multi-Tenant & Role-Based Access

- Two roles: `MASJID_ADMIN` (per-mosque), `SUPERADMIN` (platform-wide)
- Every API route uses `handleRequest()` wrapper from [lib/requests.ts](lib/requests.ts) for auth
- Masjid admins auto-scoped to their `masjidId` via JWT session
- Example: See [app/api/masjid/[masjidId]/profile/route.ts](app/api/masjid/[masjidId]/profile/route.ts)

### Dynamic Theming

- Settings table stores theme color (e.g., "teal", "blue")
- Use Tailwind classes like `bg-${theme}-darker`, `text-${theme}-lighter`
- Must configure themes in [tailwind.config.ts](tailwind.config.ts) safelist
- Applied in [components/Signage/index.tsx](components/Signage/index.tsx)

### Prayer Times Integration

- Fetched from `/api/prayer?city=<cityName>&countryCode=<code>`
- Uses JAKIM e-solat API for Malaysian prayer times
- Cities linked to zones/states in Prisma (see `City`, `Zone`, `State` models)
- Real-time countdown in [components/Signage/PrayerTimetable.tsx](components/Signage/PrayerTimetable.tsx)

### File Uploads & Carousels

- Images stored in `/public/` directory with filenames in DB
- Carousel items ordered by `order` field, filterable by `hidden` flag
- Sharp library for image processing
- See [app/api/masjid/[masjidId]/carousel/route.ts](app/api/masjid/[masjidId]/carousel/route.ts)

## Database Conventions

### Prisma Client

- Import from `lib/prisma.ts` (singleton pattern)
- Always use `cuid()` for IDs (not autoincrement)
- Timestamps: `createdAt`, `updatedAt` (auto-managed)

### Key Relationships

- `Masjid` → `User` (admins), `MasjidSettings`, `CarouselItem`, `Event`, `Facility`
- `MasjidSettings` → `MasjidWorldClock[]` (for world clocks display)
- `City` → `Zone` → `State` (Malaysian geography, seeded from [lib/seed.ts](lib/seed.ts))

### Enums

- `Role`: MASJID_ADMIN, SUPERADMIN
- `MasjidType`: SURAU, MASJID
- `RentUnit`: PER_HOUR, PER_DAY
- `BookingStatus`: PENDING_APPROVAL, APPROVED, REJECTED

## Developer Workflows

### Database Commands

```bash
# Apply migrations
npx prisma migrate dev --name <description>

# Reset & seed (NEVER on production!)
npx prisma migrate reset

# Seed data
npm run playground  # or directly: ts-node lib/seed.ts
```

### Local Development

```bash
# Start dev server (uses dotenv-cli for .env)
npm run dev

# Start PostgreSQL via Docker
docker-compose up -d

# Hash password for manual user creation
npm run hashPassword
```

### Deployment

- See [redeploy.sh](redeploy.sh) for production deployment script
- Prisma generates client for `linux-musl-openssl-3.0.x` (check schema.prisma binaryTargets)

## API Route Patterns

### Standard Flow

1. Import `handleRequest` from [lib/requests.ts](lib/requests.ts)
2. Set `export const dynamic = "force-dynamic"` for no caching
3. Validate JWT → extract `sessionUser`
4. Check role permissions (automatic for `/api/masjid/*` routes)
5. Return `NextResponse.json()` or throw error

Example:

```typescript
export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async ({ sessionUser }) => {
    const data = await prisma.masjid.findFirst({
      where: { id: params.masjidId },
    })
    return NextResponse.json(data)
  })
}
```

### Error Handling

- Throw errors with Malay messages (e.g., "Masjid tidak ditemukan")
- `handleRequest` catches and returns 400/401/500 automatically
- Client uses [lib/fetchJson.ts](lib/fetchJson.ts) wrapper for automatic error parsing

## Signage Display Logic

### Component Hierarchy

[components/Signage/index.tsx](components/Signage/index.tsx) orchestrates:

- `Profile` (mosque name/logo)
- `Calendar` (Gregorian + Hijri dates)
- `MyClock` (analog clock with timezone)
- `PrayerTimetable` (5 daily prayers + iqamah countdown)
- `DisplayCarousel` (slideshow with `timeBetweenSlideshows` setting)
- `NewsBanner` (scrolling news from `newsTexts[]`)

### Do Not Disturb Mode

- Triggered during prayer time (between azan and iqamah end)
- Overlays [components/DoNotDisturbScreen.tsx](components/DoNotDisturbScreen.tsx)
- Controlled by `togglePrayerMode` callback

## Conventions & Style

### Language

- UI primarily in Malay (Bahasa Malaysia)
- Error messages in Malay
- Database fields/code in English

### Component Patterns

- Use "use client" for interactive components
- Server components for static pages (e.g., [app/signage/[masjidId]/page.tsx](app/signage/[masjidId]/page.tsx))
- Custom hooks in [components/Hooks/](components/Hooks/)

### Type Definitions

- Located in [types/](types/) directory
- Match Prisma models but may have additional fields for API responses
- Example: `MasjidProfileResponse` includes nested zones/cities

## Watch Out For

1. **Dynamic Routes**: Next.js uses `[param]` folders, not `<param>`
2. **Prisma Migrations**: Always name migrations descriptively for team clarity
3. **JWT Expiry**: Tokens expire in 30 days ([lib/auth.ts](lib/auth.ts))
4. **Public vs Protected**: `/signage/*` and `/events/*` are public (no auth)
5. **City/Zone Data**: Seeded only for Malaysia - extending requires updating [lib/seed.ts](lib/seed.ts)
