# Environment

**What belongs here:** Required env vars, external dependencies, setup notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Node.js
- Node.js 22.16.0
- npm 11.4.2
- Next.js 15.5.14

## npm Install Quirk
Must use `--legacy-peer-deps` due to peer dep conflict: react-day-picker@8.10.1 requires date-fns ^2.28.0 || ^3.0.0 but project has date-fns@4.1.0.

## Environment Variables (set in Cloudflare dashboard)
- `GITHUB_PERSONAL_ACCESS_TOKEN` — GitHub API auth for fetching repos
