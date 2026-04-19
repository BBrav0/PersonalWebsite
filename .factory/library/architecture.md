# Architecture

**What belongs here:** Architectural decisions, patterns, technology choices.

---

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS + Radix UI
- Deployment: Cloudflare Pages/Workers via @opennextjs/cloudflare

## Page Rendering Modes
- `/` (Home) — `"use client"`, fully client-side
- `/resume` — `"use client"`, fully client-side, fetches from API routes
- `/blog` — Server component, reads markdown at build time via lib/blog.ts
- `/blog/[slug]` — SSG via `generateStaticParams()`, reads markdown at build time
- `/api/*` — Server-side route handlers (run on Cloudflare Worker)

## Cloudflare Adapter
- Using `@opennextjs/cloudflare` (the official adapter, replaces deprecated `@cloudflare/next-on-pages`)
- Entire app runs as a single Cloudflare Worker with static assets served via Cloudflare CDN
- `nodejs_compat` flag enables Node.js built-in APIs (crypto, etc.)
- Build command: `npx opennextjs-cloudflare build` (calls `next build` internally, then packages for Workers)

## Caching Strategy
- No ISR, no R2, no KV — simple Cache-Control headers only
- API routes set `Cache-Control: public, max-age=N` for CDN caching
- Blog pages are fully static (pre-rendered at build time)
