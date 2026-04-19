# User Testing

**What belongs here:** Testing surface, tools, validation approach.

---

## Validation Surface
- Primary validation: build succeeds (`npx opennextjs-cloudflare build`)
- No unit tests exist in this project
- No dev server testing needed — build verification is the automated gate
- Live site testing done manually by user after deployment

## Validation Concurrency
- Max concurrent validators: 3 (build is CPU-intensive on 24-core / 32GB machine)
- Build is the only automated validation surface

## Flow Validator Guidance: code-inspection

This surface covers code and file inspection assertions — verifying package.json, config files, source code, and .gitignore contents.

### Testing approach
- Use Read/Grep tools to inspect file contents
- All operations are read-only — no shared mutable state
- No server or browser needed
- Safe for full concurrent execution (no isolation constraints)

### Key paths
- Project root: C:\Users\bendc\Documents\GitHub\PersonalWebsite
- package.json, package-lock.json — package dependencies
- app/layout.tsx — analytics, layout components
- app/api/ — API route files
- app/blog/[slug]/page.tsx — blog page
- wrangler.jsonc — Cloudflare worker config
- open-next.config.ts — OpenNext adapter config
- .gitignore — ignored files
- README.md — documentation

### Boundaries
- Do NOT modify any files — read-only inspection
- Do NOT run any build commands (build group handles that)
- Report findings in the flow report JSON

## Flow Validator Guidance: build

This surface covers build-related assertions — running the full build pipeline and verifying output.

### Testing approach
- Run `npx opennextjs-cloudflare build` once
- Inspect build output (.open-next/ directory) and build logs
- Only one build should run at a time (CPU-intensive)

### Key commands
- Install: `npm install --legacy-peer-deps` (idempotent)
- Build: `npx opennextjs-cloudflare build`
- Project root: C:\Users\bendc\Documents\GitHub\PersonalWebsite

### Boundaries
- Do NOT modify source files
- Build output goes to .open-next/ (gitignored)
- Capture build output for evidence

## Post-Migration Manual Testing (user performs)
1. Connect GitHub repo in Cloudflare dashboard
2. Set environment variables (GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_WEBHOOK_SECRET)
3. Deploy and verify:
   - Home page loads
   - Blog listing and individual posts load
   - Resume page loads and PDF viewer works
   - GitHub projects section shows repos
