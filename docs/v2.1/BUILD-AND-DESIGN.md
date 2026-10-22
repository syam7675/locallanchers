# Local Lanchers — Version 2.1

**Build, design and modular product document**

22 October 2026 · Implemented and verified locally · Original Version 1 logo retained

## 1. What was built

Version 2.1 combines the clearest parts of the original Local Lanchers website, the uploaded Version 2 project and the full business plan into a coherent application.

It has three distinct surfaces:

1. **Public growth website:** explains the offer, helps an owner explore relevant services and plans, and leads to a Local Growth Audit request.
2. **Real audit-request and operations flow:** validates and saves requests, returns a reference only after storage, and lets an authenticated team review and update the queue.
3. **Interactive workspace demonstration:** lets visitors explore enquiries, review templates, visibility requirements and onboarding using fictional, browser-local records.

The positioning remains **a managed digital growth partner for local businesses**. The build does not pretend that future SaaS capabilities or external integrations are already operating.

The existing promotional video remains separate and unchanged. The existing Vercel website has not been overwritten or redeployed.

## 2. Sources and decisions

Version 1 was inspected at locallanchers.vercel.app, including desktop, mobile, services, plans and contact screens. Its original logo file is copied without alteration.

The shared Version 2 URL required Google sign-in. The user supplied the full AI Studio project ZIP, which resolved the access gap. Its React/Express source, components, utilities and documentation were inspected, installed and run locally. Source screenshots were captured from the running project. Statements embedded in the archive were treated as project content, not new user instructions or proof of real-world results.

The business plan was used to keep the release focused: service first, recurring delivery next, and a broader software platform after customer validation.

### Retained from Version 1

- Exact original logo and brand spelling.
- The four growth pillars and lifecycle framing.
- Launch, Growth and Growth Partner package structure and indicative ranges.
- Dental, salon and fitness as the initial industry playbooks.
- The Audit → Plan → Build → Launch → Measure → Improve process.

### Retained and improved from Version 2

- Warm editorial styling, rounded hero framing and considered typography.
- Animated desktop menus, selectable pillars and industry panels.
- An eight-stage customer journey with contextual explanations.
- A process/onboarding timeline switcher.
- An interactive scenario calculator.
- The useful workspace patterns: overview, enquiries, review drafting, visibility setup and onboarding.
- Supplied bird sculptures as illustration assets, without presenting them as connected AI employees.

### Removed or corrected

- Invented customer stories, partner-logo proof, team identities and numerical outcome claims.
- Generated “audit scans” that inferred visibility and revenue loss without examining real sources.
- Form success messages that appeared even after request failure.
- A lead endpoint that acknowledged requests without storing them.
- Unauthenticated access to a supposed real operations console.
- Controls that implied they had sent WhatsApp messages, published reviews or updated Google when only local state changed.
- Guaranteed ranking, response-speed and growth claims not supported by evidence.
- A prominent in-product “160 QA” badge; source unit-test counts do not establish working integrations.
- Premature public emphasis on Fellows, nationwide rollout, a full SaaS operating system and client revenue attribution.

## 3. Application map

| Route | Module | What the visitor can do |
| --- | --- | --- |
| `/` | Public homepage | Understand the promise, explore the growth lifecycle and begin an audit request |
| `/growth` | Growth system | Switch between four pillars and inspect the eight-stage customer journey |
| `/industries` | Industry playbooks | Explore dental, salon and fitness customer journeys |
| `/plans` | Plans and scenarios | Compare indicative packages and change assumptions in a scenario calculator |
| `/how-it-works` | Delivery and onboarding | Switch between the growth cycle and illustrative first-month timeline |
| `/audit` | Real request flow | Enter business details, add contact permission, review and save a request |
| `/workspace` | Local demonstration | Explore and change fictional records without contacting anyone |
| `/ops` | Private team desk | Sign in, review real saved requests, update status and notes, and export CSV |
| `/privacy` | Request privacy notice | Understand this development build's collection and use of request information |
| `/build-notes` | Build and readiness | See implemented modules and connections still needed |

Desktop navigation groups Solutions and Industries into click-operated menus. Escape closes an open menu and restores focus. Mobile navigation is an expandable menu with direct links. Routes have real URLs and support refresh and browser navigation.

Pillar and industry links select the matching content through URL parameters. Plan selections carry through to the audit request. The workspace's section is reflected in the URL.

## 4. Modules explained

### Module A — Brand and shared interface

The actual Version 1 logo is used in the header and footer. It is not recreated with text, vectors or a substitute emblem.

Shared components own the header, mobile navigation, dropdowns, logo, call-to-action links, buttons, section headings, lists and reveal animations. This keeps primary actions and interaction states consistent across pages.

The warm hero is original generated editorial artwork illustrating a local business interaction. It does not represent a named customer or endorsement. A compressed WebP is served to the browser; the source image is retained for editing. Fonts are bundled locally with licenses.

### Module B — The public growth website

The first screen states the owner benefit and exposes an audit action immediately. The content moves through discovery, conversion, retention and measurement without overwhelming the owner with a feature inventory.

The four pillars have explicit controls and keyboard navigation, replacing dependence on hover. The eight-stage journey shows a typical gap and a possible improvement for each step. It is labeled as illustrative, not as a diagnosis of the visitor's business.

The industry section changes its customer journey, priorities and request context for dental clinics, salons/spas and fitness studios. Other industries remain discussable through intake, without claiming broad validated delivery coverage.

### Module C — Plans and scenario calculator

| Plan | Indicative range | Cost clarification |
| --- | --- | --- |
| Launch | INR 15,000–30,000 | One-time setup; ongoing maintenance is separate if scoped |
| Growth | INR 5,000–12,000/month | Agreed implementation/setup is additional |
| Growth Partner | INR 12,000–25,000+/month | Implementation and additional requirements are scoped separately |

The ranges come from the supplied business plan. They are not fixed quotes or validated market prices. Proposal scope must confirm taxes, usage fees, media spend and add-ons.

The calculator uses only visitor-entered assumptions: monthly enquiries, current booking rate, scenario booking rate and average booking value. It displays the arithmetic change in bookings and gross booking value before costs. It is not an audit result, model forecast, observed customer outcome or promise of growth.

Formula: enquiries × (scenario rate − current rate) × average booking value.

### Module D — Real Local Growth Audit request

The flow has three steps:

1. **Business:** business name, industry, city, optional website, main challenge and plan of interest.
2. **Contact and permission:** name and at least one reply channel; required permission to reply about the request; separate, unselected optional marketing consent.
3. **Review and save:** the owner checks the details and submits to the server.

Client and server share the same core validation rules. Input lengths are bounded. Email, phone and website formats are checked. Sensitive customer or patient information is explicitly discouraged.

On successful database storage, the server returns a UUID-based request reference and status New. It does not return the full personal details to anonymous callers and does not claim to have scheduled a meeting.

If a connection fails, the details remain visible and the interface does not show a success message. An idempotency key protects unchanged retries from creating duplicate records. A changed request cannot reuse an old key to receive a misleading confirmation.

### Module E — Private operations desk

Real requests are stored separately from the fictional workspace. The team desk is enabled only after a sufficiently strong operations password is configured on the server.

An authenticated team member can:

- Read saved audit requests and their permissions.
- Search by business, name, city or reference.
- Filter by New, Reviewing, Contacted or Completed.
- Update status and internal notes.
- Reload and see the persisted changes.
- Export the authorized request list as CSV; spreadsheet-formula prefixes are escaped.
- Sign out and revoke the current session.

Sessions use random tokens, store token hashes in SQLite and expire after eight hours. Cookies are HTTP-only and same-site strict; production cookies are Secure and require HTTPS. Expired or absent sessions cannot read private requests. The desk fails closed when its password is unconfigured.

This is a small single-team operations desk, not a multi-tenant client-account or enterprise identity platform. Production-scale identity, roles, audit-log tooling and distributed infrastructure are future adaptations.

### Module F — Workspace demonstration

The demonstration is clearly labeled at the top and throughout its records. It does not claim that its examples are real customers or live provider data.

| Section | Functional behavior | Boundary |
| --- | --- | --- |
| Growth overview | Counts fictional enquiries and their statuses | No invented search, attendance, repeat-visit or revenue data |
| Enquiry desk | Search/filter examples; add a fictional enquiry; mark it qualified or booked | No customer message or appointment is created |
| Review drafts | Create a rule-based template, edit, copy and save it locally | Not an AI provider response; nothing is published |
| Visibility setup | Read the profile and connection requirements | No Google scan, ranking score or account sync |
| Onboarding | Check example tasks and see progress | No real client account is updated |

Demo state is stored in the browser when storage is available. Reset restores the original examples. If storage is unavailable, a message explains that changes will last only for the current session.

### Module G — Readiness and privacy

The build notes page distinguishes current behavior from unconnected providers. The privacy notice accurately describes this development build's request storage, reply permission, optional marketing choice, local demo storage and team cookie.

The business owner must confirm a public contact address, retention period and final operating/privacy policy before public launch. No unsupported compliance certification is claimed.

## 5. Complete visual system

### Foundations

| Token or element | Implemented choice |
| --- | --- |
| Primary text | Deep charcoal, `#262A26` |
| Primary action | Dark green, `#153F36` |
| Teal accent | `#11745E`, adjusted for readable contrast |
| Muted copy | `#5C6359` |
| Paper | `#F8F7F3` |
| Sand surface | `#EEEDE6` |
| Divider | `#DEDFD6` |
| Display font | Plus Jakarta Sans, bundled locally |
| Body font | DM Sans, bundled locally |
| Icons | Lucide, matching the supplied project's library |
| Content width | Maximum 1,328 pixels; responsive outer margins |
| Controls | Clear labels, visible focus rings and deliberate interaction states |

The original logo's blue/teal artwork stays unchanged. The surrounding dark-green and warm-neutral UI is an intentional evolution of Version 2, not a replacement logo or a claim of pixel-exact cloning.

### Composition

The homepage uses a generous rounded hero with natural editorial imagery, a legible headline and a visible audit action. Service pages use clear section rhythm, limited surface changes and readable grouped lists. Dense workflows use the workspace's darker side navigation and lighter content area.

On mobile, the navigation collapses, grids stack, plans become vertically comparable, forms use readable input sizes and the workspace's section navigation scrolls inside its own constrained area. The document itself remains within a 390-pixel viewport in the verified mobile states.

### Motion and states

- Small dropdown entrance and exit transitions.
- Once-only section reveals, using controlled opacity and vertical movement.
- Short content transitions when selecting a pillar or workspace section.
- A restrained initial hero-image movement.
- Hover, focus, selected, expanded, disabled, loading, error, success and empty states where relevant.
- Reduced-motion support through Motion configuration and CSS preferences.

There is no scroll hijacking or forced cinematic intro. Content remains available when reduced motion is requested. The hero image and the supplied sculpture assets support the narrative rather than being presented as functioning agents.

## 6. Code and data architecture

| Layer | Key source | Responsibility |
| --- | --- | --- |
| Public layout | `app/src/components/Layout.tsx` | Navigation, menus, footer and shared routes |
| Shared UI | `app/src/components/ui.tsx` | Logo, actions, headings and motion wrapper |
| Growth sections | `app/src/components/GrowthSections.tsx` | Pillars, journey, plans, industries, timeline, FAQ and calculator |
| Editable content | `app/src/data/content.ts` | Service and business copy |
| Public pages | `app/src/pages/Marketing.tsx` | Page composition |
| Request flow | `app/src/pages/Audit.tsx` | Input, review, network handling and saved state |
| Demo workspace | `app/src/pages/Workspace.tsx` | Fictional local state and controls |
| Private team UI | `app/src/pages/Operations.tsx` | Authenticated request queue and follow-up |
| Information pages | `app/src/pages/Info.tsx` | Readiness and privacy |
| Design system | `app/src/styles/global.css` | Tokens, layouts, responsive behavior and motion preferences |
| Shared validation | `app/shared/audit.ts` | Pure rules used by browser and server |
| API | `app/server/api.ts` | Request intake, sessions and private operations |
| Persistence | `app/server/store.ts` | SQLite schema and stored records |
| Application host | `app/server/index.ts` | Express, Vite development middleware and production assets |

React and TypeScript provide the interface. Express hosts the API and frontend. Node 24's SQLite implementation supplies local durable storage. No separate database service or external API key is needed to demonstrate the implemented request workflow.

The database contains audit requests, request events and hashed team sessions. Database files, local environment values, installed dependencies and build outputs are excluded from Git. Real request details are not mixed into the fictional browser demo.

## 7. API contract

| Endpoint | Access | Outcome |
| --- | --- | --- |
| `GET /api/health` | Public | Version, storage type and connection/configuration flags |
| `POST /api/audits` | Public, validated and rate-limited | Persists a request and returns its reference |
| `GET /api/ops/session` | Current session | Authentication and configuration state |
| `POST /api/ops/login` | Password, rate-limited | Creates an expiring team session |
| `POST /api/ops/logout` | Current session | Revokes the session |
| `GET /api/ops/requests` | Authenticated team | Reads the private queue |
| `PATCH /api/ops/requests/:id` | Authenticated team | Persists a valid status and bounded notes |

Public audit submission requires a valid Idempotency-Key header. Request-body limits, length validation, a honeypot, rate limits and write-origin checks are implemented. Unknown or invalid API operations return controlled failures rather than exposing stack traces or pretending to succeed.

Rate limits are in memory on one application instance. They are not a distributed abuse-prevention service. A larger deployment should add suitable perimeter protection, monitoring and shared limits.

## 8. Verification completed

- **25 server/API checks passed:** validation, persistence after database reopen, minimal public confirmation, retry protection, changed-payload protection, private access, session cookies, wrong passwords, expiration, logout, updates, origin checks, malformed requests, request limits and storage failure.
- **20 browser checks passed:** production routes, menus and focus, tab keyboard controls, industry selection, onboarding switcher, plan context, invalid input, reply permission, failed submission and retry, saved reference, real team review, persisted notes, CSV export, demo state, mobile navigation, mobile width and reduced-motion behavior.
- **Eight representative desktop routes checked with axe-core:** no automated WCAG A/AA violations remained in the checked states.
- **TypeScript and production build passed.**

The request/operations browser journey used a separate throwaway test database. Example identities use clearly fictional test values. The public production-mode app was checked separately. The intentional network-failure test produces an expected request error; unexpected browser runtime and console errors were absent in the final run.

### Issues found and fixed

1. Mobile workspace content initially expanded to its navigation's minimum width. The sidebar and grid were constrained; the final content width is 390 pixels.
2. Several low-emphasis labels missed contrast thresholds. Foreground tokens and captions were darkened; the automated recheck passed.
3. The review star label lacked an appropriate semantic role. It now uses an image role with its accessible rating label.
4. A request update could clear its saved confirmation during a state refresh. The state-reset effect was corrected, and reload persistence and confirmation were tested again.
5. Development HMR initially tried to use a separate websocket port. It now uses the Express HTTP server's supported websocket configuration.

These checks do not prove full accessibility compliance, real provider connectivity, load capacity or a completed production security review.

## 9. Running and configuring the build

Requirements: Node.js 24+, npm and a persistent filesystem for SQLite.

From the repository, enter `app`, run `npm ci`, then `npm run dev`. For the production-mode build, run `npm run build` and `npm start`.

Configuration is documented in `app/.env.example`:

- PORT: defaults to 4173.
- DATABASE_PATH: defaults to the application's ignored data directory.
- OPS_PASSWORD: configure a strong unique password, at least 12 characters, to enable the private team desk.
- PUBLIC_ORIGIN: exact public HTTPS origin for deployed write-origin validation.
- NODE_ENV: production mode serves built assets and uses Secure cookies.

Never use the test fixture's password in a live environment. Enter real secrets through the hosting environment or an ignored local environment file, not source control or chat.

The application's server is required; a static-only preview cannot save audit requests. An ephemeral/serverless filesystem must not be used as the production request database without a managed-database adaptation. The existing Vercel site was not changed by this build.

## 10. What is still needed for public launch

| Requirement | Reason | Current state |
| --- | --- | --- |
| Hosting with durable storage or a managed database | Preserve real requests across restarts and releases | Local SQLite is implemented; hosting is not deployed |
| Strong team access configuration | Enable private review without exposing requests | Desk works when configured; no real production password is invented |
| Confirmed public contact and privacy/retention policy | Give owners accurate operational information and rights routes | Development notice included; business details need confirmation |
| Email or CRM notifications | Notify the team automatically about new requests | Not connected; requests remain in the protected queue |
| Google Business Profile authorization | Read or update a real business profile | Not connected |
| WhatsApp Business authorization and templates | Send approved real messages and handle enquiries | Not connected |
| Calendar/booking provider | Offer real availability and confirm appointments | Not connected |
| AI provider, knowledge base and escalation rules | Generate or act on actual business information | Not connected; demo templates are explicitly rule-based |
| Verified team/customer proof | Publish trustworthy biographies and results | Omitted until evidence is supplied |
| Monitoring, backup and operational ownership | Run the service responsibly after launch | Deployment work remaining |

## 11. Recommended product roadmap

**Now — Version 2.1:** use the public experience and audit flow to learn from a focused group of local businesses. Confirm one primary vertical, one initial city, a scoped offer and a qualification definition.

**After paid validation:** connect the provider systems needed by actual clients, introduce repeatable onboarding and genuine monthly reporting, and measure delivery cost and customer outcomes.

**After repeatability:** consider referrals, another vertical/location and a small Fellows pilot with clear quality controls.

**Later:** introduce a real multi-tenant client platform, permissions, connected analytics and carefully governed AI actions. The workspace demonstration is a design foundation for that discussion, not a claim that the future platform is already connected.

## 12. Handoff contents

The handoff includes the modular application source, dependency lockfile, tests, environment example, actual design screenshots, this build document, source review and design QA. The downloadable project excludes local databases, credentials and installed dependencies.

The original logo is preserved. The useful interactions are implemented. Simulation and real storage are separated. Public deployment and provider authorization are distinct next steps.
