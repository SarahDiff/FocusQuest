# Accessibility CLI (automated)

FocusQuest includes two checks:

| Command | What it does |
|--------|----------------|
| `npm run a11y:contrast` | **Token contrast** — WCAG-style ratios for `--fq-*` colors on solid & frosted backgrounds (no browser). |
| `npm run a11y:axe` | **axe-core + Playwright** — starts the dev server, opens routes in headless Chromium, runs WCAG 2.1 AA rules. |
| `npm run a11y:axe:only` | Same as axe audit, but **you must already have** `npm run dev` running on `http://127.0.0.1:3000`. |

## One-time setup (Playwright browser)

After `npm install`, install the Chromium binary (required for `a11y:axe`):

```bash
npx playwright install chromium
```

On Linux CI you may need system deps:

```bash
npx playwright install-deps chromium
```

## Run the full browser audit

From the project root:

```bash
npm run a11y:axe
```

This uses [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test) to:

1. Run `npm run dev`
2. Wait until `http://127.0.0.1:3000` responds
3. Run `script/a11y-browser.mjs` (axe scans)
4. Stop the server when finished

### Custom base URL

```bash
A11Y_BASE_URL=http://127.0.0.1:4000 npm run a11y:axe:only
```

## What gets scanned

The script runs **two passes**:

1. **Onboarding** — `localStorage` cleared; visits `/` (splash / onboarding shell).
2. **Main app** — seeds a minimal `focusquest_v1` save (onboarding complete + active session) and visits:
   - `/`, `/skills`, `/history`, `/profile`, `/profile/edit-character`, `/session`

It does **not** cover every possible UI state (e.g. every onboarding step, modals, or session complete). Add more routes or seeds in `script/a11y-browser.mjs` as needed.

## Interpreting failures

- **Violations** print with rule id, impact, help URL, and a few selectors.
- Fix in React/CSS, or adjust axe options in the script (e.g. `exclude`, `disableRules`) only if you have a documented exception.

## CI

Add a job that runs:

```bash
npm ci
npx playwright install chromium
npm run a11y:contrast
npm run a11y:axe
```

Ensure the Node image has Playwright’s [system dependencies](https://playwright.dev/docs/ci) if you use `--with-deps` or `install-deps`.
