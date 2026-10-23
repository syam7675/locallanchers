import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Search,
  MessageSquare,
  RefreshCw,
  ChartNoAxesCombined,
} from "lucide-react";
import { Link } from "react-router-dom";
export { ArrowUpRight, ArrowRight, Check };
export const icons = [Search, MessageSquare, RefreshCw, ChartNoAxesCombined];
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`section-heading ${center ? "center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p className="lede">{body}</p>}
    </Reveal>
  );
}
export function AuditLink({
  children = "Request a growth audit",
  className = "",
  plan = "",
  industry = "",
}: {
  children?: React.ReactNode;
  className?: string;
  plan?: string;
  industry?: string;
}) {
  const q = new URLSearchParams();
  if (plan) q.set("plan", plan);
  if (industry) q.set("industry", industry);
  return (
    <Link
      className={`button ${className}`}
      to={`/audit${q.size ? "?" + q.toString() : ""}`}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function CTA() {
  return (
    <section className="cta-band section">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2>
            Good at your business?
            <br />
            Let’s help people find it.
          </h2>
          <p>
            A clearer picture of your digital presence is a good place to start.
          </p>
        </div>
        <AuditLink className="light">Let’s find your opportunities</AuditLink>
      </div>
    </section>
  );
}
export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      className={`logo ${footer ? "footer-logo" : ""}`}
      to="/"
      aria-label="Local Lanchers home"
    >
      <img
        src="/images/original-logo.png"
        alt="Local Lanchers — Digital Growth Partner for Local Businesses"
        width="900"
        height="450"
      />
    </Link>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((s) => (
        <li key={s}>
          <Check size={17} />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}
