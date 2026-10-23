import { useEffect, useState } from "react";
import { type ActivityEvent, type ActivityKind } from "../../shared/activity";
export type Member = { id: string; name: string; email?: string };
export const demoMembers: Member[] = [
  { id: "maya", name: "Maya · Owner" },
  { id: "arun", name: "Arun · Front desk" },
  { id: "leela", name: "Leela · Growth lead" },
];
const key = "ll-activity-v2.2";
function sample(): ActivityEvent[] {
  const result: ActivityEvent[] = [];
  for (let d = 89; d >= 0; d--)
    for (let u = 0; u < 3; u++) {
      const count = (d * 13 + u * 7) % 12;
      for (let i = 0; i < (d % 7 === 6 ? 0 : count); i++)
        result.push({
          id: `seed-${d}-${u}-${i}`,
          userId: demoMembers[u].id,
          kind:
            i === 0
              ? "login"
              : (
                  [
                    "enquiry_updated",
                    "review_saved",
                    "onboarding_updated",
                  ] as const
                )[i % 3],
          at: new Date(Date.now() - d * 86400000 - i * 60000).toISOString(),
        });
    }
  return result;
}
function initial() {
  try {
    const x = JSON.parse(localStorage.getItem(key) || "null");
    if (
      Array.isArray(x) &&
      x.length <= 10000 &&
      x.every(
        (e) =>
          typeof e.id === "string" &&
          typeof e.userId === "string" &&
          typeof e.kind === "string" &&
          Number.isFinite(Date.parse(e.at)),
      )
    )
      return x as ActivityEvent[];
  } catch {}
  return sample();
}
export async function accountRequest(
  path: string,
  method = "GET",
  body?: unknown,
) {
  const r = await fetch("/api/account/" + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r
    .json()
    .catch(() => ({
      error: "The account service is unavailable. Please retry.",
    }));
  if (!r.ok)
    throw new Error(data.error || "The request could not be completed.");
  return data;
}
export function useActivity() {
  const [source, setSource] = useState<"demo" | "real">("demo");
  const [demoUser, setDemoUser] = useState("maya");
  const [demoEvents, setDemoEvents] = useState<ActivityEvent[]>(initial);
  const [realEvents, setRealEvents] = useState<ActivityEvent[]>([]);
  const [user, setUser] = useState<Member | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(demoEvents));
    } catch {
      setError(
        "Activity is available for this visit only: browser storage is unavailable.",
      );
    }
  }, [demoEvents]);
  async function refresh() {
    const data = await accountRequest("activity");
    setRealEvents(data.events);
  }
  async function check() {
    try {
      setError("");
      const data = await accountRequest("session");
      setConfigured(data.configured);
      setUser(data.user);
      if (data.user) await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void check();
  }, []);
  async function record(kind: ActivityKind) {
    const event: ActivityEvent = {
      id: crypto.randomUUID(),
      userId: source === "real" ? user?.id || "" : demoUser,
      kind,
      at: new Date().toISOString(),
    };
    if (source === "real") {
      if (!user) return;
      try {
        await accountRequest("activity", "POST", { id: event.id, kind });
        await refresh();
      } catch (e) {
        setError("Activity was not confirmed saved. " + (e as Error).message);
      }
    } else setDemoEvents((es) => [event, ...es].slice(0, 10000));
  }
  async function authenticate(mode: "login" | "register", data: unknown) {
    const response = await accountRequest(mode, "POST", data);
    setUser(response.user);
    await refresh();
    setError("");
  }
  async function logout() {
    await accountRequest("logout", "POST");
    setUser(null);
    setRealEvents([]);
  }
  async function clear() {
    await accountRequest("activity", "DELETE");
    setRealEvents([]);
  }
  async function remove() {
    await accountRequest("profile", "DELETE");
    setUser(null);
    setRealEvents([]);
  }
  return {
    source,
    setSource,
    demoUser,
    setDemoUser,
    demoEvents,
    realEvents,
    user,
    configured,
    error,
    setError,
    record,
    authenticate,
    logout,
    clear,
    remove,
    check,
    reset: () => setDemoEvents(sample()),
  };
}
export type ActivityState = ReturnType<typeof useActivity>;
