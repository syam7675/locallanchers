export const pillars = [
  {
    id: "found",
    name: "Get found",
    eyebrow: "01 / DISCOVERY",
    bird: "Jay" as const,
    headline: "Be the business they find. And remember.",
    description:
      "Bring your Google profile, website and local presence together so the right people can discover what you do.",
    services: [
      "Google Business Profile",
      "Local & website SEO",
      "Location pages & business listings",
      "Useful content & review visibility",
    ],
    icon: "search",
  },
  {
    id: "converted",
    name: "Get converted",
    eyebrow: "02 / CONVERSION",
    bird: "Myna" as const,
    headline: "Make the next step feel effortless.",
    description:
      "Connect a clear website, useful answers and simple enquiry or booking paths. Give interested customers a straightforward way to reach you.",
    services: [
      "Conversion-focused websites",
      "WhatsApp enquiry entry points",
      "Lead capture & qualification",
      "Booking integration planning",
    ],
    icon: "message",
  },
  {
    id: "retention",
    name: "Bring customers back",
    eyebrow: "03 / RETENTION",
    bird: "Robin" as const,
    headline: "The first visit is just the beginning.",
    description:
      "Build thoughtful follow-up into the customer journey, from asking for feedback to making the next visit easier.",
    services: [
      "Follow-up & rebooking workflows",
      "Review request planning",
      "Customer segments & appropriate offers",
      "Referral & win-back campaigns",
    ],
    icon: "repeat",
  },
  {
    id: "measure",
    name: "Measure growth",
    eyebrow: "04 / MEASUREMENT",
    bird: "Jay" as const,
    headline: "See the journey. Improve the right things.",
    description:
      "Agree on what a qualified opportunity means for your business, then review enquiries, bookings and repeat business together.",
    services: [
      "A clear opportunity definition",
      "Enquiry-to-booking reporting",
      "Baseline & monthly review",
      "Prioritized improvements",
    ],
    icon: "chart",
  },
];
export const journey = [
  {
    name: "Search",
    gap: "Your business is difficult to discover in relevant local searches.",
    action:
      "Review local keywords, useful content and the pages customers land on.",
  },
  {
    name: "Google",
    gap: "Incomplete hours, photos or profile information make a business harder to evaluate.",
    action: "Keep profile information consistent, current and useful.",
  },
  {
    name: "Website",
    gap: "Visitors cannot easily understand your offer or find the next step.",
    action:
      "Give each service clear information and an obvious way to enquire.",
  },
  {
    name: "Enquiry",
    gap: "Questions arrive through different channels and lose their owner.",
    action: "Bring enquiry details into a clear follow-up process.",
  },
  {
    name: "Follow-up",
    gap: "Interested customers do not hear back at the right time.",
    action: "Agree on response ownership and useful follow-up reminders.",
  },
  {
    name: "Booking",
    gap: "Scheduling takes too much back-and-forth.",
    action: "Scope a booking connection that works with the business calendar.",
  },
  {
    name: "Visit",
    gap: "Feedback and the next step are left to chance.",
    action: "Create a post-visit feedback and care workflow.",
  },
  {
    name: "Return",
    gap: "Previous customers have no prompt to come back.",
    action: "Plan relevant rebooking and retention campaigns with consent.",
  },
];
export const industries = [
  {
    id: "dental",
    name: "Dental clinics",
    short: "Dental",
    title: "From local search to the next appointment.",
    description:
      "A clear digital presence, useful treatment information and a simpler path to contact your reception team.",
    journey: ["Local search", "Enquiry", "Appointment", "Visit", "Follow-up"],
    focus: [
      "Profile & service visibility",
      "Appointment enquiry capture",
      "Reception hand-off",
      "Review & recall planning",
    ],
    bird: "Jay" as const,
  },
  {
    id: "salon",
    name: "Salons & spas",
    short: "Salons & spas",
    title: "Make room for more meaningful bookings.",
    description:
      "Help customers discover your services, ask the right questions and find their way back for their next visit.",
    journey: ["Discovery", "Enquiry", "Booking", "Visit", "Rebooking"],
    focus: [
      "Service & location pages",
      "WhatsApp entry points",
      "Booking connection planning",
      "Review & rebooking workflows",
    ],
    bird: "Myna" as const,
  },
  {
    id: "fitness",
    name: "Fitness studios",
    short: "Fitness",
    title: "Turn local interest into a first visit.",
    description:
      "Bring your classes, trial options and enquiry journey together, with thoughtful follow-up beyond the first session.",
    journey: [
      "Discovery",
      "Trial enquiry",
      "First visit",
      "Membership",
      "Renewal",
    ],
    focus: [
      "Local profile & class visibility",
      "Trial enquiry capture",
      "Follow-up ownership",
      "Renewal reminders",
    ],
    bird: "Robin" as const,
  },
];
export const plans = [
  {
    name: "Launch",
    tag: "A stronger foundation",
    price: "₹15,000–₹30,000",
    period: "one-time setup",
    description:
      "For businesses ready to establish a credible digital presence.",
    features: [
      "Professional website",
      "Google Business Profile setup or optimization",
      "WhatsApp entry point & lead form",
      "Basic local SEO & analytics setup",
    ],
    note: "Ongoing maintenance can be scoped separately.",
  },
  {
    name: "Growth",
    tag: "The core managed service",
    price: "₹5,000–₹12,000",
    period: "per month, plus agreed setup",
    description:
      "For businesses that want a coordinated monthly growth process.",
    features: [
      "Everything in Launch, scoped to your needs",
      "Ongoing local SEO & profile management",
      "Reviews, content & enquiry workflows",
      "Booking & follow-up integration planning",
      "Monthly performance review",
    ],
    note: "Implementation and third-party usage are agreed in your proposal.",
  },
  {
    name: "Growth Partner",
    tag: "Deeper, connected operations",
    price: "₹12,000–₹25,000+",
    period: "per month; implementation scoped separately",
    description: "For businesses ready for more advanced customer operations.",
    features: [
      "Everything in Growth",
      "CRM & lead qualification workflows",
      "Segmentation & win-back planning",
      "Conversion optimization & strategy",
      "Additional-location support as agreed",
    ],
    note: "Final scope depends on your systems and delivery requirements.",
  },
];
export const process = [
  {
    name: "Audit",
    body: "Understand visibility, trust, conversion and retention.",
  },
  {
    name: "Plan",
    body: "Agree on the priorities, scope and measures that matter.",
  },
  {
    name: "Build",
    body: "Prepare your website, profiles and customer journeys.",
  },
  { name: "Launch", body: "Review and connect the agreed systems." },
  {
    name: "Measure",
    body: "Establish a baseline and review relevant outcomes.",
  },
  { name: "Improve", body: "Refine the plan using what we learn together." },
];
export const onboarding = [
  {
    name: "Day 1",
    title: "Understand your business",
    body: "Business details, priorities and authorized access.",
  },
  {
    name: "Days 2–3",
    title: "Audit & prioritize",
    body: "Review the customer journey and agree on a plan.",
  },
  {
    name: "Days 4–7",
    title: "Build the foundations",
    body: "Prepare website, profile and enquiry improvements.",
  },
  {
    name: "Weeks 2–3",
    title: "Connect the workflows",
    body: "Scope and test booking, follow-up, content and reviews.",
  },
  {
    name: "Week 4",
    title: "Set a useful baseline",
    body: "Review what is live and agree on the next growth cycle.",
  },
];
export const faqs = [
  [
    "What is Local Lanchers?",
    "A managed digital growth service for local businesses. We bring discovery, enquiries, follow-up and measurement into one coordinated plan.",
  ],
  [
    "What does a Local Growth Audit cover?",
    "We review visibility, trust, conversion and retention, then discuss the most useful next steps. It is a human-reviewed assessment, not an instant scan or guaranteed revenue forecast.",
  ],
  [
    "Who is this designed for?",
    "Owner-led local businesses whose growth depends on enquiries, appointments and repeat visits. Dental clinics, salons and fitness studios are the initial focus; other requirements can be discussed.",
  ],
  [
    "Do I need to replace my existing tools?",
    "Not necessarily. We start with your current website, profiles, reception process and booking tools. Connections are scoped after checking provider support and access.",
  ],
  [
    "Are WhatsApp, Google and booking tools already connected here?",
    "No. The workspace is an interactive demonstration. Real business connections require provider accounts, authorization and an agreed implementation. No messages are sent from the demo.",
  ],
  [
    "Are the prices fixed?",
    "The ranges are indicative. Setup, monthly work, third-party usage, taxes and optional add-ons are confirmed in an agreed proposal.",
  ],
  [
    "What happens after I request an audit?",
    "Your details are saved securely to the request queue. The team can review them and contact you using the permission you provided. A meeting is confirmed separately.",
  ],
  [
    "Is the 30-day timeline a guarantee?",
    "It is an illustrative onboarding plan. Timing depends on scope, access, content, provider approvals and the delivery schedule agreed with you.",
  ],
];
export const integrationStatus = [
  ["Google Business Profile", "Requires business-owner authorization"],
  ["WhatsApp Business", "Requires an authorized provider account"],
  ["Booking & calendars", "Provider and availability connection needed"],
  ["AI assistance", "Knowledge, provider and escalation scope needed"],
];
