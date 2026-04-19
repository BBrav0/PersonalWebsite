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

## Post-Migration Manual Testing (user performs)
1. Connect GitHub repo in Cloudflare dashboard
2. Set environment variables (GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_WEBHOOK_SECRET)
3. Deploy and verify:
   - Home page loads
   - Blog listing and individual posts load
   - Resume page loads and PDF viewer works
   - GitHub projects section shows repos
