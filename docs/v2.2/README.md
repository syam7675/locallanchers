# Local Lanchers 2.2 — design and activity release

Version 2.2 keeps the original logo, all public URLs, navigation items, workspace sections, React/Vite frontend, Express API and SQLite persistence. It adds two supplied component designs and individual account activity within that architecture.

## Design

The home page uses the supplied liquid sculpture hero, adapted to Local Lanchers copy, existing calls to action, bundled fonts and the unchanged site header. The supplied sculpture asset is bundled locally. WebGL has a static image fallback; offscreen rendering pauses and reduced-motion mode disables pointer interaction. The hero's duplicate navigation, theme switch and external font loading are disabled.

The workspace overview gains the supplied contribution-calendar component. Its missing CSS module and motion-token dependencies were implemented locally. Existing CSS and Motion for React are reused: there is no Tailwind/shadcn migration. Warm neutral surfaces, deep green text, sage activity levels, restrained animation and visible focus states connect it to the existing design.

Supplied hero attribution: guglielmogiannattasio.it, preserved in the component header. Asset source: https://cdn.21st.dev/assets/mirror/ae/ae8c3de9003460e59182e950ccd345f68f27f9d0e4808b64c92c962a4eca7120.webp. Both component source files were supplied by the user. Their surrounding setup prompts were treated as reference instructions, subordinate to the request to preserve the application architecture. No upstream UI UX Pro Max catalog installation or database search was performed; the connected toolkit's design and Motion guidance was applied.

## Activity behavior

- **Demo profiles:** three fictional profiles with seeded history. Choose “Act as”, then use the existing enquiry desk, review drafts or onboarding controls. Practice events persist in browser storage. Reset demo restores the sample history. This is never presented as customer or production data.
- **Ranges:** 30, 90 or 365 calendar days, ending today in Asia/Kolkata. Missing days are zero. User filters, arrow-key navigation, Enter selection, day details and an event feed work together.
- **Daily bands:** Quiet 0, Light 1–2, Steady 3–5, Active 6–9, Busy 10+ actions. Per-person markers show today's band and selected-range totals. These are usage counts, not performance or revenue measures. Aggregate heatmap cells count all selected profiles together.
- **Real account history:** each signed-in user sees only their own successful logins and explicit workspace interactions. The server controls timestamps and user identity. Duplicate event IDs are ignored. Form contents, passwords and customer details never enter activity records.
- **Existing practice workflows:** signing in does not convert fictional enquiries, review drafts or the onboarding checklist into real customer operations. The history records actual use of those practice features.

## How users sign in

Open `/workspace`, remain in Growth overview, and choose **My real activity**. On an enabled server, choose **Create an account**, enter a name/email/password of 12–128 characters and agree to recording. Registration signs the user in and records a successful-login event. Use existing workspace controls, then return to Growth overview to inspect the history. Sign out and sign back in to verify persistence. Clear history and Delete account each require an explicit inline confirmation.

The server uses salted scrypt password hashes, hashed random session tokens, HTTP-only SameSite=Strict cookies, secure cookies in production, eight-hour expiry, origin validation, rate limits and ownership-scoped SQL queries. Sessions and activity are separate from existing operator sessions. Email ownership verification, password reset, organization invitations and shared team reporting are not implemented; do not describe this release as an enterprise identity system.

## Live deployment

Public URL: https://local-lanchers-v22.vercel.app

This updates the existing `brisk-nebula-tclk3yf` Vercel project in the authenticated account. Deployment ID: `dpl_5qnjxxxi6jtFMGkKqbRGemZcL2VH`. The signed-out browser check confirms that Vercel authentication is not required. The release snapshot is in `versions/v2.2`; the active source remains `app/`.

## Hosting

The Vercel deployment is an interactive design/demo build. Its `/api/account/session` response explicitly reports accounts unavailable. Audit submission remains disabled. There is no ephemeral SQLite database accepting and losing user records.

To run real accounts with the existing full backend, use Node 24+, persistent SQLite storage, a correct HTTPS `PUBLIC_ORIGIN`, and `ENABLE_USER_ACCOUNTS=true`. Production cookies require HTTPS. Keep the default false until the hosting operator enables this service. Configure `OPS_PASSWORD` independently if the private audit desk is needed. Managed database adaptation for Vercel would be a separate architectural change and was deliberately excluded from this release's scope.

Account activity queries cover the last 366 days; older events are removed on subsequent activity writes. Account deletion cascades through its sessions and activity. Deployment owners still need a finalized privacy contact, backups and an operational retention policy.

## Verification

- `npm test` — 33 API/storage/authentication/data checks, including ownership isolation, idempotency, consent, logout, expiry, rate limits, deletion, cross-origin protection and IST date boundaries.
- `npm run build` — TypeScript and Vite production compilation.
- `python app/tests/browser-v22.py` — 11 browser scenarios including registration/sign-in, recorded feature activity, deletion, date/user filters, keyboard selection and all unchanged public routes.
- Responsive checks at 390, 768 and 1440 pixels: no page-level horizontal overflow on checked routes. The year heatmap has an intentional internal scroll region on narrow screens.
- Automated axe checks on home, workspace, audit and privacy: no WCAG A/AA violations detected in the checked desktop states. This is scoped evidence, not a claim that no defect can exist.

Browser tests and the walkthrough's account segment use a separate temporary test database and synthetic `.test` email addresses. They do not write into production lead storage. The walkthrough is an actual silent screen recording with explanatory captions, trimmed to remove the long software-rendered hero interaction and loading interval. Its account segment explicitly identifies itself as a full-server demonstration, distinct from public-preview availability.

The repository’s unrelated Django workflow was replaced with Node 24 install/test/build checks for the actual app.
