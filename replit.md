# Saral Yojana Maharashtra - Government Schemes Portal

## Overview

Saral Yojana is a web application that aggregates Maharashtra government schemes from multiple official RSS feeds into a searchable, user-friendly platform. The application helps citizens discover welfare programs relevant to their district and category (farmers, students, women & child, health, etc.) by automatically fetching and scoring RSS feed content.

**Tech Stack:**
- Frontend: React with Vite, TailwindCSS, shadcn/ui components
- Backend: Express.js with TypeScript
- Database: PostgreSQL (via Neon serverless)
- ORM: Drizzle ORM
- RSS Parsing: rss-parser
- State Management: TanStack Query (React Query)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- Page-based routing using Wouter (lightweight React router)
- Component library based on shadcn/ui (Radix UI primitives with Tailwind styling)
- Responsive design with mobile-first approach
- Path aliases configured: `@/` for client/src, `@shared/` for shared types

**Key Pages:**
- Home: Hero section with search, category grid, district grid, latest schemes
- Schemes: Filterable/searchable list with pagination
- SchemeDetails: Individual scheme information
- About/Contact: Static informational pages

**State Management:**
- TanStack Query for server state and caching
- Local state with React hooks
- No global state management library (Redux/Zustand) currently used

**Styling Approach:**
- TailwindCSS with custom theme variables (CSS custom properties)
- Government-friendly color scheme: Primary Blue (#1E40AF), Farmer Green (#2F855A), Amber Accent (#F59E0B)
- New York style from shadcn/ui with neutral base color
- Custom animations and transitions via Tailwind

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module format
- Development mode uses tsx for hot-reloading
- Production build bundles with esbuild

**API Design:**
- RESTful endpoints under `/api` prefix
- Endpoints:
  - `GET /api/schemes` - List schemes with pagination and filters (q, district, category, page, size)
  - `GET /api/scheme/:id` - Get single scheme by ID
  
**Request/Response Flow:**
1. Client makes API request via fetch
2. Express middleware logs request duration and response
3. Storage layer queries PostgreSQL via Drizzle ORM
4. Structured JSON responses with error handling

**RSS Feed Integration:**
- Background process fetches from 3 official sources:
  - India.gov.in schemes XML
  - PIB agriculture feed
  - MyGov.in schemes feed
- Parser converts XML to JSON
- Relevance scoring algorithm:
  - +5 points for Maharashtra mentions
  - +4 points for district name detection (36 districts with aliases)
  - +3 points for agriculture keywords
  - +2 points for PIB agriculture source
- Category detection based on keyword matching (farmers, students, women-child, health, housing, skill-dev, social-security, tribal)
- District detection using predefined list with aliases

### Data Storage

**Database Schema (Drizzle ORM):**

**users table:**
- id (UUID primary key, auto-generated)
- username (unique text)
- password (text)

**schemes table:**
- id (text primary key)
- title (text, required)
- description (text, required)
- link (text, unique, required) - used for upsert conflict detection
- publishedDate (timestamp with timezone)
- source (text: "PIB" | "IndiaGov" | "MyGov")
- relevanceScore (integer, default 0)
- districtDetected (text, nullable)
- categoryDetected (text, nullable)
- fetchedAt (timestamp, auto-set to now())

**Data Operations:**
- Upsert schemes on conflict (link) - updates existing records
- Filtered queries with district, category, and text search
- Pagination support
- Ordering by relevance score (descending)

**Database Provider:**
- Neon serverless PostgreSQL
- Connection pooling via @neondatabase/serverless
- DATABASE_URL environment variable required

### External Dependencies

**Third-Party Services:**
1. **RSS Feed Sources (Read-only):**
   - https://www.india.gov.in/rss/schemes.xml
   - https://pib.gov.in/RssFeed.aspx?ModId=6&Category=agriculture
   - https://www.mygov.in/feeds/schemes.xml

2. **Database:**
   - Neon PostgreSQL (serverless)
   - Requires DATABASE_URL environment variable

**Key NPM Packages:**
- Frontend:
  - @tanstack/react-query - Server state management
  - wouter - Lightweight routing
  - @radix-ui/* - Headless UI primitives (30+ components)
  - tailwindcss - Utility-first CSS
  - date-fns - Date formatting
  - zod - Schema validation
  - react-hook-form - Form management
  
- Backend:
  - express - Web framework
  - drizzle-orm - TypeScript ORM
  - @neondatabase/serverless - PostgreSQL driver
  - rss-parser - RSS/XML parsing
  - drizzle-zod - Zod schema generation from Drizzle

- Development:
  - vite - Frontend build tool and dev server
  - tsx - TypeScript execution for development
  - esbuild - Backend bundler for production
  - drizzle-kit - Database migrations

**API Integration Notes:**
- No authentication currently implemented for RSS feeds (public endpoints)
- No rate limiting configured
- Schemes are upserted (not deleted) to maintain history
- No webhook or real-time sync - periodic fetching pattern expected