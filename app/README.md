# Local Lanchers — Version 2.2

A modular React application combining the original Local Lanchers logo and growth-service positioning with the uploaded Version 2 design and interaction patterns.

## Run

Requires **Node.js 24 or newer**. SQLite is provided by Node; no separate database service or native add-on is needed.

```bash
cd app
npm ci
npm run dev
```

The server listens on port 4173 by default. The same server handles the frontend and `/api` routes. A database is created at `app/data/local-lanchers.sqlite` on first start. No external API keys are required for the implemented flows.

Production build and local production-mode startup:

```bash
npm run build
npm start
```

Do not use a static-only file server for the audit form: the request API and persistent storage are required.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Growth-service homepage and primary audit action |
| `/growth` | Four selectable growth pillars and customer journey |
| `/industries` | Dental, salon and fitness playbooks |
| `/plans` | Indicative plans and assumption-based scenario calculator |
| `/how-it-works` | Delivery cycle, illustrative first month and audit scope |
| `/audit` | Business details → contact and permissions → review → saved reference |
| `/workspace` | Clearly labeled local demonstration with five sections |
| `/ops` | Password-protected real audit-request desk |
| `/privacy` | Development request privacy notice |
| `/build-notes` | Implemented features, demo boundaries and readiness |

Pillar and industry pages accept `?pillar=found` and `?industry=salon`. Plan and industry selections are carried into `/audit`. Workspace tabs use `?tab=enquiries`, `reviews`, `visibility`, `onboarding` or `overview`.

## Private team access

Copy `.env.example` to an ignored `.env` file and configure a **strong, unique `OPS_PASSWORD` of at least 12 characters**. Do not use the automated tests' password outside their isolated fixture. Restart the server after changing environment configuration. The operations desk fails closed if no valid password is configured.

Never place credentials in source files, Git, screenshots or chat. Requests are not public; only an authenticated team session can list, update or export them. Sessions expire after eight hours and use HTTP-only, same-site strict cookies. Production cookies require HTTPS.

## Environment variables

| Name | Purpose |
| --- | --- |
| `PORT` | Listening port; defaults to 4173 |
| `DATABASE_PATH` | Database path; defaults to `app/data/local-lanchers.sqlite` |
| `OPS_PASSWORD` | Enables the private operations desk; blank disables access |
| `PUBLIC_ORIGIN` | Exact public HTTPS origin used for write-origin validation |
| `NODE_ENV=production` | Serves the built frontend and enables secure cookies |

Store the database on a persistent volume. Back up the database together with its WAL state using a supported SQLite backup procedure. A serverless host with ephemeral filesystem storage needs a managed database adaptation before real lead collection. This build has not been deployed to the existing Vercel site.

## Verification

```bash
npm run test     # 25 meaningful API/storage/authentication checks
npm run check   # TypeScript
npm run build   # TypeScript plus production bundle
```

Browser tests require Python Playwright, Chromium at `/usr/bin/chromium`, the production server on port 4173, and a **separate throwaway test server/database** on port 4243. Start the throwaway server with a test-only operations password matching `LL_BROWSER_OPS_PASSWORD` (the test harness defaults to the clearly labeled fixture value). Never target a real business database.

```bash
python3 tests/browser-checks.py
python3 tests/accessibility-checks.py
```

`tests/requirements-browser.txt` records the Python browser dependency. The scripts allow `LL_BASE_URL` and `LL_OPS_TEST_URL` overrides. Browser evidence and final results are recorded under `docs/v2.1/verification/`. Automated accessibility checks are scoped evidence, not a certification of complete accessibility compliance.

## Modules

- `src/components/Layout.tsx`: header, animated desktop menus, mobile navigation and footer.
- `src/components/ui.tsx`: logo, buttons, section headings, motion wrapper and shared calls to action.
- `src/components/GrowthSections.tsx`: pillar explorer, eight-stage journey, industry playbooks, plans, process, FAQ and scenario calculator.
- `src/components/GrowthBird.tsx`: original supplied Version 2 sculpture artwork, retained as artwork.
- `src/data/content.ts`: editable service, industry, plan, process, integration and FAQ content.
- `src/pages/Marketing.tsx`: public page compositions.
- `src/pages/Audit.tsx`: request state, review, retry and success handling.
- `src/pages/Workspace.tsx`: explicitly fictional browser-local demonstration.
- `src/pages/Operations.tsx`: authenticated real request review, notes, statuses and CSV export.
- `src/pages/Info.tsx`: privacy notice and readiness information.
- `src/styles/global.css`: responsive design and motion tokens, component states and reduced-motion rules.
- `shared/audit.ts`: pure validation shared between client and server.
- `server/api.ts`: request, authentication and private operations endpoints.
- `server/store.ts`: SQLite schema, storage and session records.

## What is real, and what is not connected

Real: audit validation and persistence, idempotent retries, authenticated request reads and updates, private CSV export, all public navigation and interactive content.

Demo only: enquiries, example bookings, review templates and onboarding checkboxes inside `/workspace`. State stays in the browser and can be reset. The demo does not send messages, book appointments, publish replies or alter a real client account.

Not connected: Google Business Profile, WhatsApp, a booking/calendar provider, an AI model, outbound email and external CRM. No fake integration success or invented growth metrics are presented. The scenario calculator uses entered assumptions only.

Before public launch, configure hosting and durable storage, team access, actual contact and privacy/retention details, monitoring and backups, and whichever authorized provider integrations are in scope. See `docs/v2.1/BUILD-AND-DESIGN.md` for the full build document.

## Asset provenance

The original Version 1 logo is copied without modification. The hero is original generated editorial artwork illustrating a local-business interaction; it is not a customer testimonial or a photograph of an identified client. The supplied Version 2 bird sculptures remain illustration assets, not evidence of functioning AI agents. Plus Jakarta Sans and DM Sans are bundled with their OFL licenses. Icons use Lucide, consistent with the uploaded project.

## Version 2.2 accounts and activity

See [the V2.2 release guide](../docs/v2.2/README.md) for the design, heatmap definitions, sign-in instructions, privacy boundaries and verification. Set `ENABLE_USER_ACCOUNTS=true` only on a full Node server with persistent storage to enable individual sign-in. Vercel previews explicitly keep this feature unavailable until durable hosting is connected. No public page or workspace navigation route changed.
