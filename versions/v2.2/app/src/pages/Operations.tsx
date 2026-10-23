import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  LogOut,
  Search,
  Download,
  LoaderCircle,
  Inbox,
  CheckCircle2,
} from "lucide-react";
interface RequestRecord {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  vertical: string;
  city: string;
  website: string;
  challenge: string;
  plan: string;
  contactPermission: boolean;
  marketingConsent: boolean;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
const statuses = ["New", "Reviewing", "Contacted", "Completed"];
export default function Operations() {
  const [session, setSession] = useState<{
      authenticated: boolean;
      configured: boolean;
    } | null>(null),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [requests, setRequests] = useState<RequestRecord[]>([]),
    [selected, setSelected] = useState<string | null>(null),
    [status, setStatus] = useState(""),
    [search, setSearch] = useState(""),
    [note, setNote] = useState(""),
    [nextStatus, setNextStatus] = useState("New"),
    [saved, setSaved] = useState(false);
  async function check() {
    try {
      const r = await fetch("/api/ops/session");
      if (!r.ok) throw new Error();
      setSession(await r.json());
    } catch {
      setError("The operations desk could not be reached. Please retry.");
    }
  }
  async function load() {
    setBusy(true);
    try {
      const r = await fetch("/api/ops/requests");
      if (r.status === 401) {
        setSession((s) => (s ? { ...s, authenticated: false } : s));
        return;
      }
      if (!r.ok) throw new Error();
      setRequests((await r.json()).requests);
    } catch {
      setError("Requests could not be loaded. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    check();
  }, []);
  useEffect(() => {
    if (session?.authenticated) load();
  }, [session?.authenticated]);
  const current = requests.find((r) => r.id === selected);
  useEffect(() => {
    setNote(current?.notes || "");
    setNextStatus(current?.status || "New");
    setSaved(false);
  }, [selected]);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/ops/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const b = await r.json();
      if (!r.ok) {
        setError(b.error);
        return;
      }
      setPassword("");
      await check();
    } catch {
      setError("Sign-in could not be completed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function update() {
    if (!current) return;
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const r = await fetch(`/api/ops/requests/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, notes: note }),
      });
      const b = await r.json();
      if (r.status === 401) {
        setSession({ authenticated: false, configured: true });
        return;
      }
      if (!r.ok) {
        setError(b.error);
        return;
      }
      setRequests((old) =>
        old.map((x) => (x.id === b.request.id ? b.request : x)),
      );
      setSaved(true);
    } catch {
      setError("Changes could not be saved. Your note is still here.");
    } finally {
      setBusy(false);
    }
  }
  const filtered = requests.filter(
    (r) =>
      (!status || r.status === status) &&
      [r.businessName, r.name, r.city, r.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function download() {
    const cell = (v: string) =>
      `"${(/^[=+\-@\t\r]/.test(v) ? "'" : "") + v.replaceAll('"', '""')}"`;
    const rows = [
      [
        "Reference",
        "Business",
        "Name",
        "Email",
        "Phone",
        "City",
        "Status",
        "Created",
      ],
      ...filtered.map((r) => [
        r.id,
        r.businessName,
        r.name,
        r.email,
        r.phone,
        r.city,
        r.status,
        r.createdAt,
      ]),
    ];
    const blob = new Blob(
      ["\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "local-lanchers-audit-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  if (!session)
    return (
      <section className="container section">
        <p role="status">{error || "Opening the team desk…"}</p>
        {error && (
          <button className="button" onClick={check}>
            Retry
          </button>
        )}
      </section>
    );
  if (!session.authenticated)
    return (
      <section className="ops-login container">
        <div>
          <p className="eyebrow">LOCAL LANCHERS / TEAM DESK</p>
          <h1>
            Good work starts
            <br />
            with a clear next step.
          </h1>
          <p className="lede">
            A private space for the team to review audit requests, record
            follow-up and keep the conversation moving.
          </p>
          <Link to="/workspace" className="text-link">
            Looking for the interactive demo?
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="login-panel">
          <ShieldCheck size={32} />
          <h2>Team sign-in</h2>
          {session.configured ? (
            <form onSubmit={login}>
              <label className="field" htmlFor="ops-password">
                <span>Operations password</span>
                <input
                  id="ops-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={256}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="error-banner">
                  {error}
                </p>
              )}
              <button className="button" disabled={busy}>
                {busy ? "Signing in…" : "Open the request desk"}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <>
              <p className="notice">
                Team sign-in hasn’t been enabled for this environment yet. Ask
                the environment owner to configure access.
              </p>
              <p className="field-help">
                The public audit request form can still save requests. This
                private desk does not expose them without sign-in.
              </p>
            </>
          )}
        </div>
      </section>
    );
  return (
    <section className="container section ops-page">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">TEAM OPERATIONS / PRIVATE</p>
          <h1>Conversations worth following up.</h1>
        </div>
        <button
          className="button outline small"
          onClick={async () => {
            await fetch("/api/ops/logout", { method: "POST" });
            setRequests([]);
            setSelected(null);
            await check();
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
      <div className="ops-stats">
        {statuses.map((s) => (
          <button
            key={s}
            className={status === s ? "active" : ""}
            onClick={() => setStatus(status === s ? "" : s)}
          >
            <span>{s}</span>
            <strong>{requests.filter((r) => r.status === s).length}</strong>
          </button>
        ))}
      </div>
      <div className="workspace-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Search requests"
            placeholder="Search business, name, city or reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter request status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          className="button outline small"
          disabled={!filtered.length}
          onClick={download}
        >
          <Download size={15} />
          Export CSV
        </button>
        <button className="button outline small" onClick={load} disabled={busy}>
          Refresh
        </button>
      </div>
      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}
      <div className="ops-layout">
        <div className="request-list">
          {!requests.length ? (
            <div className="empty-state">
              <Inbox size={35} />
              <h3>No audit requests yet.</h3>
              <p>New requests appear here after they have been saved.</p>
            </div>
          ) : !filtered.length ? (
            <div className="empty-state">
              <Search size={30} />
              <h3>No matching requests.</h3>
              <button
                className="text-link"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((r) => (
              <button
                className={`request-row ${selected === r.id ? "selected" : ""}`}
                key={r.id}
                onClick={() => setSelected(r.id)}
              >
                <div>
                  <strong>{r.businessName}</strong>
                  <span>
                    {r.name} · {r.city}
                  </span>
                  <small>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </small>
                </div>
                <span className="status-pill">{r.status}</span>
                <ArrowRight size={17} />
              </button>
            ))
          )}
        </div>
        <div className="request-detail">
          {current ? (
            <>
              <p className="eyebrow">AUDIT REQUEST</p>
              <h2>{current.businessName}</h2>
              <p className="reference-inline">{current.id}</p>
              <dl>
                {[
                  ["Contact", current.name],
                  ["Email", current.email || "Not provided"],
                  ["Phone", current.phone || "Not provided"],
                  ["Business type", current.vertical],
                  ["City", current.city],
                  ["Website", current.website || "Not provided"],
                  ["Plan", current.plan],
                  ["Priority", current.challenge || "To discuss"],
                  [
                    "Reply permission",
                    current.contactPermission ? "Granted" : "Not granted",
                  ],
                  [
                    "Marketing consent",
                    current.marketingConsent ? "Opted in" : "Not opted in",
                  ],
                ].map(([a, b]) => (
                  <div key={a}>
                    <dt>{a}</dt>
                    <dd>{b}</dd>
                  </div>
                ))}
              </dl>
              <label className="field">
                <span>Request status</span>
                <select
                  value={nextStatus}
                  onChange={(e) => {
                    setNextStatus(e.target.value);
                    setSaved(false);
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Team notes</span>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Agreed next steps, follow-up context…"
                />
              </label>
              <button className="button" disabled={busy} onClick={update}>
                {busy ? "Saving…" : "Save changes"}
              </button>
              {saved && (
                <p className="success-message" role="status">
                  <CheckCircle2 size={16} />
                  Changes saved.
                </p>
              )}
            </>
          ) : (
            <div className="empty-state">
              <ShieldCheck size={30} />
              <h3>Choose a request to review.</h3>
              <p>Only the signed-in team can see these details.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
