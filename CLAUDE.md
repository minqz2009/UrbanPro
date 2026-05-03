# UrbanPro — Claude Code Instructions

## Pre-Push Checklist (must run all before committing):

```bash
# 1. Type check with BOTH configs (CI uses app config which is stricter)
npx tsc --noEmit && npx tsc --noEmit --project tsconfig.app.json

# 2. Verify production build succeeds
npm run build

# 3. Run all tests
npm test
```

## Project Overview

- Vite 8 + React 19 + TypeScript SPA
- HashRouter for GitHub Pages hosting
- Content managed via `public/data/content.json`
- Admin portal at `/#/admin` saves directly to GitHub via API
- Deployed via GitHub Actions → GitHub Pages

## Architecture Notes

- `useContent.ts`: fetches content.json, merges with defaults, module-level cache
- `Admin.tsx`: all editors in one file; save flow uses `batchCommit` → `waitForDeploy`
- `github.ts`: GitHub API wrapper; uses `expectedBaseSha` for optimistic concurrency
- Pages render from content props — no hardcoded values

## Test Files

- `tests/admin-coverage.mjs`: admin portal structure + logic checks (mock data only)
- `tests/configurable-items.mjs`: config items + schema + source patterns
- `tests/verify-phones.mjs`: phone fallback logic
- All tests use fabricated/mock data — never depend on real content.json values

## Common Pitfalls

- `snap[tab]` needs `(snap as any)[tab]` for TypeScript
- Early returns in useMemo must include all destructured fields
- CI uses `tsconfig.app.json` which is stricter than `tsc --noEmit`
- S built, tests passed, all clean — ready to push
