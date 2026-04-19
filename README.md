# benbravo.net

Personal website built with Next.js. Live at [benbravo.net](https://benbravo.net).

## Sections

- **Home** — Landing page with links to projects and blog
- **Software** — GitHub projects fetched via API
- **Resume** — Interactive resume with PDF download
- **Blog** — Markdown-based blog with syntax highlighting and typography

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI + Tailwind Typography
- **Blog:** gray-matter (frontmatter) + react-markdown + remark-gfm + rehype-raw
- **Deployment:** Cloudflare Pages

## Running Locally

```bash
git clone https://github.com/BBrav0/PersonalWebsite.git
cd PersonalWebsite
npm install --legacy-peer-deps
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Deploying

This site deploys to Cloudflare Pages using the `@opennextjs/cloudflare` adapter.

**Option A — CLI deploy:**
```bash
npm run deploy
```

**Option B — Cloudflare Dashboard (recommended):**
1. Connect your GitHub repo in the [Cloudflare Pages dashboard](https://dash.cloudflare.com/)
2. Set the build command to `npx opennextjs-cloudflare build`
3. Set the output directory to `.open-next/assets`
4. Add required environment variables (see below)

**Environment variables** (set in Cloudflare dashboard):
- `GITHUB_PERSONAL_ACCESS_TOKEN` — GitHub API token for fetching repos

## Writing a Blog Post

Drop a markdown file in `content/posts/`:

```markdown
---
title: "Your Post Title"
description: "Short summary shown in the listing"
date: "2026-04-15"
tags: ["tag1", "tag2"]
draft: true
---

Your content here. Supports full markdown + GFM.
```

Set `draft: true` to hide it from the listing. Remove or set to `false` to publish.

## Project Structure

```
app/
  page.tsx              # Home page
  blog/
    page.tsx            # Blog listing
    [slug]/page.tsx     # Individual post
  resume/page.tsx       # Resume page
  api/                  # API routes (GitHub repos, resume assets)
components/             # UI components
content/posts/          # Blog posts (markdown)
lib/blog.ts             # Blog post parsing utilities
public/                 # Static assets
```

## License

MIT
