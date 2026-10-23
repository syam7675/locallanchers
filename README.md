# Local Lanchers — Version 2.2

A modular local-business growth application built from Version 1, the uploaded Version 2 project and the supplied business plan. The original Version 1 logo is preserved.

See the [Version 2.2 release notes](docs/v2.2/README.md) for the sculptural design, activity heatmap, account flows and deployment boundaries.

## Application

```bash
cd app
npm ci
npm run dev
```

Requires Node.js 24+. The application includes the public website, a real persisted audit-request flow, a protected operations desk and a clearly labeled browser-local workspace demo.

- [Run and configure the application](app/README.md)
- [Version 2.1 build and complete design document](docs/v2.1/BUILD-AND-DESIGN.md)
- [Original-to-final feature decisions](docs/v2.1/SOURCE-REVIEW.md)
- [Design QA](app/design-qa.md)
- [Verification evidence](docs/v2.1/verification)

The Vercel design preview is deployed separately from the original Version 1 website. Real individual accounts and audit persistence require the full backend on persistent storage. Google, WhatsApp, booking, AI and outbound email integrations are not connected.

## Promotional video

The separately completed video project remains in [promo](promo/README.md), including the [finished narrated video](promo/final_promo.mp4), editable motion source and production instructions.
