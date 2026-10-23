# Local Lanchers 2.2 — frontend and journey brief

## Purpose and current availability

Local Lanchers helps local business owners get discovered, convert enquiries, retain customers and review growth. The website’s customer is the business owner; it is not currently a booking portal for that business’s customers.

The public Vercel site is a design/demo preview. Navigation, plans, industry examples, the scenario calculator and the demo workspace work now. Audit submissions, real account sign-in and the private operations desk require the full backend with persistent storage. No Google, WhatsApp, booking, payment, email or AI provider is connected.

## How the frontend works and where to go

The shared header and footer surround every page. Desktop dropdowns and a mobile menu lead to the same routes. React renders the selected page without changing the site structure. Forms validate input before calling the API; success is shown only after a successful server response. The workspace’s example business records stay in the browser. When enabled, real account activity is stored separately on the server.

| Navigation | Destination | What it does |
| --- | --- | --- |
| Logo / Home | `/` | Explains the growth offer and starts the audit journey. |
| Solutions | `/growth` | Explore discovery, conversion, retention and measurement. |
| Industries | `/industries` | Choose dental, salon or fitness examples. |
| How it works | `/how-it-works` | Understand delivery stages and first-month expectations. |
| Plans | `/plans` | Compare indicative options; explore the scenario calculator. |
| Explore the demo | `/workspace` | Try the example workflows and activity calendar. |
| Get a growth audit | `/audit` | Business details → contact/permission → review. Submission is disabled on the public preview. |
| Footer links | `/privacy`, `/build-notes`, `/ops` | Privacy notice, readiness information and private team operations. |

## Customer journey: business owner

1. **Understand the offer.** Start at Home → Solutions. Identify whether the priority is discovery, enquiries, repeat business or measurement.
2. **Find your fit.** Choose your industry, inspect How it works, and compare Plans. Pricing and calculator outputs are indicative; there is no online checkout.
3. **Request an audit when enabled.** Enter business details, provide contact information and permission to reply, then review and submit. A saved reference confirms receipt, not a booked appointment.
4. **Agree the work with the team.** The team contacts you manually, reviews opportunities and agrees scope, access, delivery and commercial terms. These conversations and agreements are outside the current app.
5. **Explore the workspace.** Try enquiry states, review drafts, visibility preparation and onboarding. These remain practice workflows, even after account sign-in; no message, review reply or booking is sent to a provider.

## Login and activity

In Growth overview, **Demo profiles** needs no login. Select “Act as”, perform practice actions, then return to the heatmap. Filter by profile and 30/90/365 days; select a square for its events.

For a full-backend account, open **My real activity → Create an account**, enter name/email and a password of at least 12 characters, and agree to activity recording. Existing users choose Sign in. Successful logins and workspace interactions appear in your private history. Sign out, clear history and delete account are available. Email verification and password recovery are not implemented.

Daily bands are Quiet 0, Light 1–2, Steady 3–5, Active 6–9 and Busy 10+ actions. Dates use India time. These counts show feature use; they do not prove appointments, revenue, staff productivity or customer retention.

## Admin journey: operations team

1. **Enable the backend.** The hosting operator provides persistent storage, HTTPS and `PUBLIC_ORIGIN`, configures a strong `OPS_PASSWORD`, and optionally enables individual accounts with `ENABLE_USER_ACCOUNTS=true`. Test request persistence and sign-in before inviting customers.
2. **Open `/ops`.** Sign in with the configured operations password. This is separate from customer email/password sign-in and is not a full role-based admin console.
3. **Review incoming requests.** Search/filter the queue, open a request, inspect its business details and contact permission, and move it from New to Reviewing. Save notes explicitly.
4. **Contact and follow through.** Use the permitted contact channel outside the app. Mark Contacted after outreach, document the agreed next step and use Completed when the audit request has been handled. A status change does not send a message or prove growth results.
5. **Maintain the queue.** Save updates and export the filtered request list as CSV when needed. The current desk does not manage customer passwords, organization roles, subscriptions or all users’ heatmaps.

## Steps to reach the project goal

First enable durable lead intake and account access. Next validate the human audit-to-proposal-to-onboarding process with a small pilot. Then connect the providers needed for actual delivery and reporting. Measure qualified enquiries, confirmed/attended bookings, repeat visits and revenue using authorized source data. Until those connections exist, use the heatmap for product activity and the operations queue for audit follow-through only.

Prepared from the implemented V2.2 source and deployment notes. Higgsfield tools were unavailable in this session; the companion presentation was generated locally, not through Higgsfield.
