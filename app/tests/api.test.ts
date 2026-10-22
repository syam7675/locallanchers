import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import express from "express";
import { randomUUID } from "node:crypto";
import { createStore, validateAudit } from "../server/store.ts";
import { createApi } from "../server/api.ts";
const good = {
  name: "Test Owner",
  businessName: "Test Business",
  email: "owner@example.test",
  phone: "",
  vertical: "Dental clinics",
  city: "Hyderabad",
  website: "https://example.test",
  challenge: "Improve enquiry follow-up",
  plan: "Growth",
  contactPermission: true,
  marketingConsent: false,
  companyWebsite: "",
};
async function fixture(
  options: Parameters<typeof createApi>[1] = {
    password: "test-only-password-123456",
  },
) {
  const store = createStore(":memory:");
  const app = express();
  app.use("/api", createApi(store, options));
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((r) => server.on("listening", r));
  const address = server.address() as { port: number };
  const base = `http://127.0.0.1:${address.port}`;
  return {
    store,
    base,
    async close() {
      await new Promise<void>((r) => server.close(() => r()));
      store.close();
    },
  };
}
async function withServer(
  fn: (f: Awaited<ReturnType<typeof fixture>>) => Promise<void>,
  options?: Parameters<typeof createApi>[1],
) {
  const f = await fixture(options);
  try {
    await fn(f);
  } finally {
    await f.close();
  }
}
const post = (
  base: string,
  url: string,
  data: unknown,
  extra: Record<string, string> = {},
) =>
  fetch(base + url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extra },
    body: JSON.stringify(data),
  });
async function signIn(base: string) {
  const r = await post(base, "/api/ops/login", {
    password: "test-only-password-123456",
  });
  assert.equal(r.status, 200);
  return r.headers.get("set-cookie")!.split(";")[0];
}
test("a valid request is saved before a minimal confirmation is returned", () =>
  withServer(async ({ base, store }) => {
    const r = await post(base, "/api/audits", good, {
      "Idempotency-Key": randomUUID(),
    });
    assert.equal(r.status, 201);
    const b = await r.json();
    assert.match(b.reference, /^LL-/);
    assert.equal(b.status, "New");
    assert.equal(b.email, undefined);
    assert.equal(store.list().length, 1);
    assert.equal(store.list()[0].email, good.email);
    assert.match(b.message, /not booked/);
  }));
test("reply permission is required; refusal does not save a record", () =>
  withServer(async ({ base, store }) => {
    const r = await post(
      base,
      "/api/audits",
      { ...good, contactPermission: false },
      { "Idempotency-Key": randomUUID() },
    );
    assert.equal(r.status, 400);
    assert.equal(store.list().length, 0);
    assert.ok((await r.json()).errors.contactPermission);
  }));
test("email-only contact is accepted without requiring marketing opt-in", () => {
  const r = validateAudit(good);
  assert.ok(r.value);
  assert.equal(r.value.marketingConsent, false);
});
test("phone-only contact is accepted with valid international number", () =>
  assert.ok(
    validateAudit({ ...good, email: "", phone: "+91 90000 00000" }).value,
  ));
test("missing reply channels are rejected", () =>
  assert.ok(validateAudit({ ...good, email: "", phone: "" }).errors.email));
test("invalid email, phone and website are rejected independently", () => {
  assert.ok(validateAudit({ ...good, email: "not-an-email" }).errors.email);
  assert.ok(validateAudit({ ...good, phone: "hello!" }).errors.phone);
  assert.ok(
    validateAudit({ ...good, website: "javascript:alert(1)" }).errors.website,
  );
});
test("non-objects and arrays do not bypass validation", () => {
  for (const x of [null, [], 123, "test"])
    assert.ok(Object.keys(validateAudit(x).errors).length > 0);
});
test("length limits and honeypot are enforced", () => {
  assert.ok(validateAudit({ ...good, name: "a".repeat(101) }).errors.name);
  assert.ok(validateAudit({ ...good, companyWebsite: "spam" }).errors.form);
});
test("idempotent retry returns the same reference and saves once", () =>
  withServer(async ({ base, store }) => {
    const key = randomUUID();
    const a = await post(base, "/api/audits", good, { "Idempotency-Key": key });
    const b = await post(base, "/api/audits", good, { "Idempotency-Key": key });
    assert.equal(b.status, 200);
    assert.equal((await a.json()).reference, (await b.json()).reference);
    assert.equal(store.list().length, 1);
  }));
test("an idempotency key cannot acknowledge changed request details", () =>
  withServer(async ({ base, store }) => {
    const key = randomUUID();
    await post(base, "/api/audits", good, { "Idempotency-Key": key });
    const b = await post(
      base,
      "/api/audits",
      { ...good, businessName: "Different business" },
      { "Idempotency-Key": key },
    );
    assert.equal(b.status, 409);
    assert.equal(store.list()[0].businessName, good.businessName);
  }));
test("missing idempotency key is rejected", () =>
  withServer(async ({ base }) =>
    assert.equal((await post(base, "/api/audits", good)).status, 400),
  ));
test("audit requests are durably available after reopening the database", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ll-storage-"));
  try {
    let s = createStore(path.join(dir, "requests.sqlite"));
    const req = s.create(good, randomUUID()).request;
    s.close();
    s = createStore(path.join(dir, "requests.sqlite"));
    assert.equal(s.list()[0].id, req.id);
    assert.equal(s.list()[0].contactPermission, true);
    s.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("private request records reject anonymous reads and writes", () =>
  withServer(async ({ base }) => {
    assert.equal((await fetch(base + "/api/ops/requests")).status, 401);
    assert.equal(
      (
        await fetch(base + "/api/ops/requests/unknown", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      ).status,
      401,
    );
  }));
test("unconfigured operations access fails closed", () =>
  withServer(
    async ({ base }) => {
      assert.equal(
        (await post(base, "/api/ops/login", { password: "anything" })).status,
        503,
      );
      assert.equal(
        (await (await fetch(base + "/api/ops/session")).json()).configured,
        false,
      );
    },
    { password: "" },
  ));
test("wrong password cannot create a session", () =>
  withServer(async ({ base }) => {
    const r = await post(base, "/api/ops/login", { password: "incorrect" });
    assert.equal(r.status, 401);
    assert.equal(r.headers.get("set-cookie"), null);
  }));
test("login cookie is HTTP-only and same-site strict", () =>
  withServer(async ({ base }) => {
    const r = await post(base, "/api/ops/login", {
      password: "test-only-password-123456",
    });
    const cookie = r.headers.get("set-cookie") || "";
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Strict/);
    assert.match(cookie, /Path=\/api\/ops/);
  }));
test("authorized operator can review and persist request status and notes", () =>
  withServer(async ({ base, store }) => {
    const req = store.create(good, randomUUID()).request;
    const cookie = await signIn(base);
    const r = await fetch(base + "/api/ops/requests", {
      headers: { Cookie: cookie },
    });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).requests.length, 1);
    const u = await fetch(base + `/api/ops/requests/${req.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        status: "Contacted",
        notes: "Test follow-up agreed",
      }),
    });
    assert.equal(u.status, 200);
    assert.equal(store.list()[0].status, "Contacted");
    assert.equal(store.list()[0].notes, "Test follow-up agreed");
  }));
test("operator updates reject invalid states and nonexistent requests", () =>
  withServer(async ({ base }) => {
    const cookie = await signIn(base);
    const patch = (body: unknown) =>
      fetch(base + "/api/ops/requests/missing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify(body),
      });
    assert.equal((await patch({ status: "Booked", notes: "" })).status, 400);
    assert.equal((await patch({ status: "Reviewing", notes: "" })).status, 404);
  }));
test("logout invalidates the previous session token", () =>
  withServer(async ({ base }) => {
    const cookie = await signIn(base);
    await post(base, "/api/ops/logout", {}, { Cookie: cookie });
    assert.equal(
      (await fetch(base + "/api/ops/requests", { headers: { Cookie: cookie } }))
        .status,
      401,
    );
  }));
test("cross-site submission origin is rejected", () =>
  withServer(async ({ base }) => {
    const r = await post(base, "/api/audits", good, {
      "Idempotency-Key": randomUUID(),
      Origin: "https://untrusted.example",
    });
    assert.equal(r.status, 403);
  }));
test("malformed JSON produces a controlled failure", () =>
  withServer(async ({ base }) => {
    const r = await fetch(base + "/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal(r.status, 400);
    assert.ok((await r.json()).error);
  }));
test("rate limit prevents repeated requests beyond the configured allowance", () =>
  withServer(
    async ({ base }) => {
      await post(base, "/api/audits", good, {
        "Idempotency-Key": randomUUID(),
      });
      const r = await post(base, "/api/audits", good, {
        "Idempotency-Key": randomUUID(),
      });
      assert.equal(r.status, 429);
      assert.ok(r.headers.get("retry-after"));
    },
    { rateLimit: 1 },
  ));

test("a storage failure does not issue a false confirmation", () =>
  withServer(async ({ base, store }) => {
    store.db.exec("PRAGMA query_only=ON");
    const r = await post(base, "/api/audits", good, {
      "Idempotency-Key": randomUUID(),
    });
    assert.equal(r.status, 500);
    const body = await r.json();
    assert.equal(body.reference, undefined);
    assert.match(body.error, /could not be saved/);
    assert.equal(store.list().length, 0);
  }));

test("an expired session cannot read private records", () =>
  withServer(async ({ base, store }) => {
    const cookie = await signIn(base);
    store.db.exec("UPDATE sessions SET expires_at=0");
    assert.equal(
      (await fetch(base + "/api/ops/requests", { headers: { Cookie: cookie } }))
        .status,
      401,
    );
  }));

test("production sessions set the Secure cookie flag", () =>
  withServer(
    async ({ base }) => {
      const r = await post(base, "/api/ops/login", {
        password: "test-only-password-123456",
      });
      assert.match(r.headers.get("set-cookie") || "", /; Secure/);
    },
    { password: "test-only-password-123456", production: true },
  ));
