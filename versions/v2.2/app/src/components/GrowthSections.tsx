import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Check, ArrowRight, Plus, Minus } from "lucide-react";
import {
  pillars,
  industries,
  journey,
  plans,
  process,
  onboarding,
  faqs,
} from "../data/content";
import { SectionHeading, Reveal, AuditLink, icons, CheckList } from "./ui";
import { WoodenBirdSculpture } from "./GrowthBird";
export function tabKeys(e: React.KeyboardEvent<HTMLButtonElement>) {
  const all = [
    ...e.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
      "[role=tab]",
    ),
  ];
  const i = all.indexOf(e.currentTarget);
  let n: number | undefined;
  if (e.key === "ArrowRight") n = (i + 1) % all.length;
  if (e.key === "ArrowLeft") n = (i - 1 + all.length) % all.length;
  if (e.key === "Home") n = 0;
  if (e.key === "End") n = all.length - 1;
  if (n !== undefined) {
    e.preventDefault();
    all[n].click();
    all[n].focus();
  }
}
export function PillarExplorer({ compact = false }: { compact?: boolean }) {
  const [q] = useSearchParams();
  const initial = pillars.findIndex((p) => p.id === q.get("pillar"));
  const [active, setActive] = useState(Math.max(0, initial));
  useEffect(() => {
    setActive(
      Math.max(
        0,
        pillars.findIndex((p) => p.id === q.get("pillar")),
      ),
    );
  }, [q]);
  const p = pillars[active];
  return (
    <section className="section container" id="growth-system">
      {!compact && (
        <SectionHeading
          center
          eyebrow="THE LOCAL GROWTH ENGINE"
          title="One partner. Every step forward."
          body="Your website, search presence and customer conversations should work together. We help you connect the dots."
        />
      )}
      <div
        className="tabs pillar-tabs"
        role="tablist"
        aria-label="Growth pillars"
      >
        {pillars.map((p, i) => {
          const Icon = icons[i];
          return (
            <button
              id={`pillar-tab-${p.id}`}
              key={p.id}
              role="tab"
              aria-selected={i === active}
              aria-controls="pillar-panel"
              tabIndex={active === i ? 0 : -1}
              onKeyDown={tabKeys}
              onClick={() => setActive(i)}
            >
              <Icon size={18} />
              {p.name}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="pillar-panel"
        aria-labelledby={`pillar-tab-${p.id}`}
        className={`pillar-panel pillar-${active}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            className="pillar-copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p className="eyebrow">{p.eyebrow}</p>
            <h3>{p.headline}</h3>
            <p>{p.description}</p>
            <CheckList items={p.services} />
            <AuditLink className="outline">
              Explore your opportunities
            </AuditLink>
          </motion.div>
        </AnimatePresence>
        <div className="bird-stage">
          <motion.div
            key={p.bird}
            initial={{ opacity: 0, rotate: -5, scale: 0.94 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WoodenBirdSculpture coworker={p.bird} />
          </motion.div>
          <span className="art-caption">
            {p.bird} · Your{" "}
            {active === 0
              ? "discovery"
              : active === 1
                ? "conversion"
                : active === 2
                  ? "retention"
                  : "growth"}{" "}
            guide
          </span>
        </div>
      </div>
    </section>
  );
}
export function Journey() {
  const [active, setActive] = useState(0);
  return (
    <section className="section journey-section">
      <div className="container">
        <SectionHeading
          eyebrow="SMALL GAPS. REAL OPPORTUNITIES."
          title="A better journey, from search to return."
          body="Explore where a local customer’s journey can lose momentum—and what a more connected approach looks like."
        />
        <div
          className="journey-tabs"
          role="tablist"
          aria-label="Customer journey"
        >
          {journey.map((s, i) => (
            <button
              key={s.name}
              id={`journey-tab-${i}`}
              role="tab"
              aria-selected={active === i}
              aria-controls="journey-panel"
              tabIndex={active === i ? 0 : -1}
              onKeyDown={tabKeys}
              onClick={() => setActive(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s.name}
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
        <div
          id="journey-panel"
          role="tabpanel"
          aria-labelledby={`journey-tab-${active}`}
          className="journey-panel"
        >
          <div>
            <p className="eyebrow">THE COMMON GAP / {journey[active].name}</p>
            <h3>{journey[active].gap}</h3>
          </div>
          <div>
            <p className="eyebrow green">A MORE CONNECTED APPROACH</p>
            <p className="journey-action">{journey[active].action}</p>
            <Link to="/audit" className="text-link">
              Review my customer journey
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <p className="caption">
          Illustrative opportunities, not findings about your business. Your
          audit is reviewed individually.
        </p>
      </div>
    </section>
  );
}
export function IndustryExplorer({ compact = false }: { compact?: boolean }) {
  const [q] = useSearchParams();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(
      Math.max(
        0,
        industries.findIndex((p) => p.id === q.get("industry")),
      ),
    );
  }, [q]);
  const item = industries[index];
  return (
    <section className="container section" id="industries">
      {!compact && (
        <SectionHeading
          center
          eyebrow="LOCAL BY DESIGN"
          title="Your business is different. Your plan should be, too."
          body="The same growth principles, shaped around how your customers discover, enquire and come back."
        />
      )}
      <div
        className="tabs industry-tabs"
        role="tablist"
        aria-label="Industry playbooks"
      >
        {industries.map((p, i) => (
          <button
            key={p.id}
            id={`industry-tab-${p.id}`}
            role="tab"
            aria-selected={i === index}
            aria-controls="industry-panel"
            tabIndex={i === index ? 0 : -1}
            onKeyDown={tabKeys}
            onClick={() => setIndex(i)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div
        className="industry-panel"
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`industry-tab-${item.id}`}
      >
        <div className="industry-visual">
          <span className="eyebrow">{item.name}</span>
          <div className="industry-path">
            {item.journey.map((s, i) => (
              <div key={s}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{s}</strong>
                {i < item.journey.length - 1 && <ArrowRight size={21} />}
              </div>
            ))}
          </div>
          <p>
            One customer journey.
            <br />A more thoughtful next step.
          </p>
        </div>
        <div className="industry-copy">
          <p className="eyebrow">A PLAYBOOK FOR {item.name}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <CheckList items={item.focus} />
          <AuditLink industry={item.name}>Discuss my business</AuditLink>
        </div>
      </div>
      <p className="caption">
        Our initial focus is dental clinics, salons and fitness studios. Other
        local-business requirements can be discussed through an audit request.
      </p>
    </section>
  );
}
export function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section pricing-section" id="plans">
      <div className="container">
        {!compact && (
          <SectionHeading
            center
            eyebrow="A PLAN FOR YOUR NEXT CHAPTER"
            title="Start with what you need. Grow from there."
            body="A strong foundation, a managed monthly rhythm, or deeper growth operations. The right plan starts with understanding your business."
          />
        )}
        <div className="plans-grid">
          {plans.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.08}
              className={`plan ${i === 1 ? "featured" : ""}`}
            >
              <p className="eyebrow">{p.tag}</p>
              <h3>{p.name}</h3>
              <p className="plan-description">{p.description}</p>
              <div className="price">{p.price}</div>
              <p className="period">{p.period}</p>
              <CheckList items={p.features} />
              <AuditLink
                plan={p.name}
                className={i === 1 ? "light" : "outline"}
              >
                Discuss {p.name}
              </AuditLink>
              <p className="plan-note">{p.note}</p>
            </Reveal>
          ))}
        </div>
        <p className="pricing-note">
          Indicative pricing, not a fixed quote. Scope, implementation, taxes,
          provider usage fees, media spend and optional add-ons are confirmed in
          your proposal.
        </p>
      </div>
    </section>
  );
}
export function Process({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState(0);
  return (
    <section className="section container" id="process">
      {!compact && (
        <SectionHeading
          eyebrow="CLEAR STEPS. SHARED PRIORITIES."
          title="Good growth starts with a plan."
          body="We do the thinking with you, then help put the agreed pieces in place."
        />
      )}
      <div
        className="tabs process-tabs"
        role="tablist"
        aria-label="Delivery process"
      >
        <button
          role="tab"
          id="process-overview"
          aria-selected={tab === 0}
          aria-controls="process-panel"
          tabIndex={tab === 0 ? 0 : -1}
          onKeyDown={tabKeys}
          onClick={() => setTab(0)}
        >
          The growth cycle
        </button>
        <button
          role="tab"
          id="process-timeline"
          aria-selected={tab === 1}
          aria-controls="process-panel"
          tabIndex={tab === 1 ? 0 : -1}
          onKeyDown={tabKeys}
          onClick={() => setTab(1)}
        >
          Your first 30 days
        </button>
      </div>
      <div
        role="tabpanel"
        id="process-panel"
        aria-labelledby={tab ? "process-timeline" : "process-overview"}
        className={tab ? "onboarding-grid" : "process-grid"}
      >
        {tab
          ? onboarding.map((s) => (
              <Reveal key={s.name} className="timeline-step">
                <span className="eyebrow">{s.name}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))
          : process.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04} className="process-step">
                <span className="step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
      </div>
      <p className="caption">
        The first-month timeline is illustrative. Scope, access and provider
        approvals shape the schedule we agree with you.
      </p>
    </section>
  );
}
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section container faq-section">
      <SectionHeading
        eyebrow="A LITTLE MORE CLARITY"
        title="Good questions. Straight answers."
      />
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <div key={q} className={`faq-item ${open === i ? "open" : ""}`}>
            <h3>
              <button
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {q}
                {open === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </h3>
            <div id={`faq-${i}`} hidden={open !== i}>
              <p>{a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function ScenarioCalculator() {
  const [enquiries, setEnquiries] = useState(60),
    [conversion, setConversion] = useState(25),
    [target, setTarget] = useState(35),
    [ticket, setTicket] = useState(1500);
  const extra = (enquiries * (target - conversion)) / 100;
  return (
    <section className="section container">
      <div className="calculator">
        <div>
          <p className="eyebrow">PLAN A SCENARIO</p>
          <h2>What could a better conversion rate mean?</h2>
          <p>
            This is arithmetic using your assumptions—not a forecast, an audit
            result or a promise of growth.
          </p>
          <div className="calculator-inputs">
            {[
              ["Monthly enquiries", enquiries, setEnquiries, 0, 10000],
              ["Current booking rate (%)", conversion, setConversion, 0, 100],
              ["Scenario booking rate (%)", target, setTarget, 0, 100],
              ["Average booking value (₹)", ticket, setTicket, 0, 1000000],
            ].map(([label, value, set, min, max]) => (
              <label key={String(label)}>
                {String(label)}
                <input
                  type="number"
                  min={Number(min)}
                  max={Number(max)}
                  value={Number(value)}
                  onChange={(e) =>
                    (set as (n: number) => void)(
                      Math.min(
                        Number(max),
                        Math.max(Number(min), Number(e.target.value)),
                      ),
                    )
                  }
                />
              </label>
            ))}
          </div>
        </div>
        <div className="scenario-result">
          <p className="eyebrow">YOUR HYPOTHETICAL SCENARIO</p>
          <strong>
            {extra >= 0 ? "+" : ""}
            {extra.toFixed(1)}
          </strong>
          <span>bookings per month at the scenario rate</span>
          <div className="hairline" />
          <b>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(extra * ticket)}
          </b>
          <span>change in gross booking value, before costs</span>
          <p>
            Formula: enquiries × (scenario rate − current rate) × average value.
            No customer data or external research is used.
          </p>
        </div>
      </div>
    </section>
  );
}
