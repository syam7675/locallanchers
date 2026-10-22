# Version 2.1 source review

Captured 22 October 2026. The following findings use screenshots captured during this review, not the promotional video frames.

## 1. Desktop entry — needs improvement

Evidence: `research/v2.1/version1-hero.png`.

The original logo is clearly visible and the blue/teal identity is recognizable. At 1440 × 1000 the first viewport is dominated by the human/robot artwork. No audit or enquiry action is visible in this captured initial state. The redesign should present the value proposition and primary audit action immediately, while giving artwork a supporting role.

## 2. Services — useful structure

Evidence: `research/v2.1/02-services.png`.

The site already groups services into visibility, conversion, retention and growth operations. That structure is worth retaining. The separate growth-pillar cards advertise hover interaction; their details also need an explicit click/touch and keyboard route. The screenshot alone cannot establish keyboard behavior or screen-reader semantics.

## 3. Plans — useful but needs qualification

Evidence: `research/v2.1/03-pricing.png`.

Launch is marked as setup; Growth mentions an additional setup charge. The three ranges match the supplied business plan and can be retained as indicative. The “Most Popular” badge is not supported by supplied customer evidence, so omit it. Version 2.1 should explain setup versus recurring cost and identify what is scoped in the proposal.

## 4. Contact — accessible labels are visible; delivery unverified

Evidence: `research/v2.1/04-contact.png`.

Labels are visibly adjacent to the inputs, and corresponding DOM label/ID structure can be examined in implementation. The native required flags were false for all eight captured fields. Custom validation and actual message delivery were not tested by submitting to the live business site. The Version 2.1 form needs a short, clear flow, tested validation and success feedback that follows confirmed storage.

## 5. Mobile entry — fits the viewport

Evidence: `research/v2.1/05-mobile.png`.

At 390 × 844 the headline and supporting copy fit without observed horizontal overflow; document width measured 390 pixels. A compact navigation control is visible. The captured viewport has no audit action. The redesign should surface the primary action sooner and verify touch targets, keyboard menu behavior and reduced-motion support in the actual build.

## 6. Version 2 — source access resolved

Evidence: `research/v2.1/version2.png`.

The shared app URL originally redirected to Google Accounts. The user then uploaded the complete source ZIP, resolving access. The project was inspected and run locally. Evidence now includes `version2-local-home.png`, `version2-local-workspace.png`, `version2-local-admin.png` and `version2-local-mobile.png` in the research folder.

Useful features verified in source and rendered UI: animated navigation, four-pillar selection, eight-stage journey, vertical-specific panels, process/onboarding switcher, plan and ROI interactions, and multi-tab workspace patterns.

Source limitations: the audit uses a deterministic local calculation rather than an external scan; lead capture returns a success response without storage; some front-end handlers confirm success even after network failure; dashboard records and provider actions are seeded simulations. The source's documentation describes client quotes and outcomes as verified, but no supporting evidence is included. Its test count does not establish provider connectivity or durable request delivery.

Version 2.1 retains the interaction patterns while adding real persistence, private operations access, explicit local-demo labels and honest connection states. The original logo replaces Version 2's recreated lockup. Fake testimonials and metric claims are removed.

## Additional content findings

The current page text explicitly marks team profiles and customer stories as placeholders. Those identities, experience claims and stories must not appear as verified proof. Footer targets include an empty WhatsApp destination, generic social-network links and `#` legal links; do not preserve those as working contact/legal routes.

## Limits

This is a focused source review of the public website and its acquisition path. No form was submitted to the production Version 1 business site. The Version 2.1 local request flow, authenticated operations and browser interactions were exercised separately in an isolated test database. External provider connectivity and complete accessibility compliance are not claimed. Final test evidence is in docs/v2.1/verification/.
