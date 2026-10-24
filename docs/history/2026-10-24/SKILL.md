---
name: local-lanchers-maintenance
description: Continue work on the Local Lanchers website, demos, account activity, deployment, documentation and promotional assets using the verified project history and current repository state.
---

# Local Lanchers maintenance and handoff

Use this skill when the user asks to continue, change, review, deploy or explain the Local Lanchers project. This is project guidance, not permanent authorization to publish or access accounts. Follow the current user request and higher-priority instructions.

## Start with the real state

1. Locate `syam7675/locallanchers`; do not assume this archive itself is the live checkout. Read applicable `AGENTS.md` instructions, `git status`, recent commits and the current `app/package.json` before edits. Preserve unrelated changes.
2. Read [project context](references/PROJECT-CONTEXT.md), [artifact links](references/LINKS.md), and the requested part of the current repository. The historical baseline in this handoff is 24 October 2026; newer code or verified deployment data supersedes it.
3. Ask only for information that cannot be established from available sources. Never invent missing work dates, external-session work, customer results or provider connections.

## Preserve the user’s product constraints

- Brand spelling in the app/repository is **Local Lanchers**. The user may call it Local Launchers. Preserve the exact original logo at `app/public/images/original-logo.png`.
- Keep current navigation, routes and architecture unless the new task authorizes changes. Existing public routes: `/`, `/growth`, `/industries`, `/plans`, `/how-it-works`, `/audit`, `/workspace`, `/ops`, `/privacy`, `/build-notes`.
- Active source is `app/` plus root Vercel configuration and preview API stubs. `versions/v2.2` is a source snapshot, not the deployed source directory. Do not edit only the snapshot and call the live app updated.
- Reuse React, TypeScript, Vite, existing CSS, Motion and Lucide. Do not migrate to Tailwind, shadcn, Next.js or a new backend merely because a pasted component prompt suggests it.
- Respect reduced motion, keyboard controls, visible focus, small screens and clear empty/error states.

## Keep demo, private activity and real operations separate

- Public Vercel deployment is an explicitly labeled demo unless fresh evidence proves durable services have been connected.
- The `/workspace` business examples are fictional/browser-local. Demo history mixes seeded examples with practice actions. Do not describe them as real leads, published reviews or bookings.
- On the full backend, users’ sign-ins and workspace interactions are real account activity, private to each account. They are not business outcome metrics. Preserve server-controlled identity/time, scoped reads, consent, session revocation and deletion.
- `/ops` is a separate password-protected audit queue. It does not currently manage all user accounts, passwords, organizations, subscriptions or all users’ heatmaps.
- Never enable audit/account writes to an ephemeral SQLite filesystem on Vercel or show a success message before confirmed persistence. A managed database adaptation needs an explicit architecture decision.
- External providers and email ownership/password recovery are not implemented at this baseline. Check fresh evidence before asserting otherwise.

## Work and verify proportionally

From the repository root, the application lives in `app`; use Node 24+.

```bash
cd app
npm ci --no-audit --no-fund
npm run check
npm test
npm run build
```

Run only the checks relevant to the change. API/account changes require meaningful storage/authentication/ownership tests. For changed UI, inspect real desktop and mobile renders and check keyboard/reduced-motion states. Historical counts (33 API/data tests and 11 V2.2 browser scenarios) are evidence of that release, not a reason to invent a current test result.

`app/tests/browser-v22.py` and the walkthrough recorder create test accounts and activity. Run them only against an isolated test database, never a live customer database. Its default test server is port 4244. Configure `LL_V22_TEST_URL` if needed. The real server needs persistent `DATABASE_PATH`, HTTPS `PUBLIC_ORIGIN`, optional `OPS_PASSWORD` and explicit `ENABLE_USER_ACCOUNTS=true` when real accounts are in scope. Never copy test passwords into production or bundle database/environment files.

## Deliver and deploy within the current authorization

- For files, inspect saved PDF pages, count slides/pages, verify media metadata/decoding where relevant and test ZIP integrity. Include honest source and availability notes.
- For an authorized deployment, inspect the currently linked Vercel project before changing it. The existing project is `brisk-nebula-tclk3yf`; the public V2.2 alias is `local-lanchers-v22.vercel.app`. Do not create a new project or overwrite the original V1 domain casually.
- Use authenticated Vercel tools/CLI without exposing credentials. Check signed-out access to the production URL and correct content types for download links. A temporary URL must be labeled temporary, with expiry; it is not a permanent deployment.
- Push or publish only when the current task or continuing session authorizes it. Do not force-push, move old tags or overwrite history to make a report look consistent.
- When updating the V2.2 snapshot intentionally, use `scripts/package-v22.py` and inspect its inclusion list. It can copy files recursively; never put secrets/runtime data into version folders. Archive previous releases instead of silently rewriting their meaning.
- Recheck tools at runtime. Earlier Figma, ElevenLabs and Higgsfield requests did not result in use of those services. The accepted promo used HTML/CSS motion, Kokoro narration and an original score; do not relabel it.
- End with actual changes, working links, verification performed and material limitations. Do not promise a mistake-free app, fabricated integrations or future skill auto-loading.

## Reuse

Keep this file beside its `references/` directory. For a host that supports repository skills, copy this folder to `.agents/skills/local-lanchers-maintenance/` and request “Use local-lanchers-maintenance.” Otherwise attach this file and its references as context. Activation depends on the host; this file does not install tools or grant permissions.
