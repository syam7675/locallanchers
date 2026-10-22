# Vercel interactive preview

Deploy from the repository root using `npx vercel`. Create a separate project named `locallanchers-v21` to preserve the original Version 1 site. Use `npx vercel --prod` to publish this preview project at its public production URL. When importing through the Vercel dashboard, leave Root Directory at the repository root; the committed configuration installs and builds `app` and serves `app/dist`.

This deployment is an interactive design preview: navigation, animations, plans, industry pages and the browser-local demo workspace work. `VITE_PUBLIC_DEMO=true` labels the preview and prevents audit submission. The API explicitly rejects writes; it does not use an ephemeral SQLite file or claim that requests have been saved. The operations session endpoint reports that private operations are not configured.

The full Node server continues to support durable SQLite on a host with persistent storage. Enabling real audit collection on Vercel requires a managed database adaptation and production team credentials. Do not remove the preview restrictions until that storage is connected and verified.

Vercel account authentication is required to publish. Never commit a token or local `.vercel` project linkage. The deployment upload excludes existing videos, research, reports, local databases and environment files.
