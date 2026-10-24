# Project context — verified baseline, 24 October 2026

Repository: https://github.com/syam7675/locallanchers

## Purpose and journeys

Help local business owners get discovered, convert enquiries, retain customers and review growth. The website’s customer is the business owner, not an end consumer booking a salon/clinic visit.

Customer: Home → Solutions → Industry / How it works / Plans → Audit → manual team follow-up and scope agreement. Saved audit receipt is not a booked consultation. Workspace examples are practice workflows.

Admin: `/ops` → configured operations password → review queue → New / Reviewing / Contacted / Completed → save notes or export CSV. Contacting the owner is currently manual and outside the application.

Account activity: `/workspace` → Growth overview → My real activity → register/sign in when enabled. Demo profiles work without login. Calendar: 30/90/365 days; IST dates; Quiet 0, Light 1–2, Steady 3–5, Active 6–9, Busy 10+ actions per day. Each real user sees only their own events.

## Source map

- `app/src/components/Layout.tsx`: shared navigation/footer.
- `app/src/pages/Marketing.tsx`: public pages and the sculpture hero.
- `app/src/components/ui/liquid-sculpture-hero.tsx`: supplied WebGL design, adapted locally; static fallback.
- `app/src/components/ui/activity-heatmap.tsx` and its utilities: supplied calendar design and local styling/tokens.
- `app/src/components/ActivityPanel.tsx`, `app/src/hooks/useActivity.ts`: demo/real activity UI and requests.
- `app/src/pages/Audit.tsx`: audit form and confirmed receipt.
- `app/src/pages/Workspace.tsx`: browser-local practice records and tabs.
- `app/src/pages/Operations.tsx`: private audit queue.
- `app/src/pages/Info.tsx`: privacy and readiness information.
- `app/server/index.ts`, `api.ts`, `store.ts`, `accounts.ts`: full Node/Express/SQLite server.
- `app/shared/audit.ts`, `activity.ts`: validation and activity/date definitions.
- Root `api/` handlers and `vercel.json`: public-preview availability stubs and Vercel static build. These are not the full persistent backend.
- `promo/`: accepted narrated promo and editable sources.
- `docs/v2.1`, `docs/v2.2`, `versions/v2.2`: design/build guides, verification and the standalone snapshot.

## Versions, not interchangeable names

V1 is the pre-existing website/brand at locallanchers.vercel.app. V2 is the user-uploaded source previously linked through AI Studio. V2.1 is the rebuilt modular application with saved audits/private operations. V2.2 adds the supplied sculpture, heatmap and private individual activity while keeping the architecture/navigation.

Tag `v2.2.0` points to release commit `547109d`; later documentation/static-download commits are on main. Do not assume that the tag and main are identical. The pre-handoff main baseline is `a44c56c`.

## Recorded checks, not new claims

V2.1: 25 API tests, 20 browser checks, eight representative automated accessibility routes with no detected violations. V2.2: 33 API/data tests, 11 browser scenarios, 390/768/1440px layout checks and four representative automated accessibility routes with no detected violations. GitHub Node 24 CI passed through a44c56c. These do not certify every state or future change.

The original Django workflow was unrelated to this application and was replaced by `.github/workflows/app.yml`.

## Public readiness

On 24 October the public health endpoint reported version 2.2.0 and public-demo mode, with no request storage. Account and operations session endpoints reported unconfigured. Real database-backed audit/account features exist in source but are not enabled on this public deployment. No Google, WhatsApp, booking, email, AI, payment or external CRM integration is connected.

## History boundaries

First commit: 22 October 2026, 00:37 IST. No dated record establishes activity on 18–21 October IST. Earlier setup/brief requests exist in conversation without verified dates. Environment draft publication, dots-agents installation and unrelated-session coordination are not established. Figma, ElevenLabs and Higgsfield were requested but not used in the recorded work.
