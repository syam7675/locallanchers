import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Logo, AuditLink, icons } from "./ui";
import { pillars, industries } from "../data/content";
export function Layout() {
  const [menu, setMenu] = useState<string | null>(null),
    [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const location = useLocation();
  useEffect(() => {
    setMenu(null);
    setMobile(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.search]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menu) triggers.current[menu]?.focus();
        if (mobile) triggers.current.mobile?.focus();
        setMenu(null);
        setMobile(false);
      }
    };
    const click = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setMenu(null);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", click);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", click);
    };
  }, [menu, mobile]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        {import.meta.env.VITE_PUBLIC_DEMO === "true"
          ? "Version 2.1 · Interactive preview"
          : "A little clarity. A stronger growth plan."}
        <Link to="/audit">
          Start with a Local Growth Audit <ArrowUpRight size={13} />
        </Link>
      </div>
      <header ref={ref} className="site-header">
        <div className="container nav-row">
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            <div className="nav-pill">
              {["Solutions", "Industries"].map((label) => (
                <button
                  key={label}
                  ref={(n) => {
                    triggers.current[label] = n;
                  }}
                  aria-expanded={menu === label}
                  aria-controls="mega-menu"
                  onClick={() => setMenu(menu === label ? null : label)}
                >
                  {label}
                  <ChevronDown
                    size={13}
                    className={menu === label ? "rotated" : ""}
                  />
                </button>
              ))}
              <NavLink to="/how-it-works">How it works</NavLink>
              <NavLink to="/plans">Plans</NavLink>
            </div>
          </nav>
          <div className="nav-actions">
            <Link to="/workspace" className="text-link demo-nav">
              Explore the demo
              <ArrowUpRight size={14} />
            </Link>
            <AuditLink className="small">Get a growth audit</AuditLink>
            <button
              className="icon-button mobile-toggle"
              aria-label={mobile ? "Close navigation" : "Open navigation"}
              aria-expanded={mobile}
              aria-controls="mobile-nav"
              ref={(n) => {
                triggers.current.mobile = n;
              }}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div
              id="mega-menu"
              className="mega-menu container"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mega-intro">
                <span className="eyebrow">
                  {menu === "Solutions"
                    ? "ONE GROWTH SYSTEM"
                    : "BUILT AROUND YOUR BUSINESS"}
                </span>
                <h3>
                  {menu === "Solutions"
                    ? "Every stage. Working together."
                    : "Different businesses. Shared possibilities."}
                </h3>
                <Link
                  to={menu === "Solutions" ? "/growth" : "/industries"}
                  className="text-link"
                >
                  Explore {menu.toLowerCase()}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="mega-items">
                {menu === "Solutions"
                  ? pillars.map((p, i) => {
                      const Icon = icons[i];
                      return (
                        <Link key={p.id} to={`/growth?pillar=${p.id}`}>
                          <Icon size={21} />
                          <div>
                            <strong>{p.name}</strong>
                            <span>{p.services[0]}</span>
                          </div>
                          <ArrowUpRight size={15} />
                        </Link>
                      );
                    })
                  : industries.map((p) => (
                      <Link key={p.id} to={`/industries?industry=${p.id}`}>
                        <div>
                          <strong>{p.name}</strong>
                          <span>{p.journey.join(" → ")}</span>
                        </div>
                        <ArrowUpRight size={15} />
                      </Link>
                    ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {mobile && (
          <nav
            id="mobile-nav"
            className="mobile-nav container"
            aria-label="Mobile navigation"
          >
            {[
              ["/growth", "Solutions"],
              ["/industries", "Industries"],
              ["/how-it-works", "How it works"],
              ["/plans", "Plans"],
              ["/workspace", "Interactive demo"],
              ["/audit", "Request an audit"],
            ].map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Logo footer />
            <p>
              Your digital growth partner.
              <br />
              Human strategy. Thoughtful execution.
            </p>
          </div>
          <div>
            <h4>Growth, connected</h4>
            <Link to="/growth">Our growth system</Link>
            <Link to="/industries">For your industry</Link>
            <Link to="/plans">Explore plans</Link>
          </div>
          <div>
            <h4>Take the next step</h4>
            <Link to="/audit">Request an audit</Link>
            <Link to="/how-it-works">How we work</Link>
            <Link to="/workspace">Explore the demo</Link>
          </div>
          <div>
            <h4>Behind the build</h4>
            <Link to="/build-notes">Version 2.1 & readiness</Link>
            <Link to="/privacy">Request privacy notice</Link>
            <Link to="/ops">Team operations desk</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Local Lanchers.</span>
          <span>Discover. Convert. Grow. Together.</span>
          <span>Version 2.1</span>
        </div>
      </footer>
    </>
  );
}
