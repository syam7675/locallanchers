import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Fingerprint,
  LogIn,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import ActivityHeatmap from "./ui/activity-heatmap";
import { type ActivityState, demoMembers } from "../hooks/useActivity";
import {
  activityBand,
  activityDay,
  activityDays,
  activityLabels,
} from "../../shared/activity";

export default function ActivityPanel({ state: s }: { state: ActivityState }) {
  const [range, setRange] = useState(90),
    [member, setMember] = useState("all"),
    [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login"),
    [busy, setBusy] = useState(false),
    [authError, setAuthError] = useState("");
  const [confirm, setConfirm] = useState<"clear" | "delete" | null>(null);
  const members = s.source === "demo" ? demoMembers : s.user ? [s.user] : [];
  const all = s.source === "demo" ? s.demoEvents : s.realEvents;
  const visible = all.filter(
    (e) => s.source === "real" || member === "all" || e.userId === member,
  );
  const days = activityDays(visible, range),
    start = days[0].date,
    end = days.at(-1)!.date;
  const inRange = visible.filter((e) => {
    const day = activityDay(new Date(e.at));
    return day >= start && day <= end;
  });
  const selectedEvents = inRange
    .filter((e) => !selected || activityDay(new Date(e.at)) === selected)
    .sort((a, b) => b.at.localeCompare(a.at));
  const total = days.reduce((a, b) => a + b.count, 0),
    activeDays = days.filter((d) => d.count > 0).length;
  const today = activityDay(new Date());
  const changeSource = (source: "demo" | "real") => {
    s.setSource(source);
    setSelected(null);
    setMember("all");
    setAuthError("");
  };
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setAuthError("");
    try {
      await fn();
      setConfirm(null);
    } catch (e) {
      setAuthError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="activity-panel workspace-card"
      aria-label="User activity"
    >
      <div className="activity-heading">
        <div>
          <p className="eyebrow">
            <Activity size={14} /> THE RHYTHM OF YOUR WORK
          </p>
          <h2>Small actions. Visible momentum.</h2>
          <p>See who showed up, what they tried, and when it happened.</p>
        </div>
        <span className="version-badge">V2.2</span>
      </div>
      <div className="activity-controls">
        <div className="activity-segment" aria-label="Activity data source">
          <button
            aria-pressed={s.source === "demo"}
            onClick={() => changeSource("demo")}
          >
            Demo profiles
          </button>
          <button
            aria-pressed={s.source === "real"}
            onClick={() => changeSource("real")}
          >
            My real activity
          </button>
        </div>
        <label className="activity-select">
          Date range
          <select
            aria-label="Date range"
            value={range}
            onChange={(e) => {
              setRange(+e.target.value);
              setSelected(null);
            }}
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
        </label>
      </div>
      {s.source === "demo" ? (
        <div className="activity-context">
          <Users size={18} />
          <p>
            <strong>Fictional history + your practice actions.</strong> Example
            profiles demonstrate the workflow. Switch a profile, then use the
            enquiry desk, review drafts or checklist to add activity.
          </p>
          <label className="activity-select">
            Act as
            <select
              aria-label="Act as"
              value={s.demoUser}
              onChange={(e) => s.setDemoUser(e.target.value)}
            >
              {demoMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="activity-context">
          <Fingerprint size={20} />
          <p>
            <strong>
              {s.user
                ? `Signed in as ${s.user.name}`
                : "Your own account. Your own history."}
            </strong>{" "}
            Only successful sign-ins and your workspace interactions appear
            here. Practice actions are feature usage, not real bookings or
            customer outcomes.
          </p>
          {s.user && (
            <button
              className="text-link"
              disabled={busy}
              onClick={() => void action(s.logout)}
            >
              <LogOut size={15} />
              Sign out
            </button>
          )}
        </div>
      )}
      {s.source === "real" && !s.user && (
        <div className="account-panel">
          {s.configured === false ? (
            <>
              <h3>Real accounts are not connected on this preview.</h3>
              <p>
                Explore the demo profiles now. The full app includes private
                sign-in and saved activity, ready for a host with persistent
                storage.
              </p>
              <button
                className="button small"
                onClick={() => changeSource("demo")}
              >
                Explore demo activity
                <ArrowUpRight size={15} />
              </button>
            </>
          ) : s.configured === null ? (
            <>
              <p>Checking account service…</p>
              <button className="text-link" onClick={() => void s.check()}>
                Retry connection
              </button>
            </>
          ) : (
            <>
              <div className="account-title">
                <h3>
                  {mode === "login"
                    ? "Welcome back."
                    : "Start your activity history."}
                </h3>
                <button
                  className="text-link"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setAuthError("");
                  }}
                >
                  {mode === "login" ? "Create an account" : "I have an account"}
                </button>
              </div>
              <form
                className="account-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  void action(() =>
                    s.authenticate(mode, {
                      name: form.get("name"),
                      email: form.get("email"),
                      password: form.get("password"),
                      consent: form.get("consent") === "on",
                    }),
                  );
                }}
              >
                {mode === "register" && (
                  <label className="field">
                    <span>Your name</span>
                    <input
                      name="name"
                      required
                      maxLength={80}
                      autoComplete="name"
                    />
                  </label>
                )}
                <label className="field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={mode === "register" ? 12 : 1}
                    maxLength={128}
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                  />
                </label>
                {mode === "register" && (
                  <label className="activity-consent">
                    <input name="consent" type="checkbox" required />
                    <span>
                      Record my sign-ins and workspace activity and show the
                      last 366 days. I can clear my history or delete my
                      account. Use 12 or more characters for your password.
                    </span>
                  </label>
                )}
                <button className="button small" disabled={busy}>
                  <LogIn size={16} />
                  {busy
                    ? "Please wait…"
                    : mode === "login"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
      {(authError || s.error) && (
        <p className="field-error" role="alert">
          {authError || s.error}
        </p>
      )}
      {(s.source === "demo" || s.user) && (
        <>
          <div className="activity-metrics">
            <div>
              <span>RECORDED ACTIONS</span>
              <strong>{total.toLocaleString()}</strong>
              <small>In the selected range</small>
            </div>
            <div>
              <span>ACTIVE DAYS</span>
              <strong>
                {activeDays}
                <em> / {range}</em>
              </strong>
              <small>At least one recorded action</small>
            </div>
            <div>
              <span>DAILY AVERAGE</span>
              <strong>{(total / range).toFixed(1)}</strong>
              <small>Includes quiet days</small>
            </div>
          </div>
          <ActivityHeatmap
            days={days}
            label={`${s.source === "demo" ? "Demo" : "My real"} activity over ${range} days`}
            period={`the last ${range} days`}
            unit={{ one: "action", other: "actions" }}
            thresholds={[2, 5, 9]}
            selectedDate={selected}
            onSelectDate={setSelected}
            actions={
              s.source === "demo" ? (
                <label className="activity-select">
                  Show
                  <select
                    aria-label="Show"
                    value={member}
                    onChange={(e) => {
                      setMember(e.target.value);
                      setSelected(null);
                    }}
                  >
                    <option value="all">All demo profiles</option>
                    {demoMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : undefined
            }
          />
          <p className="activity-footnote">
            Calendar days use India time (IST). Select a day to inspect its
            activity. Arrow keys move through days; Enter selects. Levels: 0 ·
            1–2 · 3–5 · 6–9 · 10+ actions.
          </p>
          <div className="activity-lower">
            <div className="activity-people">
              <h3>
                {s.source === "demo"
                  ? "People in the rhythm"
                  : "Your activity range"}
              </h3>
              <p className="field-help">
                Daily bands are action counts, not a performance rating.
              </p>
              {members.map((m) => {
                const events = all.filter(
                  (e) =>
                    e.userId === m.id &&
                    activityDay(new Date(e.at)) >= start &&
                    activityDay(new Date(e.at)) <= end,
                );
                const count = events.filter(
                  (e) => activityDay(new Date(e.at)) === today,
                ).length;
                const last = [...events].sort((a, b) =>
                  b.at.localeCompare(a.at),
                )[0];
                return (
                  <div className="activity-person" key={m.id}>
                    <span className="activity-avatar">{m.name[0]}</span>
                    <div>
                      <strong>{m.name}</strong>
                      <small>
                        {events.length} actions in range ·{" "}
                        {last
                          ? `Last active ${activityDay(new Date(last.at))}`
                          : "No recorded activity"}
                      </small>
                    </div>
                    <span className="activity-band">
                      <strong>{activityBand(count)}</strong>
                      <small>Today</small>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="activity-feed">
              <div className="account-title">
                <h3>
                  {selected ? `Activity · ${selected}` : "Latest activity"}
                </h3>
                {selected && (
                  <button
                    className="text-link"
                    onClick={() => setSelected(null)}
                  >
                    Clear day
                  </button>
                )}
              </div>
              {selectedEvents.length ? (
                selectedEvents.slice(0, 5).map((e) => (
                  <div className="activity-event" key={e.id}>
                    <span className="event-dot" />
                    <div>
                      <strong>
                        {activityLabels[e.kind] || "Workspace action"}
                      </strong>
                      <small>
                        {members.find((m) => m.id === e.userId)?.name || "You"}{" "}
                        ·{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          timeZone: "Asia/Kolkata",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(e.at))}{" "}
                        IST
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="activity-empty">
                  A quiet day. No recorded actions in this selection.
                </p>
              )}
            </div>
          </div>
          {s.source === "real" && (
            <div className="activity-privacy">
              <ShieldCheck size={17} />
              <span>
                Private to your account. No form contents, passwords or customer
                details are recorded.
              </span>
              {confirm ? (
                <>
                  <span>
                    {confirm === "delete"
                      ? "Delete your account and all its activity?"
                      : "Permanently clear your activity history?"}
                  </span>
                  <button
                    className="text-link"
                    disabled={busy}
                    onClick={() =>
                      void action(confirm === "delete" ? s.remove : s.clear)
                    }
                  >
                    Confirm {confirm === "delete" ? "deletion" : "clear"}
                  </button>
                  <button
                    className="text-link"
                    onClick={() => setConfirm(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-link"
                    onClick={() => setConfirm("clear")}
                  >
                    Clear history
                  </button>
                  <button
                    className="text-link"
                    onClick={() => setConfirm("delete")}
                  >
                    Delete account
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
