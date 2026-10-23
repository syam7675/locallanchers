import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { randomUUID } from "node:crypto";
import { createStore } from "../server/store.ts";
import { createApi } from "../server/api.ts";
import { activityDays, activityBand, activityDay } from "../shared/activity.ts";
async function fixture(
  fn: (base: string, store: ReturnType<typeof createStore>) => Promise<void>,
  enabled = true,
) {
  const store = createStore(":memory:");
  const app = express();
  app.use("/api", createApi(store, { accountsEnabled: enabled }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((r) => server.on("listening", r));
  try {
    await fn(`http://127.0.0.1:${(server.address() as any).port}`, store);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
    store.close();
  }
}
const call = (
  base: string,
  path: string,
  method = "GET",
  body?: unknown,
  cookie = "",
) =>
  fetch(base + "/api/account/" + path, {
    method,
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: body ? JSON.stringify(body) : undefined,
  });
const profile = (email = "owner@example.test") => ({
  name: "Test Owner",
  email,
  password: "test-only-secret-123",
  consent: true,
});
const cookie = (r: Response) => r.headers.get("set-cookie")!.split(";")[0];
test("real accounts fail closed when disabled", () =>
  fixture(async (b) => {
    assert.equal((await call(b, "register", "POST", profile())).status, 503);
    assert.deepEqual(await (await call(b, "session")).json(), {
      configured: false,
      user: null,
    });
  }, false));
test("registration validates consent and password, stores hash, sets private cookie", () =>
  fixture(async (b, db) => {
    assert.equal(
      (await call(b, "register", "POST", { ...profile(), consent: false }))
        .status,
      400,
    );
    assert.equal(
      (await call(b, "register", "POST", { ...profile(), password: "short" }))
        .status,
      400,
    );
    const r = await call(b, "register", "POST", profile());
    assert.equal(r.status, 201);
    assert.match(r.headers.get("set-cookie")!, /HttpOnly/);
    assert.match(r.headers.get("set-cookie")!, /SameSite=Strict/);
    const row = db.db.prepare("SELECT * FROM users").get()!;
    assert.notEqual(row.password_hash, profile().password);
    assert.equal((await r.json()).user.email, profile().email);
    assert.equal((await call(b, "register", "POST", profile())).status, 409);
  }));
test("activity is authenticated, isolated, server dated, idempotent and excludes arbitrary payloads", () =>
  fixture(async (b) => {
    assert.equal((await call(b, "activity")).status, 401);
    const a = cookie(await call(b, "register", "POST", profile()));
    const c = cookie(
      await call(b, "register", "POST", profile("other@example.test")),
    );
    const event = {
      id: randomUUID(),
      kind: "review_saved",
      userId: "forged",
      at: "2000-01-01",
      password: "never-record",
    };
    assert.equal((await call(b, "activity", "POST", event, a)).status, 200);
    await call(b, "activity", "POST", event, a);
    const events = (
      await (await call(b, "activity", "GET", undefined, a)).json()
    ).events;
    assert.equal(events.length, 2);
    assert.equal(events[0].kind, "review_saved");
    assert.ok(!JSON.stringify(events).includes("never-record"));
    assert.ok(!JSON.stringify(events).includes("2000-01-01"));
    assert.equal(
      (await (await call(b, "activity", "GET", undefined, c)).json()).events
        .length,
      1,
    );
    assert.equal(
      (
        await call(
          b,
          "activity",
          "POST",
          { id: randomUUID(), kind: "login" },
          a,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await call(
          b,
          "activity",
          "POST",
          { id: randomUUID(), kind: "arbitrary" },
          a,
        )
      ).status,
      400,
    );
  }));
test("login creates activity; logout revokes session; history and account deletion are isolated", () =>
  fixture(async (b) => {
    const a = cookie(await call(b, "register", "POST", profile()));
    await call(b, "logout", "POST", undefined, a);
    assert.equal((await call(b, "activity", "GET", undefined, a)).status, 401);
    assert.equal(
      (await call(b, "login", "POST", { ...profile(), password: "wrong" }))
        .status,
      401,
    );
    const c = cookie(await call(b, "login", "POST", profile()));
    assert.equal(
      (await (await call(b, "activity", "GET", undefined, c)).json()).events
        .length,
      2,
    );
    await call(b, "activity", "DELETE", undefined, c);
    assert.equal(
      (await (await call(b, "activity", "GET", undefined, c)).json()).events
        .length,
      0,
    );
    await call(b, "profile", "DELETE", undefined, c);
    assert.equal((await call(b, "activity", "GET", undefined, c)).status, 401);
    assert.equal((await call(b, "login", "POST", profile())).status, 401);
  }));
test("cross origin account writes fail", () =>
  fixture(async (b) => {
    const r = await fetch(b + "/api/account/register", {
      method: "POST",
      headers: {
        Origin: "https://other.test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile()),
    });
    assert.equal(r.status, 403);
  }));
test("activity groups by IST midnight, zero fills and excludes outside range", () => {
  const events = [
    {
      id: "a",
      userId: "a",
      kind: "login" as const,
      at: "2026-10-22T19:00:00Z",
    },
    {
      id: "b",
      userId: "a",
      kind: "login" as const,
      at: "2026-10-22T17:00:00Z",
    },
    {
      id: "c",
      userId: "a",
      kind: "login" as const,
      at: "2025-01-01T00:00:00Z",
    },
  ];
  const days = activityDays(events, 2, new Date("2026-10-23T01:00:00Z"));
  assert.deepEqual(days, [
    { date: "2026-10-22", count: 1 },
    { date: "2026-10-23", count: 1 },
  ]);
  assert.equal(activityDay(new Date("2026-10-22T18:29:00Z")), "2026-10-22");
  assert.equal(activityBand(0), "Quiet · 0");
  assert.equal(activityBand(10), "Busy · 10+");
});

test("expired user sessions cannot read or write activity", () => fixture(async (b, store) => {
  const c = cookie(await call(b, "register", "POST", profile()));
  store.db.prepare("UPDATE user_sessions SET expires_at=0").run();
  assert.equal((await call(b, "activity", "GET", undefined, c)).status, 401);
  assert.equal((await call(b, "activity", "POST", {id:randomUUID(),kind:"review_saved"}, c)).status, 401);
}));
test("repeated failed account logins are throttled", () => fixture(async b => {
  for(let i=0;i<8;i++) assert.equal((await call(b,"login","POST",profile())).status,401);
  assert.equal((await call(b,"login","POST",profile())).status,429);
}));
