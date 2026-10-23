import SculptureHero from "../components/ui/liquid-sculpture-hero";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MessageSquare,
  RefreshCw,
  BarChart3,
  Check,
  ShieldCheck,
} from "lucide-react";
import { AuditLink, Reveal, SectionHeading, CTA } from "../components/ui";
import {
  PillarExplorer,
  Journey,
  IndustryExplorer,
  Pricing,
  Process,
  FAQ,
  ScenarioCalculator,
} from "../components/GrowthSections";
export function Home() {
  return (
    <>
      <section className="hero-wrap container">
        <SculptureHero
          src="/images/growth-sculpture.webp"
          darkSrc="/images/growth-sculpture.webp"
          mobileSrc="/images/growth-sculpture.webp"
          mobileDarkSrc="/images/growth-sculpture.webp"
          showNav={false}
          themeToggle={false}
          loadFonts={false}
          showCredit={false}
          background="#EAE9E7"
          textColor="#173e36"
          accentColor="#36694e"
          headingFont="'Plus Jakarta Sans', sans-serif"
          bodyFont="'DM Sans', sans-serif"
          accentFont="Georgia, serif"
          height="min(790px, 100svh)"
          eyebrow="LOCAL LANCHERS · DIGITAL GROWTH, HUMAN AT HEART"
          headline={"Your next chapter.\nBeautifully connected."}
          headlineAccent="Beautifully connected."
          body="Get discovered. Turn enquiries into customers. Give them a reason to come back. A managed growth partner for local businesses in India."
          primaryCta={{ label: "Find my growth opportunities", href: "/audit" }}
          secondaryCta={{ label: "See how it works", href: "/how-it-works" }}
          hint="Move across the sculpture"
          hintTouch=""
          particleDensity={0.35}
          ambient={false}
          intro={false}
          sculptureScale={0.95}
          backdropText="GROWTH"
          className="growth-sculpture"
        />
      </section>
      <div className="container lifecycle-strip">
        <span>GROWTH IS A JOURNEY.</span>
        <div>
          <Search size={16} />
          Get discovered
        </div>
        <i />
        <div>
          <MessageSquare size={16} />
          Start conversations
        </div>
        <i />
        <div>
          <RefreshCw size={16} />
          Build relationships
        </div>
        <i />
        <div>
          <BarChart3 size={16} />
          See what matters
        </div>
      </div>
      <PillarExplorer />
      <Journey />
      <IndustryExplorer />
      <section className="section human-section">
        <div className="container human-grid">
          <SectionHeading
            eyebrow="HUMAN STRATEGY. THOUGHTFUL EXECUTION."
            title="More connected. Less on your plate."
            body="Running a local business already asks a lot of you. Your digital presence shouldn’t be another collection of loose ends."
          />
          <div className="principles">
            {[
              [
                "A plan shaped around you",
                "Your business, customers and priorities come first.",
              ],
              [
                "One coordinated approach",
                "Search, website, enquiries and follow-up work toward shared goals.",
              ],
              [
                "Progress you can discuss",
                "A useful baseline and regular reviews keep the work grounded.",
              ],
            ].map(([h, p]) => (
              <Reveal key={h}>
                <ShieldCheck size={23} />
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Process />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
function ArrowUpRightTiny() {
  return <ArrowRight size={15} />;
}
export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="page-hero container">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{body}</p>
      </Reveal>
    </div>
  );
}
export function GrowthPage() {
  return (
    <>
      <PageHero
        eyebrow="THE LOCAL GROWTH ENGINE"
        title="A stronger journey. Every step of the way."
        body="Four connected pillars. One plan shaped around how your business gets discovered, wins enquiries and builds lasting relationships."
      />
      <PillarExplorer compact />
      <Journey />
      <CTA />
    </>
  );
}
export function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="LOCAL BY DESIGN"
        title="Built around your kind of business."
        body="An appointment at a clinic, a salon visit and a trial at a gym are different journeys. The plan should reflect that."
      />
      <IndustryExplorer compact />
      <Process />
      <CTA />
    </>
  );
}
export function PlansPage() {
  return (
    <>
      <PageHero
        eyebrow="CLARITY BEFORE COMMITMENT"
        title="The right next step. At the right stage."
        body="Build a stronger foundation, find a monthly growth rhythm, or connect more of your operations. We start with what your business needs."
      />
      <Pricing compact />
      <ScenarioCalculator />
      <FAQ />
      <CTA />
    </>
  );
}
export function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="HOW WE WORK"
        title="First, understand. Then, move forward."
        body="A clear process, an agreed scope and a shared picture of progress. Here’s how we approach your next chapter."
      />
      <Process compact />
      <section className="section audit-explainer">
        <div className="container">
          <SectionHeading
            eyebrow="START WITH A LOCAL GROWTH AUDIT"
            title="Clarity before another tool."
            body="We look at your digital customer journey and discuss the improvements worth making first."
          />
          <div className="four-grid">
            {[
              ["Visibility", "Can relevant local customers discover you?"],
              [
                "Trust",
                "Is there useful, credible information to help them decide?",
              ],
              [
                "Conversion",
                "Is the next step to enquire or book easy to find?",
              ],
              [
                "Retention",
                "Is there a thoughtful plan beyond the first visit?",
              ],
            ].map(([h, p], i) => (
              <Reveal key={h}>
                <span className="step-number">0{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <AuditLink>Request my audit</AuditLink>
        </div>
      </section>
      <CTA />
    </>
  );
}
