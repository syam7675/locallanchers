import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, PlugZap, ArrowUpRight } from "lucide-react";
import { PageHero } from "./Marketing";
import { integrationStatus } from "../data/content";
export function BuildNotes() {
  const [health, setHealth] = useState<{
    requestStorage: string;
    operationsConfigured: boolean;
  } | null>(null);
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);
  return (
    <>
      <PageHero
        eyebrow="VERSION 2.1 / THE BUILD"
        title="A clearer system. An honest foundation."
        body="What’s working, what’s a demonstration, and what comes next. A practical view of this Local Lanchers build."
      />
      <section className="section container readable wide">
        <div className="readiness-grid">
          <div>
            <CheckCircle2 size={27} />
            <h2>Implemented here</h2>
            <ul>
              <li>Original Version 1 logo and consistent branding.</li>
              <li>Responsive, keyboard-friendly navigation.</li>
              <li>Interactive pillars, journey and industry playbooks.</li>
              <li>Plans, scenario calculator and delivery timeline.</li>
              <li>Validated audit requests with durable local storage.</li>
              <li>
                Protected request desk with statuses, notes and CSV export.
              </li>
              <li>Separate, labeled workspace demonstration.</li>
            </ul>
          </div>
          <div>
            <PlugZap size={27} />
            <h2>Connections still needed</h2>
            <ul>
              {integrationStatus.map(([a, b]) => (
                <li key={a}>
                  <strong>{a}:</strong> {b}.
                </li>
              ))}
            </ul>
            <p>
              Provider connections are not simulated as successful real-world
              actions.
            </p>
          </div>
        </div>
        <h2>The useful parts, brought together</h2>
        <p>
          <strong>From Version 1:</strong> the exact original logo, the four
          growth pillars, simple service framing, package ranges and delivery
          process.
        </p>
        <p>
          <strong>From Version 2:</strong> warm editorial styling, animated
          navigation, selectable customer journeys, industry tabs, onboarding
          timelines, a scenario calculator and an interactive workspace concept.
        </p>
        <p>
          <strong>Added in 2.1:</strong> a genuine server-side request flow,
          persistence before confirmation, protected team access, explicit
          permissions, failure handling, reduced-motion support and modular
          source files.
        </p>
        <p>
          <strong>Removed or corrected:</strong> invented customer proof,
          guaranteed ranking or revenue claims, generated “scan” scores, silent
          AI fallbacks and claims that clicking a prototype control sends a real
          message or connects an external service.
        </p>
        <h2>Current environment</h2>
        <p>
          {health
            ? `Request storage: ${health.requestStorage}. Private team sign-in: ${health.operationsConfigured ? "configured" : "not yet configured"}.`
            : "The environment status could not be checked. The application needs its server to save audit requests."}
        </p>
        <h2>The next release should follow customer evidence</h2>
        <p>
          Validate one primary vertical and a focused city first. Connect the
          systems that paying clients actually use. Expand into broader client
          software, an operator network and AI actions after the delivery
          workflow is repeatable.
        </p>
        <div className="button-row">
          <Link to="/audit" className="button">
            Try the request flow
            <ArrowUpRight size={16} />
          </Link>
          <Link to="/workspace" className="button outline">
            Explore the demo
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="REQUEST PRIVACY NOTICE"
        title="Your request, handled with care."
        body="How information submitted through this development build is used."
      />
      <section className="section container readable">
        <p className="notice">
          Development notice. The business owner must confirm the public contact
          address, retention period and final operating policy before launching
          the service publicly.
        </p>
        <h2>What this form collects</h2>
        <p>
          Your name, business name, city, business type, optional website and
          growth priorities, and at least one reply channel. Your permission to
          reply and separate optional marketing choice are recorded with the
          request and submission time.
        </p>
        <h2>Why it is collected</h2>
        <p>
          The Local Lanchers team can review your request, prepare for an audit
          discussion and contact you about it. A request is not an appointment,
          contract, payment or guarantee of results. Marketing permission is
          optional and is not required to request an audit.
        </p>
        <h2>Where it is stored</h2>
        <p>
          Requests in this build are stored in the server’s local database. They
          are not sent to Google, WhatsApp, an AI provider or an email service
          by this application. The private request desk requires configured team
          sign-in.
        </p>
        <h2>What not to include</h2>
        <p>
          Please do not submit passwords, patient information, medical records,
          payment details or other sensitive customer data. The form is for a
          business-growth conversation.
        </p>
        <h2>Your choices</h2>
        <p>
          You can request access, correction, deletion or withdrawal of
          marketing permission through the team when they respond, using your
          request reference. No marketing automation is connected in this build.
        </p>
        <h2>Browser storage and cookies</h2>
        <p>
          The demonstration workspace stores only its example interactions in
          your browser when storage is available. Use its reset control to
          remove that demo state. The team sign-in uses an HTTP-only session
          cookie. No external advertising or analytics trackers are included.
        </p>
        <Link className="text-link" to="/audit">
          Return to the audit request
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
