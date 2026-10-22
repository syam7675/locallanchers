# Version 2.1 design QA

## Scope and visual truth

This is a reference-informed extension of the user-supplied Version 2 application, with the explicit requirement to use Version 1's exact logo. It is not a pixel-exact clone. Intentional content, imagery, access and honesty improvements are classified below.

- Source visual truth: `research/v2.1/version2-local-home.png`, `version2-local-workspace.png`, `version2-local-mobile.png` and the actual Version 1 logo at `promo/assets/brand-logo.png`.
- Implementation evidence: `docs/v2.1/verification/01-home-desktop.png`, `10-home-mobile.png`, `mobile-workspace-enquiries.png`, `08-operations-desk.png` and the other numbered captures.
- Source and implementation desktop viewport: 1440 × 1000 CSS pixels, deviceScaleFactor 1, 1440 × 1000 pixel screenshots.
- Mobile: 390 × 844 CSS pixels and screenshots, deviceScaleFactor 1. No density rescaling or device bezel.
- State: public homepage at initial stable state; workspace state is classified as an intentional simplified demonstration. The operator capture uses only an isolated test database.

## Combined comparison evidence

- `docs/v2.1/verification/comparison-home-desktop.jpg`: source and implementation together at the same scale.
- `docs/v2.1/verification/comparison-navigation.jpg`: readable focused comparison of navigation, logo and primary action.
- `docs/v2.1/verification/comparison-workspace-desktop.jpg`: source workspace and new labeled demo together. The source's provider actions and metrics are intentionally not reproduced as real outputs.
- `docs/v2.1/verification/comparison-mobile-workspace.jpg`: initial implementation overflow and corrected final mobile state, together at 390 pixels each.

## Required fidelity surfaces

### Fonts and typography

Plus Jakarta Sans display and DM Sans body preserve the supplied direction and are bundled locally. Headings, supporting text and controls have distinct weights, readable line heights and restrained tracking. The headline intentionally wraps across three desktop lines to preserve a useful photographic field. Mobile wrapping and form input sizes were inspected. The original logo is an unmodified image, not substituted text.

### Spacing and layout rhythm

The source's warm rounded hero, quiet pill navigation, generous sections and darker workspace rail remain recognizable. Header density is intentionally reduced. The audit action is visible in the first viewport. Desktop grids stack on mobile; the private queue becomes a sequential list and detail panel. The workspace overflow defect was fixed and rechecked on every tested mobile route.

### Colors and tokens

Warm paper, sand, charcoal and green retain the source's approachable direction. Dark green and teal are intentional brand-aligned UI changes; the blue/teal source logo stays unchanged. Muted foregrounds and caption colors were darkened after measured contrast failures. The final automated A/AA check reported no violations on the eight checked routes.

### Image quality and asset fidelity

The original logo matches the source artwork byte-for-byte. The new generated editorial hero is an intentional replacement for the source's schematic reception drawing and is explicitly illustrative. It was inspected, cropped responsively and compressed to a 97,950-byte WebP. The original supplied Version 2 bird sculpture assets are reused; no substitute brand logo was created. Lucide icons match the supplied library. Screenshots and important focused regions were opened and inspected.

### Product copy and states

The first-screen promise and four growth pillars are retained. Unsupported rankings, numerical results, customer endorsements and fake successful provider actions are removed. Audit request success follows actual persistence. The workspace is visibly labeled fictional. Loading, failure, retry, empty, selected, expanded, focus and saved states were tested where relevant.

## Comparison history and fixes

1. **[P2] Mobile workspace expands beyond the viewport.** Earlier evidence: `qa-before-mobile-workspace.png`, document width approximately 666 pixels. Fix: constrain sidebar minimum width and the mobile grid. Post-fix evidence: `mobile-workspace-enquiries.png` and `comparison-mobile-workspace.jpg`; browser checks confirm 390-pixel width on all tested mobile routes.
2. **[P2] Low-emphasis text misses contrast thresholds.** Earlier evidence: `qa-before-accessibility.json`, including sculpture captions, muted text, connection labels and example labels. Fix: darken tokens and scoped label colors. Post-fix evidence: `accessibility-checks.json` reports zero violations across the eight checked routes.
3. **[P2] Review rating has an invalid aria-label on a generic element.** Fix: add an image role to the rating group. Post-fix: reviews route passes the automated semantic check.
4. **[P2] Saved confirmation is cleared during an operations update.** Fix: reset detail-editing state when the selected request changes, not on every updated timestamp. Post-fix evidence: final browser run checks the visible confirmation and persisted notes after reload; `08-operations-desk.png` records the tested private view.

No actionable P0/P1/P2 design findings remain in the verified scope. Source changes described above are intentional product decisions, not unreviewed drift.

## Interaction and runtime evidence

`browser-checks.json` records 20 passed checks: production route rendering, desktop and mobile navigation, Escape focus restoration, keyboard tabs, contextual selections, audit validation, permissions, intentional failure/retry, saved reference, authenticated operations, CSV export, reload persistence, local demo controls, mobile width and reduced motion.

The final run reports no unexpected page or console errors. The deliberately aborted audit request is recorded separately as an expected fault injection.

## Open questions and limits

No public deployment, external provider account, real customer result, load test or full accessibility certification is claimed. Business contact, retention policy and hosting/provider configuration remain launch requirements. The checked private workflow uses test-only records, never an invented real client portfolio.

## Follow-up polish

P3: after real customer validation, test copy comprehension with business owners and evaluate a tailored mobile audit introduction. Add new vertical imagery and real customer evidence only when accurate assets and permissions are available.

## Implementation checklist

- Original logo retained.
- Useful source interaction patterns preserved and made explicit.
- Desktop/mobile screenshots and focused comparisons inspected.
- P2 findings corrected and recaptured.
- Core request, operations and demo journeys exercised.
- Verification and production limitations documented.

final result: passed
