# Local Lanchers — Version 2.1

**Product and build specification · 22 October 2026**

Status: implemented locally. The original Version 1 logo is preserved without modification. See BUILD-AND-DESIGN.md and verification/ for the final module map, design and executed checks.

## 1. Product decision

Local Lanchers is a managed local-business growth service. Version 2.1 should help an owner understand the offer, see how it fits their business, compare indicative plans, and request a Local Growth Audit. It should help the Local Lanchers team capture consistent information and follow an actionable delivery process.

The plan's progression is retained: productized service → recurring growth operations → managed platform → eventual SaaS. A public website must not present future CRM, AI agents, customer analytics, or integrations as working software before those systems exist.

**Core promise:** Get found. Convert enquiries. Bring customers back. Measure what matters.

**First customers:** owner-led, enquiry- or appointment-driven local businesses in India, approximately 3–30 employees, with no dedicated digital-growth team. The plan recommends one city and one primary vertical first. Hyderabad and dental clinics are recommended initial validation choices, not confirmed operating coverage or customer proof.

## 2. Source register

| Source | Evidence available | Use |
| --- | --- | --- |
| Version 1: locallanchers.vercel.app | Public page, current desktop/mobile screenshots, page text and controls | Preserve exact logo, growth pillars, service structure, industries, process and indicative pricing |
| Version 2: user-uploaded AI Studio project ZIP | Full React/Express source inspected and run locally; desktop/mobile and workspace captures saved | Retain useful warm visual system, navigation, pillars, journey, playbooks and workspace patterns; correct simulated integrations and persistence |
| Uploaded business plan, Version 1.0 | All 42 sections reviewed | Scope, positioning, audit acquisition flow, service-first operating model and phased roadmap |

The shared AI Studio URL required Google sign-in. The user supplied the source ZIP, resolving the access gap. Version 2 was then installed and run locally. Source documentation claims were checked against implementation; they were not treated as user instructions or proof of live integrations.

## 3. Keep, improve, remove, add

| Decision | Item | Reason |
| --- | --- | --- |
| Keep | Exact original logo artwork and brand spelling | Explicit user requirement; continuity across both product and promotion |
| Keep | Four growth pillars | Clear lifecycle framing supported by the business plan |
| Keep | Launch, Growth, Growth Partner | Productized offers rather than a long unstructured menu of services |
| Keep | Audit → Plan → Build → Launch → Measure → Improve | A reusable delivery explanation |
| Improve | First viewport | State the owner benefit and show a clear audit action without requiring several screens of decorative scrolling |
| Improve | Navigation | Predictable desktop navigation, keyboard-operable mobile menu, active section/page state and consistent primary action |
| Improve | Service discovery | Explicit selectable controls; do not depend on hover-only flip cards |
| Improve | Pricing | Distinguish setup and recurring fees, clarify indicative ranges, avoid unsupported popularity labels |
| Improve | Industries | Vertical-specific customer journeys and relevant inclusions, initially prioritizing one validated vertical |
| Remove | Placeholder team identities, credentials and testimonials | They are not evidence of real people, experience or customer results |
| Remove | Empty WhatsApp/social links and dead legal links | They create broken contact paths and reduce trust |
| Remove | Unverified metrics, growth promises and customer logos | No verified outcome data has been supplied |
| Remove | Premature SaaS/AI operating-system positioning | The plan explicitly says to earn this positioning later |
| Add | A focused Local Growth Audit request journey | The acquisition mechanism named in the business plan |
| Add | Clear audit deliverables and next steps | Explain visibility, trust, conversion and retention review without guaranteeing losses or revenue |
| Add | Functional request validation and persistence | A submission must be genuinely captured before a success state is displayed |
| Add | Accessible motion and interaction states | Reduced-motion support, keyboard access, focus states, loading and retry behavior |
| Add | Module documentation and integration readiness register | Make current behavior and future dependencies inspectable |

## 4. Modules

### A. Brand and design system

Use the unaltered original logo file. Define color, type, spacing, border, elevation and motion tokens in one place. Blue and teal remain brand accents. Pair confident typography with human local-business imagery; keep the interface approachable and practical.

Reusable components: header, mobile navigation, buttons, text inputs, selects, checkboxes, tabs, accordions, section headings, plan comparison, industry panels, notices and the audit summary.

### B. Public website and navigation

Pages or clearly addressable sections: Home, Growth System, Industries, Plans, How It Works, Request an Audit, Workspace Demo, Operations Desk, Privacy Notice and Build Notes. Legal content must be real and reviewed before deployment; do not ship empty policy links. Keep the primary conversion action consistent.

Home explains the problem and promise, introduces the growth lifecycle, gives industry context and indicative plans, explains the delivery process, answers genuine FAQs and leads to the audit request. Avoid duplicating every service on every page.

### C. Growth system

| Pillar | Included service themes | Intended business outcome |
| --- | --- | --- |
| Get found | Google Business Profile, local and website SEO, location pages, listings, useful content and review visibility | Relevant local discovery |
| Convert enquiries | Websites, contact forms, WhatsApp entry points, booking connections and qualification | Enquiries and appointments |
| Bring customers back | Follow-up, review requests, rebooking, appropriate offers and referrals | Repeat business |
| Measure growth | A defined funnel and periodic performance review | Understand qualified opportunities and customer outcomes |

Describe these as managed services. Automated WhatsApp messaging, booking sync and live reporting require actual provider connections and client authorization.

### D. Industry playbooks

- Dental clinics: local discovery → enquiry → appointment → consultation → appropriate follow-up.
- Salons and spas: discovery → enquiry → appointment → visit → rebooking.
- Fitness studios: enquiry → trial → membership → renewal.

Keep clinics, coaching, auto services and other categories in the expansion plan until an initial vertical is validated. Do not suggest medical advice, diagnosis or sensitive patient-data processing through a marketing form.

### E. Plans

| Plan | Indicative price from the plan | Scope |
| --- | --- | --- |
| Launch | ₹15,000–₹30,000 one-time setup | Website, domain/hosting setup, profile optimization, WhatsApp entry, lead form, basic local SEO and analytics |
| Growth | ₹5,000–₹12,000/month plus agreed setup | Ongoing visibility, enquiry handling setup, booking connection, reviews, content, follow-up and periodic performance report |
| Growth Partner | ₹12,000–₹25,000+/month; implementation scoped separately | Deeper CRM/automation, segmentation, win-back workflows, optimization, strategy and additional locations as agreed |

Ranges are indicative and supplied by the business plan. They are not validated market prices. Explain that provider usage fees, media spend, taxes and any add-ons require an agreed proposal; do not silently promise they are included.

### F. Local Growth Audit

Show four review areas: visibility, trust, conversion and retention. Promise a prioritized discussion of gaps, not a fabricated instant Google/SEO score.

Recommended flow:

1. Explain what the audit covers and what happens next.
2. Collect business name, category, city, optional website/profile link and the owner's main challenge.
3. Collect name and at least one usable reply channel; disclose how the data will be used.
4. Review details and submit.
5. Show a reference only after server-side persistence succeeds; preserve entered data on recoverable errors.

Marketing consent must be separate from permission to reply to the request. Do not preselect marketing consent. No delivery-time promise is displayed until the owner confirms operational capacity.

### G. Lead intake and operations

A small persisted request queue is sufficient for the service-first phase. Recommended records: request identifier, submission timestamp, business details, selected challenge/plan, contact channel, request status and consent evidence. Avoid storing payment or sensitive health data.

Use server validation, length limits, spam protection, request limits and a clear retention policy. Keep records and credentials outside version control. An operator interface must be authenticated before external deployment. CRM sync and notification delivery are separate integrations, not substitutes for durable storage.

### H. Measurement

The plan's proposed North Star is **Qualified Customer Opportunities Generated**. Define qualification before reporting it. Distinguish enquiries, qualified leads, bookings, attended visits and repeat customers. Do not fill a dashboard with example values that appear to be live.

Future event names: audit_started, audit_step_completed, audit_submitted, plan_selected, contact_clicked. Consent and provider configuration are required before sending analytics externally. Website instrumentation alone cannot establish bookings or revenue attribution.

## 5. Motion and interaction specification

- Use brief, deliberate transitions for navigation, accordions, tabs and form steps.
- Reveal sections once as they enter the viewport; content remains available if JavaScript or animation fails.
- Use the actual selected service/industry to motivate transitions.
- Keep long-form content readable throughout motion; no scroll hijacking, forced cinematic intro or looping text that hides the core offer.
- Respect prefers-reduced-motion. Remove parallax and large transforms for those users.
- Provide hover, keyboard focus, active, selected, disabled, loading, error and success states where relevant.
- Mobile interaction must work by touch, without hover.

Implemented direction: Version 2 warm editorial layouts, the original Version 1 logo, Plus Jakarta Sans headings, DM Sans body text, a dark-green primary action, original generated editorial hero imagery and the supplied sculpture illustrations. See BUILD-AND-DESIGN.md for tokens and screenshots.

## 6. Technical architecture recommendation

A modular web application with a component-based frontend and a thin server-side request API. Existing promo assets remain separate from application code. A supported Node runtime is available in this environment; Node 24 includes SQLite support for a small local request queue.

Suggested organization:

- `app/src/components`: shared interface components.
- `app/src/pages`: page-level composition.
- `app/src/data`: plan, FAQ, industry and service definitions.
- `app/src/styles`: design and motion tokens.
- `app/server`: validation, persistence and request handling.
- `docs/v2.1`: product specification, comparison, architecture, design and readiness documentation.
- `research/v2.1`: captured source evidence.

A local persistent database is suitable for development and a single persistent server. Ephemeral/serverless deployment needs a managed database or another durable backing store. Do not deploy a writable local SQLite file to an ephemeral host and call requests durable.

## 7. Dependencies before production

| Requirement | Why it is needed | Current standing |
| --- | --- | --- |
| Version 2 source | Compare actual useful features and animation | Resolved by the uploaded ZIP; inspected and captured locally |
| Primary city and vertical | Focus sales and delivery | Recommended choices need business validation |
| Public reply address and real WhatsApp number | Real contact and messaging links | Not supplied; no invented number or empty wa.me link |
| Lead storage deployment choice | Durable capture beyond development | Requires hosting decision |
| Email/CRM provider | Operator notifications and follow-up | Not connected |
| Booking provider | Real availability and confirmed appointments | Not connected |
| WhatsApp Business authorization | Automated messages and templates | Not connected |
| Google Business Profile access | Profile management and real performance data | Client-authorized access needed |
| AI provider and knowledge boundaries | Real assistant with escalation | Not connected; no fake chat simulation |
| Privacy, terms and retention details | Accurate disclosures for actual operations | Business review needed before launch |
| Real team and customer evidence | Publish trustworthy social proof | Not supplied; omit placeholders |

## 8. Phased roadmap

**Version 2.1 — acquisition and service delivery foundation:** strong public experience, vertical explanations, indicative plan comparison, functional audit request and documented operations.

**After paid validation:** repeatable onboarding, operational CRM, connected booking and WhatsApp, review workflows and verified monthly reporting.

**After repeatability:** additional verticals/locations, referrals, a Fellows pilot with quality controls, and deeper automation.

**Later platform:** client accounts, permissions, connected analytics and AI actions with appropriate approval. Build from observed client needs rather than a speculative all-in-one dashboard.

## 9. Acceptance criteria

The final build must retain the original logo; provide usable desktop and mobile navigation; make the audit action clear; support keyboard and reduced-motion users; distinguish setup from recurring pricing; remove invented proof and broken contact links; and execute the primary audit journey with honest failure and success states.

Required verification: production build, meaningful server validation/storage checks where implemented, browser verification of the audit journey, responsive screenshots, console-error review and recorded design QA. Report implemented, locally verified, externally connected and future work separately.
