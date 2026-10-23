export const activityLabels = {
  login: "Signed in",
  enquiry_updated: "Updated an example enquiry",
  enquiry_added: "Added an example enquiry",
  review_saved: "Saved a practice review draft",
  onboarding_updated: "Updated the practice checklist",
  workspace_viewed: "Opened a workspace section",
} as const;
export type ActivityKind = keyof typeof activityLabels;
export type ActivityEvent = {
  id: string;
  userId: string;
  kind: ActivityKind;
  at: string;
};
export const activityDay = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
export function activityDays(
  events: ActivityEvent[],
  range: number,
  now = new Date(),
) {
  const end = Date.parse(activityDay(now) + "T00:00:00Z");
  const counts = new Map<string, number>();
  for (const e of events) {
    const date = new Date(e.at);
    if (Number.isFinite(date.getTime())) {
      const day = activityDay(date);
      counts.set(day, (counts.get(day) || 0) + 1);
    }
  }
  return Array.from({ length: range }, (_, i) => {
    const date = new Date(end - (range - 1 - i) * 86400000)
      .toISOString()
      .slice(0, 10);
    return { date, count: counts.get(date) || 0 };
  });
}
export function activityBand(count: number) {
  return count === 0
    ? "Quiet · 0"
    : count <= 2
      ? "Light · 1–2"
      : count <= 5
        ? "Steady · 3–5"
        : count <= 9
          ? "Active · 6–9"
          : "Busy · 10+";
}
