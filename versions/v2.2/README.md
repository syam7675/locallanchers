# Local Lanchers — Version 2.2 snapshot

A standalone source snapshot of the updated existing application. The active deployment builds the root `app/` directory; this version folder preserves the 2.2 design, source and walkthrough together.

Run with Node.js 24+: `cd app`, `npm ci`, then `npm run dev`. For a local production build: `npm run build` then `npm start`.

See [design, account flows and verification](docs/v2.2/README.md) and [the actual walkthrough](docs/v2.2/Local-Lanchers-v2.2-Walkthrough.mp4). Real accounts require the full backend with persistent storage and `ENABLE_USER_ACCOUNTS=true`. The public Vercel demo does not collect accounts or audit requests.

No runtime databases, account credentials, environment secrets, build output or dependencies are included.
