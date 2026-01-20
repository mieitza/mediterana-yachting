# Mediterana Yachting

A luxury yacht charter website built with Next.js, Sanity CMS, and TailwindCSS.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **CMS**: Sanity
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend
- **Spam Protection**: Cloudflare Turnstile
- **Hosting**: Vercel (recommended)

## Project Structure

```
mediterana-yachting/
├── apps/
│   ├── web/              # Next.js application
│   │   ├── src/
│   │   │   ├── app/      # App router pages
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── styles/
│   │   └── tests/        # Playwright tests
│   └── studio/           # Sanity Studio
│       └── schemas/      # CMS schemas
├── data/
│   └── import.ndjson     # Seed data
└── packages/
    └── config/           # Shared configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Sanity**

   Create a new Sanity project at [sanity.io/manage](https://sanity.io/manage):
   ```bash
   cd apps/studio
   npx sanity init
   ```

   Note your Project ID and update the environment variables.

3. **Configure environment variables**

   Copy the example env file:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Fill in your values:
   ```env
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=your_read_token

   # Site
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=your@email.com

   # Spam Protection (Cloudflare Turnstile)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   ```

4. **Import seed data**
   ```bash
   cd apps/studio
   npx sanity dataset import ../../data/import.ndjson production --replace
   ```

5. **Run development servers**

   In one terminal:
   ```bash
   pnpm dev          # Next.js at http://localhost:3000
   ```

   In another terminal:
   ```bash
   pnpm dev:studio   # Sanity Studio at http://localhost:3333
   ```

## Environment Variables

### Required for Production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually `production`) |
| `SANITY_API_READ_TOKEN` | Sanity API token with read access |
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `RESEND_API_KEY` | Resend API key for email |
| `CONTACT_EMAIL` | Email to receive inquiries |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

### Development

For local development without email/spam protection:
- Use Turnstile test keys (provided in `.env.local`)
- Inquiries will be logged to console if Resend is not configured

## Scripts

```bash
# Development
pnpm dev              # Run Next.js
pnpm dev:studio       # Run Sanity Studio

# Build
pnpm build            # Build Next.js
pnpm build:studio     # Build Sanity Studio

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run Playwright e2e tests

# Data
pnpm sanity:import    # Import seed data to Sanity
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Sanity Studio

Deploy Sanity Studio separately:
```bash
cd apps/studio
npx sanity deploy
```

## CMS Content Types

- **Site Settings**: Global configuration, featured yachts
- **Yachts**: Fleet with specs, gallery, pricing
- **Destinations**: Mediterranean regions with itineraries
- **Posts**: Blog articles
- **Pages**: Custom page content (Home, About, Contact)

## Features

- Responsive design optimized for mobile
- SEO optimized with metadata, sitemap, robots.txt
- JSON-LD structured data for yachts
- Image optimization with next/image
- Form validation with Turnstile spam protection
- Yacht filtering by type, guests, length
- Dynamic routes with ISR (Incremental Static Regeneration)

## Design System

Colors (from `tokens.json`):
- Navy: `#0A1B2A` (primary/accent)
- Sand: `#C9B48C` (secondary)
- Background: `#F7F4EF`
- Surface: `#FFFFFF`

Typography:
- Headings: Cormorant Garamond
- Body: Inter

## License

Private. All rights reserved.
