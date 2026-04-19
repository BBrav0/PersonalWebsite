---
name: migration-worker
description: Worker for migrating Next.js from Vercel to Cloudflare Pages
---

# Migration Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Features involving:
- Removing Vercel-specific dependencies and code
- Adding Cloudflare adapter, configuration files, and analytics
- Adapting API routes for Cloudflare Workers runtime
- Verifying builds succeed with the new adapter

## Required Skills

None.

## Work Procedure

1. **Read the feature description carefully.** Understand exactly what files need to change and what the expected behavior is.

2. **Read all affected files first.** Before making any change, read the current state of every file you will modify. Understand the existing code patterns.

3. **Make changes incrementally.** For each file:
   - Read the file
   - Make the edit
   - Verify the edit is correct by reading the file again

4. **For dependency changes:**
   - Use `npm install --legacy-peer-deps <package>` to add packages
   - Use `npm uninstall <package>` to remove packages (NOTE: still need --legacy-peer-deps on subsequent installs)
   - Verify `package.json` reflects the changes

5. **For new config files (wrangler.jsonc, open-next.config.ts):**
   - Create the file with the exact content specified in AGENTS.md and the feature description
   - Read it back to verify

6. **For API route changes:**
   - Read the entire route file first
   - Understand all the logic before removing/changing anything
   - Preserve all functional behavior (error handling, response formats, status codes)
   - Only change what's necessary for Cloudflare compatibility

7. **Run build verification:**
   - First run `npx next build` to verify Next.js build still works
   - Then run `npx opennextjs-cloudflare build` if the adapter is installed
   - If build fails, read the error carefully and fix the root cause
   - Do NOT skip build verification

8. **Verify no regressions:**
   - After all changes, search for any remaining Vercel references: `grep -r "@vercel" app/ components/ lib/`
   - Verify `.gitignore` includes `.open-next`
   - Verify `package.json` looks correct

9. **Commit your work** with a clear message describing what was changed and why.

## Example Handoff

```json
{
  "salientSummary": "Removed @vercel/analytics and @vercel/speed-insights from package.json and layout.tsx. Installed @opennextjs/cloudflare and wrangler. Created wrangler.jsonc with nodejs_compat flag and open-next.config.ts. Added Cloudflare Web Analytics beacon to layout.tsx. Updated .gitignore. Ran `npx opennextjs-cloudflare build` successfully (exit code 0).",
  "whatWasImplemented": "Complete Cloudflare adapter setup: removed 2 Vercel packages, added @opennextjs/cloudflare + wrangler, created wrangler.jsonc and open-next.config.ts, added CF analytics snippet, updated .gitignore and package.json scripts.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      {
        "command": "npm uninstall @vercel/analytics @vercel/speed-insights",
        "exitCode": 0,
        "observation": "Removed 2 packages"
      },
      {
        "command": "npm install --legacy-peer-deps @opennextjs/cloudflare wrangler",
        "exitCode": 0,
        "observation": "Added 2 packages"
      },
      {
        "command": "npx next build",
        "exitCode": 0,
        "observation": "Build succeeded, 13 pages generated"
      },
      {
        "command": "npx opennextjs-cloudflare build",
        "exitCode": 0,
        "observation": "Worker output at .open-next/worker.js, assets at .open-next/assets/"
      },
      {
        "command": "grep -r @vercel app/ components/ lib/",
        "exitCode": 1,
        "observation": "No matches - all Vercel references removed from source"
      }
    ],
    "interactiveChecks": []
  },
  "tests": {
    "added": []
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- OpenNext build fails with an error you cannot diagnose (e.g., adapter incompatibility with Next.js version)
- A required npm package fails to install
- The feature description is ambiguous about what caching strategy to use
- You discover that a file mentioned in the feature doesn't exist or has different content than expected
