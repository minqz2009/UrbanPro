# UrbanPro — Claude Code Instructions

## Pre-Push Checklist

Run ALL three before every commit/push. CI will fail if any are skipped:

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
- HashRouter for GitHub Pages hosting (`/#/plumbing`, `/#/admin`, etc.)
- Content managed via `public/data/content.json`
- Admin portal at `/#/admin` saves directly to GitHub via API (no git push)
- Deployed via GitHub Actions → GitHub Pages (triggered by push to `main`)

## Development Workflow

### Adding a new configurable field (end-to-end):

1. **Interface**: Add the field to the TypeScript interface in `src/hooks/useContent.ts`
2. **Default**: Add a default value in the `DEFAULT` constant in the same file
3. **Merge**: Add fallback logic in the `merge()` function
4. **Content.json**: Add the field with its default value to `public/data/content.json`
5. **Admin editor**: Add an input in the relevant editor in `src/pages/Admin.tsx`
6. **Page render**: Update the page component to read the field from content
7. **Dirty detection**: Add section + field to the `dirtySections`/`dirtyFields` computation in the `useMemo`
8. **Tests**: Add assertions in the appropriate test file using fabricated data

### Making changes to Admin.tsx:

- The admin page does NOT use Header/Footer/FloatingContact (special route in App.tsx)
- All editors live in one file — keep them organized by section
- New `SectionHeading` calls must pass `dirty={ds('SectionName')}` prop
- New `Field` calls must pass `dirty={df('fieldName')}` prop
- New sections need entries in the `useMemo` dirty detection

### Modifying pages:

- All visible text must come from `content` via `useContent()` hook
- Never hardcode text that the admin should be able to change
- Keep mobile media queries inside the component's `<style>` tag
- Never use `translateZ(0)` or `backfaceVisibility: hidden` — they conflict with Framer Motion on iOS

## Architecture Notes

- `useContent.ts`: fetches content.json, merges with defaults, module-level cache (`_cache`)
- `Admin.tsx`: all editors in one file; save flow uses `batchCommit` → `waitForDeploy`
- `github.ts`: GitHub API wrapper; `batchCommit` uses `expectedBaseSha` for optimistic concurrency
- `merge()`: fills in missing fields from defaults, handles phone fallback
- Pages render from content props — no hardcoded values
- Admin portal saves create Git commits directly on `main` via GitHub API

## Test Rules (CRITICAL)

- **Tests must NEVER depend on real content.json values**
- Use fabricated/mock data for all logic tests
- Check source code patterns (`.includes()` on TSX/CSS strings), not rendered output
- Check types and structure (`typeof`, `Array.isArray`), not specific values
- Check with fabricated simulations, not by reading real data fields
- The ONLY exception: checking that required keys exist (`!== undefined`)

### Test files:

- `tests/admin-coverage.mjs`: admin portal structure + logic + dirty detection + concurrency
- `tests/configurable-items.mjs`: config items + schema + source patterns + new fields
- `tests/verify-phones.mjs`: phone fallback logic with simulated merge

## Common Pitfalls

- `(snap as any)[tab]` not `snap[tab]` — TypeScript strict mode rejects string indexing
- Early returns in `useMemo` must include ALL destructured fields
- CI builds with `tsconfig.app.json` which is stricter than bare `tsc --noEmit`
- `useMemo` dependency array must include all referenced reactive values
- Admin portal runs without Header/Footer — don't reference those components
- Photo upload with review IDs: handleSave must check actual review arrays, not just `rev-` prefix
- Dirty detection for review photos: check each tab independently, never use `||` to combine
