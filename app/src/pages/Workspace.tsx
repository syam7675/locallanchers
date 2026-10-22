import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  MapPin,
  ListChecks,
  RotateCcw,
  Plus,
  ArrowUpRight,
  Check,
  Search,
  Copy,
  ArrowRight,
  PlugZap,
  Info,
  X,
} from "lucide-react";
import { integrationStatus } from "../data/content";
type Entry = {
  id: string;
  name: string;
  message: string;
  status: "Waiting" | "Qualified" | "Booked";
};
type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  reply: string;
};
const seedEntries: Entry[] = [
  {
    id: "demo-1",
    name: "Example enquiry A",
    message: "I’d like to know about your appointment options.",
    status: "Waiting",
  },
  {
    id: "demo-2",
    name: "Example enquiry B",
    message: "Can someone explain the services available?",
    status: "Qualified",
  },
  {
    id: "demo-3",
    name: "Example enquiry C",
    message: "I have confirmed an example booking with reception.",
    status: "Booked",
  },
  {
    id: "demo-4",
    name: "Example enquiry D",
    message: "What is the best way to plan a first visit?",
    status: "Waiting",
  },
];
const seedReviews: Review[] = [
  {
    id: "review-a",
    name: "Example reviewer A",
    rating: 5,
    comment:
      "The team explained the next steps clearly and made the visit straightforward.",
    reply: "",
  },
  {
    id: "review-b",
    name: "Example reviewer B",
    rating: 3,
    comment:
      "A helpful visit, but I would have liked clearer information before arriving.",
    reply: "",
  },
];
const tasks = [
  "Confirm business details and priorities",
  "Review profile and website information",
  "Agree enquiry ownership and response process",
  "Plan booking and follow-up connections",
  "Establish a baseline for the first review",
];
const demoKey = "ll-workspace-demo-v2.1";
function fresh() {
  return {
    version: 1,
    entries: structuredClone(seedEntries),
    reviews: structuredClone(seedReviews),
    done: [] as number[],
  };
}
function load() {
  try {
    const r = JSON.parse(localStorage.getItem(demoKey) || "null");
    if (
      r?.version === 1 &&
      Array.isArray(r.entries) &&
      r.entries.length <= 100 &&
      r.entries.every(
        (x: any) =>
          typeof x.name === "string" &&
          typeof x.message === "string" &&
          ["Waiting", "Qualified", "Booked"].includes(x.status),
      ) &&
      Array.isArray(r.reviews) &&
      r.reviews.length === 2 &&
      r.reviews.every(
        (x: any) =>
          typeof x.reply === "string" && typeof x.comment === "string",
      ) &&
      Array.isArray(r.done)
    )
      return r as ReturnType<typeof fresh>;
  } catch {}
  return fresh();
}
export default function Workspace() {
  const [q, setQ] = useSearchParams();
  const valid = [
    "overview",
    "enquiries",
    "reviews",
    "visibility",
    "onboarding",
  ];
  const tab = valid.includes(q.get("tab") || "") ? q.get("tab")! : "overview";
  const [data, setData] = useState(load),
    [filter, setFilter] = useState("All"),
    [search, setSearch] = useState(""),
    [toast, setToast] = useState(""),
    [showAdd, setShowAdd] = useState(false),
    [name, setName] = useState(""),
    [message, setMessage] = useState(""),
    [storage, setStorage] = useState(true),
    [drafts, setDrafts] = useState<Record<string, string>>({}),
    [activeReview, setActiveReview] = useState<string | null>(null);
  useEffect(() => {
    try {
      localStorage.setItem(demoKey, JSON.stringify(data));
    } catch {
      setStorage(false);
    }
  }, [data]);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 4200);
      return () => clearTimeout(id);
    }
  }, [toast]);
  const nav = [
    { id: "overview", name: "Growth overview", icon: LayoutDashboard },
    { id: "enquiries", name: "Enquiry desk", icon: MessageSquare },
    { id: "reviews", name: "Review drafts", icon: Star },
    { id: "visibility", name: "Visibility setup", icon: MapPin },
    { id: "onboarding", name: "Onboarding", icon: ListChecks },
  ];
  const qualified = data.entries.filter(
      (e) => e.status === "Qualified" || e.status === "Booked",
    ).length,
    booked = data.entries.filter((e) => e.status === "Booked").length,
    waiting = data.entries.filter((e) => e.status === "Waiting").length;
  const filtered = data.entries.filter(
    (e) =>
      (filter === "All" || e.status === filter) &&
      [e.name, e.message]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function update(id: string, status: Entry["status"]) {
    setData((d) => ({
      ...d,
      entries: d.entries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
    setToast(
      `Example marked ${status.toLowerCase()}. No message sent or appointment created.`,
    );
  }
  const names: Record<string, [string, string]> = {
    overview: [
      "A clearer view of the journey.",
      "Understand the example enquiries and the next actions worth taking.",
    ],
    enquiries: [
      "Keep the conversation moving.",
      "Try the enquiry workflow using fictional examples only.",
    ],
    reviews: [
      "Thoughtful replies. A human final check.",
      "Create a template, edit it and save it locally. No review is published.",
    ],
    visibility: [
      "A strong foundation for discovery.",
      "Review what a real visibility connection would need.",
    ],
    onboarding: [
      "A good start, one step at a time.",
      "Explore the onboarding checklist. Changes are stored only in this browser.",
    ],
  };
  return (
    <section className="workspace-shell">
      <div className="demo-banner">
        <Info size={17} />
        <span>
          <strong>Interactive demo.</strong> Fictional examples. No external
          services connected. Changes stay in this browser.
        </span>
        <button
          onClick={() => {
            setData(fresh());
            setDrafts({});
            setToast("Demo reset to its original examples.");
          }}
        >
          <RotateCcw size={14} />
          Reset demo
        </button>
      </div>
      <div className="workspace-grid">
        <aside className="workspace-sidebar">
          <p className="eyebrow">LOCAL GROWTH / DEMO</p>
          <h2>
            Your growth,
            <br />
            connected.
          </h2>
          <span className="example-business">Example local business</span>
          <nav aria-label="Workspace sections">
            {nav.map((n) => (
              <button
                key={n.id}
                aria-current={tab === n.id ? "page" : undefined}
                className={tab === n.id ? "active" : ""}
                onClick={() => {
                  setQ({ tab: n.id });
                  setShowAdd(false);
                }}
              >
                <n.icon size={18} />
                {n.name}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <p>Ready to discuss your real business?</p>
            <Link to="/audit">
              Request a growth audit
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
        <div className="workspace-main">
          <div className="workspace-title">
            <div>
              <p className="eyebrow">EXAMPLE WORKSPACE / {tab}</p>
              <h1>{names[tab][0]}</h1>
              <p>{names[tab][1]}</p>
            </div>
            <span className="connection-pill">
              <PlugZap size={14} />
              Not connected
            </span>
          </div>
          {!storage && (
            <p className="notice">
              Browser storage is unavailable. Changes will last only for this
              session.
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "overview" && (
                <>
                  <div className="demo-stats">
                    {[
                      ["Example enquiries", data.entries.length],
                      ["Qualified or booked", qualified],
                      ["Sample bookings", booked],
                      ["Awaiting a next step", waiting],
                    ].map(([a, b]) => (
                      <div key={a}>
                        <span>{a}</span>
                        <strong>{b}</strong>
                        <small>From the fictional records below</small>
                      </div>
                    ))}
                  </div>
                  <div className="workspace-two-columns">
                    <div className="workspace-card">
                      <p className="eyebrow">THE EXAMPLE FUNNEL</p>
                      <h2>From interest to a next step.</h2>
                      {[
                        ["Enquiries", data.entries.length],
                        ["Qualified or booked", qualified],
                        ["Marked booked", booked],
                      ].map(([a, b]) => (
                        <div className="funnel-row" key={String(a)}>
                          <div>
                            <span>{a}</span>
                            <strong>{b}</strong>
                          </div>
                          <progress
                            max={Math.max(1, data.entries.length)}
                            value={Number(b)}
                            aria-label={String(a)}
                          />
                        </div>
                      ))}
                      <p className="field-help">
                        Searches, website visits, attended appointments and
                        repeat visits need real provider data. They are not
                        estimated here.
                      </p>
                    </div>
                    <div className="workspace-card">
                      <p className="eyebrow">A USEFUL NEXT STEP</p>
                      <h2>
                        {waiting
                          ? `${waiting} example enquiries are waiting.`
                          : "The example queue is up to date."}
                      </h2>
                      <p>
                        A review queue makes it easier to see who needs an owner
                        and what should happen next.
                      </p>
                      <button
                        className="button"
                        onClick={() => setQ({ tab: "enquiries" })}
                      >
                        Open the enquiry desk
                        <ArrowRight size={16} />
                      </button>
                      <p className="field-help">
                        Marking an example as booked updates this demo only.
                      </p>
                    </div>
                  </div>
                  <div className="workspace-card integration-card">
                    <p className="eyebrow">WHEN YOU CONNECT A REAL BUSINESS</p>
                    <div className="integration-grid">
                      {integrationStatus.map(([a, b]) => (
                        <div key={a}>
                          <PlugZap size={20} />
                          <strong>{a}</strong>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "enquiries" && (
                <>
                  <div className="workspace-toolbar">
                    <label className="search-field">
                      <Search size={16} />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search example enquiries"
                        aria-label="Search example enquiries"
                      />
                    </label>
                    <select
                      aria-label="Filter example enquiry status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      {["All", "Waiting", "Qualified", "Booked"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="button small"
                      disabled={data.entries.length >= 100}
                      onClick={() => setShowAdd(!showAdd)}
                    >
                      <Plus size={16} />
                      Add an example
                    </button>
                  </div>
                  {showAdd && (
                    <form
                      className="workspace-card demo-add"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!name.trim() || !message.trim()) return;
                        setData((d) => ({
                          ...d,
                          entries: [
                            {
                              id: crypto.randomUUID(),
                              name: name.trim(),
                              message: message.trim(),
                              status: "Waiting" as const,
                            },
                            ...d.entries,
                          ].slice(0, 100),
                        }));
                        setName("");
                        setMessage("");
                        setShowAdd(false);
                        setToast(
                          "Fictional enquiry added to this browser’s demo.",
                        );
                      }}
                    >
                      <h2>Add a fictional enquiry</h2>
                      <p>
                        Please use made-up information. This is not a real lead
                        intake form.
                      </p>
                      <label className="field">
                        <span>Example name</span>
                        <input
                          required
                          maxLength={80}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </label>
                      <label className="field">
                        <span>Example message</span>
                        <textarea
                          required
                          maxLength={500}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </label>
                      <button className="button small">Add to demo</button>
                    </form>
                  )}
                  <div className="enquiry-list">
                    {filtered.length ? (
                      filtered.map((e) => (
                        <div key={e.id} className="enquiry-row">
                          <div className="avatar-letter">
                            {e.name.slice(0, 1)}
                          </div>
                          <div className="enquiry-copy">
                            <strong>{e.name}</strong>
                            <span className="example-label">
                              FICTIONAL ENQUIRY
                            </span>
                            <p>{e.message}</p>
                          </div>
                          <span className="status-pill">{e.status}</span>
                          <div className="enquiry-actions">
                            {e.status === "Waiting" && (
                              <button
                                className="button outline small"
                                onClick={() => update(e.id, "Qualified")}
                              >
                                Mark example qualified
                              </button>
                            )}
                            {e.status !== "Booked" && (
                              <button
                                className="button small"
                                onClick={() => update(e.id, "Booked")}
                              >
                                Mark example booked
                              </button>
                            )}
                            {e.status === "Booked" && (
                              <span className="field-help">
                                <Check size={14} />
                                Demo state only
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <Search size={30} />
                        <h3>No matching examples.</h3>
                        <button
                          className="text-link"
                          onClick={() => {
                            setSearch("");
                            setFilter("All");
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {tab === "reviews" && (
                <div className="review-list">
                  {data.reviews.map((r) => (
                    <div className="workspace-card review-row" key={r.id}>
                      <div className="review-top">
                        <div>
                          <strong>{r.name}</strong>
                          <span className="example-label">
                            FICTIONAL REVIEW
                          </span>
                        </div>
                        <div
                          role="img"
                          className="stars"
                          aria-label={`${r.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={15}
                              fill={i < r.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="review-comment">“{r.comment}”</p>
                      {r.reply && (
                        <div className="saved-reply">
                          <span className="eyebrow">
                            SAVED DEMO REPLY / NOT PUBLISHED
                          </span>
                          <p>{r.reply}</p>
                        </div>
                      )}
                      {activeReview === r.id ? (
                        <div>
                          <label className="field">
                            <span>Edit your template draft</span>
                            <textarea
                              rows={4}
                              maxLength={1000}
                              value={drafts[r.id] || ""}
                              onChange={(e) =>
                                setDrafts((d) => ({
                                  ...d,
                                  [r.id]: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <div className="button-row">
                            <button
                              className="button small"
                              disabled={!drafts[r.id]?.trim()}
                              onClick={() => {
                                setData((d) => ({
                                  ...d,
                                  reviews: d.reviews.map((x) =>
                                    x.id === r.id
                                      ? { ...x, reply: drafts[r.id].trim() }
                                      : x,
                                  ),
                                }));
                                setActiveReview(null);
                                setToast(
                                  "Demo reply saved locally. Nothing published.",
                                );
                              }}
                            >
                              Save demo reply
                            </button>
                            <button
                              className="button outline small"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    drafts[r.id] || "",
                                  );
                                  setToast(
                                    "Template copied. Review it before using it with your business.",
                                  );
                                } catch {
                                  setToast(
                                    "Clipboard is unavailable. Select and copy the draft text.",
                                  );
                                }
                              }}
                            >
                              <Copy size={14} />
                              Copy draft
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="button outline small"
                          onClick={() => {
                            setDrafts((d) => ({
                              ...d,
                              [r.id]:
                                r.reply ||
                                (r.rating >= 4
                                  ? "Thank you for sharing your experience. We appreciate the opportunity to help and look forward to welcoming you again."
                                  : "Thank you for the honest feedback. Clear information matters to us. Please contact our team so we can understand your experience and discuss the next steps."),
                            }));
                            setActiveReview(r.id);
                          }}
                        >
                          Create a template draft
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <p className="field-help">
                        Rule-based template, not an AI-generated or published
                        response. No reviewer is contacted.
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {tab === "visibility" && (
                <>
                  <div className="workspace-card">
                    <p className="eyebrow">DISCOVERY / SETUP CHECKLIST</p>
                    <h2>Consistency before another score.</h2>
                    <p>
                      A real visibility review needs authorized access and
                      actual profile information. This demo does not scan
                      Google, estimate rankings or calculate an AI visibility
                      score.
                    </p>
                    <div className="setup-table">
                      {[
                        [
                          "Business details",
                          "Name, address, phone and opening hours",
                        ],
                        [
                          "Services & locations",
                          "Clear service and catchment information",
                        ],
                        ["Website", "Useful pages and an obvious enquiry path"],
                        [
                          "Reviews",
                          "A considered response and feedback process",
                        ],
                      ].map(([a, b]) => (
                        <div key={a}>
                          <strong>{a}</strong>
                          <span>{b}</span>
                          <span className="status-pill">Review needed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="workspace-card">
                    <p className="eyebrow">REAL CONNECTIONS</p>
                    <div className="integration-grid">
                      {integrationStatus.slice(0, 3).map(([a, b]) => (
                        <div key={a}>
                          <PlugZap size={20} />
                          <strong>{a}</strong>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "onboarding" && (
                <div className="workspace-card">
                  <p className="eyebrow">
                    EXAMPLE ONBOARDING / LOCAL CHECKLIST
                  </p>
                  <h2>Build a shared starting point.</h2>
                  <div className="onboarding-progress">
                    <progress
                      max={tasks.length}
                      value={data.done.length}
                      aria-label="Demo onboarding progress"
                    />
                    <span>
                      {data.done.length} of {tasks.length} example steps checked
                    </span>
                  </div>
                  {tasks.map((s, i) => (
                    <label key={s} className="onboarding-task">
                      <input
                        type="checkbox"
                        checked={data.done.includes(i)}
                        onChange={() =>
                          setData((d) => ({
                            ...d,
                            done: d.done.includes(i)
                              ? d.done.filter((x) => x !== i)
                              : [...d.done, i],
                          }))
                        }
                      />
                      <span>
                        <strong>{s}</strong>
                        <small>
                          Example task; checking it does not update a real
                          client account.
                        </small>
                      </span>
                    </label>
                  ))}
                  <p className="field-help">
                    The real onboarding sequence is agreed after an audit,
                    access review and scoped proposal.
                  </p>
                  <Link className="text-link" to="/how-it-works">
                    See the delivery process
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
