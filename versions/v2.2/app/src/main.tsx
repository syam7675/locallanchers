import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Layout } from "./components/Layout";
import {
  Home,
  GrowthPage,
  IndustriesPage,
  PlansPage,
  ProcessPage,
} from "./pages/Marketing";
import { BuildNotes, Privacy } from "./pages/Info";
import "./styles/global.css";
const Audit = lazy(() => import("./pages/Audit"));
const Workspace = lazy(() => import("./pages/Workspace"));
const Operations = lazy(() => import("./pages/Operations"));
class AppBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="container section">
        <h1>We couldn’t open this view.</h1>
        <p>
          Please refresh and try again. No request confirmation has been issued.
        </p>
        <a className="button" href="/">
          Return home
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="container section" role="status">
                Opening your next step…
              </div>
            }
          >
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="growth" element={<GrowthPage />} />
                <Route path="industries" element={<IndustriesPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="how-it-works" element={<ProcessPage />} />
                <Route path="audit" element={<Audit />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="ops" element={<Operations />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="build-notes" element={<BuildNotes />} />
                <Route
                  path="*"
                  element={
                    <section className="container section">
                      <h1>This page hasn’t found its place.</h1>
                      <Link className="button" to="/">
                        Back to Local Lanchers
                      </Link>
                    </section>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </AppBoundary>
  </React.StrictMode>,
);
