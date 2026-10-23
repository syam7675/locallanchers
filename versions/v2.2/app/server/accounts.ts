import express from "express";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import type { Store } from "./store.ts";
import { activityLabels } from "../shared/activity.ts";

export function accountApi(
  store: Store,
  options: { enabled?: boolean; production?: boolean },
  limit: (kind: string, max: number) => express.RequestHandler,
) {
  const r = express.Router();
  const db = store.db;
  db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS user_sessions(token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS user_activity(id TEXT NOT NULL, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, kind TEXT NOT NULL, at TEXT NOT NULL, PRIMARY KEY(user_id,id));
    CREATE INDEX IF NOT EXISTS activity_by_user_date ON user_activity(user_id,at);`);
  const hash = (v: string) => createHash("sha256").update(v).digest("hex");
  const token = (req: express.Request) =>
    req.headers.cookie
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("ll_user="))
      ?.slice(8) || "";
  const user = (req: express.Request) =>
    options.enabled
      ? db
          .prepare(
            "SELECT users.id,users.name,users.email FROM users JOIN user_sessions ON users.id=user_sessions.user_id WHERE token_hash=? AND expires_at>?",
          )
          .get(hash(token(req)), Date.now())
      : undefined;
  const event = (id: string, kind: string, key: string = randomUUID()) => {
    db.prepare("DELETE FROM user_activity WHERE at<?").run(
      new Date(Date.now() - 366 * 86400000).toISOString(),
    );
    db.prepare("INSERT OR IGNORE INTO user_activity VALUES(?,?,?,?)").run(
      key,
      id,
      kind,
      new Date().toISOString(),
    );
  };
  const cookie = {
    httpOnly: true,
    secure: !!options.production,
    sameSite: "strict" as const,
    path: "/api/account",
  };
  const start = (id: string, res: express.Response) => {
    const t = randomBytes(32).toString("hex");
    db.prepare("DELETE FROM user_sessions WHERE expires_at<=?").run(Date.now());
    db.prepare("INSERT INTO user_sessions VALUES(?,?,?)").run(
      hash(t),
      id,
      Date.now() + 8 * 3600000,
    );
    res.cookie("ll_user", t, { ...cookie, maxAge: 8 * 3600000 });
    event(id, "login");
  };
  r.get("/session", (req, res) =>
    res.json({ configured: !!options.enabled, user: user(req) || null }),
  );
  r.use((_req, res, next) => {
    if (!options.enabled) {
      res
        .status(503)
        .json({
          error:
            "Real accounts are not enabled on this preview. Explore the demo profiles instead.",
        });
      return;
    }
    next();
  });
  r.post("/register", limit("account-register", 5), (req, res) => {
    const { name, email, password, consent } = req.body || {};
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 80 ||
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 12 ||
      password.length > 128 ||
      consent !== true
    ) {
      res
        .status(400)
        .json({
          error:
            "Enter a name, a valid email and a password of 12–128 characters, and agree to activity recording.",
        });
      return;
    }
    const normalized = email.trim().toLowerCase();
    if (db.prepare("SELECT id FROM users WHERE email=?").get(normalized)) {
      res
        .status(409)
        .json({
          error:
            "Account could not be created. Try signing in with your existing details.",
        });
      return;
    }
    const id = randomUUID(),
      salt = randomBytes(16).toString("hex");
    db.prepare("INSERT INTO users VALUES(?,?,?,?,?,?)").run(
      id,
      name.trim(),
      normalized,
      salt,
      scryptSync(password, salt, 32).toString("hex"),
      new Date().toISOString(),
    );
    start(id, res);
    res
      .status(201)
      .json({ user: { id, name: name.trim(), email: normalized } });
  });
  r.post("/login", limit("account-login", 8), (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const pw = typeof req.body?.password === "string" ? req.body.password : "";
    if (email.length > 254 || pw.length > 128) {
      res.status(400).json({ error: "Check your sign-in details." });
      return;
    }
    const u = db.prepare("SELECT * FROM users WHERE email=?").get(email);
    const computed = scryptSync(
      pw,
      String(u?.salt || "unregistered-account-timing-salt"),
      32,
    );
    if (
      !u ||
      !timingSafeEqual(computed, Buffer.from(String(u.password_hash), "hex"))
    ) {
      res.status(401).json({ error: "Email or password was not recognized." });
      return;
    }
    start(String(u.id), res);
    res.json({ user: { id: u.id, name: u.name, email: u.email } });
  });
  r.post("/logout", (req, res) => {
    db.prepare("DELETE FROM user_sessions WHERE token_hash=?").run(
      hash(token(req)),
    );
    res.clearCookie("ll_user", cookie);
    res.json({ ok: true });
  });
  r.use((req, res, next) => {
    if (!user(req)) {
      res.status(401).json({ error: "Sign in to view your activity." });
      return;
    }
    next();
  });
  r.get("/activity", (req, res) =>
    res.json({
      events: db
        .prepare(
          "SELECT id,user_id AS userId,kind,at FROM user_activity WHERE user_id=? AND at>=? ORDER BY at DESC",
        )
        .all(
          user(req)!.id,
          new Date(Date.now() - 366 * 86400000).toISOString(),
        ),
    }),
  );
  r.post("/activity", limit("account-activity", 240), (req, res) => {
    const { kind, id } = req.body || {};
    if (
      typeof kind !== "string" ||
      kind === "login" ||
      !Object.hasOwn(activityLabels, kind) ||
      typeof id !== "string" ||
      !/^[a-f0-9-]{36}$/.test(id)
    ) {
      res.status(400).json({ error: "Invalid activity event." });
      return;
    }
    event(String(user(req)!.id), kind, id);
    res.json({ ok: true });
  });
  r.delete("/activity", (req, res) => {
    db.prepare("DELETE FROM user_activity WHERE user_id=?").run(user(req)!.id);
    res.json({ ok: true });
  });
  r.delete("/profile", (req, res) => {
    db.prepare("DELETE FROM users WHERE id=?").run(user(req)!.id);
    res.clearCookie("ll_user", cookie);
    res.json({ ok: true });
  });
  return r;
}
