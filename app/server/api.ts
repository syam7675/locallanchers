import express from "express";
import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import {
  validateAudit,
  statuses,
  type Store,
  type RequestStatus,
} from "./store.ts";
export function createApi(
  store: Store,
  options: {
    password?: string;
    production?: boolean;
    publicOrigin?: string;
    rateLimit?: number;
  } = {},
) {
  const router = express.Router();
  router.use(express.json({ limit: "16kb" }));
  const buckets = new Map<string, { count: number; until: number }>();
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  const expected =
    options.password && options.password.length >= 12
      ? scryptSync(options.password, "local-lanchers-ops", 32)
      : null;
  router.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.get("origin")) {
      const expectedOrigin =
        options.publicOrigin || `${req.protocol}://${req.get("host")}`;
      if (req.get("origin") !== expectedOrigin) {
        res.status(403).json({ error: "This request origin is not allowed." });
        return;
      }
    }
    next();
  });
  function limit(kind: string, max: number): express.RequestHandler {
    return (req, res, next) => {
      const key = `${kind}:${req.ip}`;
      const now = Date.now();
      if (buckets.size > 5000)
        for (const [k, v] of buckets) if (v.until < now) buckets.delete(k);
      let b = buckets.get(key);
      if (!b || b.until < now) {
        b = { count: 0, until: now + 15 * 60_000 };
        buckets.set(key, b);
      }
      if (++b.count > max) {
        res.setHeader("Retry-After", Math.ceil((b.until - now) / 1000));
        res
          .status(429)
          .json({ error: "Too many attempts. Please try again later." });
        return;
      }
      next();
    };
  }
  const token = (req: express.Request) => {
    const raw = req.headers.cookie
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("ll_session="))
      ?.slice(11);
    return raw && /^[a-f0-9]{64}$/.test(raw) ? raw : "";
  };
  const authorized = (req: express.Request) => {
    const t = token(req);
    if (!t) return false;
    const r = store.db
      .prepare("SELECT expires_at FROM sessions WHERE token_hash=?")
      .get(hash(t));
    return !!r && Number(r.expires_at) > Date.now();
  };
  const protect: express.RequestHandler = (req, res, next) => {
    if (!authorized(req)) {
      res.status(401).json({ error: "Sign in to the operations desk." });
      return;
    }
    next();
  };
  router.get("/health", (_req, res) =>
    res.json({
      ok: true,
      version: "2.1.0",
      requestStorage: "sqlite",
      operationsConfigured: !!expected,
      integrations: {
        whatsapp: false,
        google: false,
        booking: false,
        ai: false,
      },
    }),
  );
  router.post("/audits", limit("audit", options.rateLimit ?? 8), (req, res) => {
    const { value, errors } = validateAudit(req.body);
    if (!value) {
      res
        .status(400)
        .json({ error: "Please check your request details.", errors });
      return;
    }
    const key = req.get("Idempotency-Key");
    if (!key || !/^[a-zA-Z0-9-]{16,100}$/.test(key)) {
      res
        .status(400)
        .json({
          error:
            "A valid request identifier is required. Please refresh and retry.",
        });
      return;
    }
    const result = store.create(value, key);
    res
      .status(result.duplicate ? 200 : 201)
      .json({
        ok: true,
        reference: result.request.id,
        createdAt: result.request.createdAt,
        status: result.request.status,
        message:
          "Your audit request has been saved. A consultation is not booked until the team confirms a time.",
      });
  });
  router.post("/ops/login", limit("login", 5), (req, res) => {
    if (!expected) {
      res
        .status(503)
        .json({
          error:
            "The operations desk is not configured. Set OPS_PASSWORD to a strong password of at least 12 characters on the server.",
        });
      return;
    }
    const pw = typeof req.body?.password === "string" ? req.body.password : "";
    if (
      pw.length > 256 ||
      !timingSafeEqual(scryptSync(pw, "local-lanchers-ops", 32), expected)
    ) {
      res.status(401).json({ error: "The password was not recognized." });
      return;
    }
    const t = randomBytes(32).toString("hex");
    const duration = 8 * 60 * 60 * 1000;
    store.db.prepare("DELETE FROM sessions WHERE expires_at<?").run(Date.now());
    store.db
      .prepare("INSERT INTO sessions VALUES(?,?)")
      .run(hash(t), Date.now() + duration);
    res.cookie("ll_session", t, {
      httpOnly: true,
      sameSite: "strict",
      secure: !!options.production,
      maxAge: duration,
      path: "/api/ops",
    });
    res.json({ ok: true });
  });
  router.get("/ops/session", (req, res) =>
    res.json({ authenticated: authorized(req), configured: !!expected }),
  );
  router.post("/ops/logout", (req, res) => {
    store.db
      .prepare("DELETE FROM sessions WHERE token_hash=?")
      .run(hash(token(req)));
    res.clearCookie("ll_session", {
      path: "/api/ops",
      httpOnly: true,
      sameSite: "strict",
      secure: !!options.production,
    });
    res.json({ ok: true });
  });
  router.get("/ops/requests", protect, (req, res) =>
    res.json({
      requests: store.list(
        String(req.query.status || ""),
        String(req.query.q || "").slice(0, 200),
      ),
    }),
  );
  router.patch("/ops/requests/:id", protect, (req, res) => {
    const status = req.body?.status;
    const notes = req.body?.notes;
    if (
      !statuses.includes(status) ||
      typeof notes !== "string" ||
      notes.length > 2000
    ) {
      res
        .status(400)
        .json({
          error:
            "Choose a valid status and use 2,000 characters or fewer for notes.",
        });
      return;
    }
    const updated = store.update(req.params.id, status as RequestStatus, notes);
    if (!updated) {
      res.status(404).json({ error: "Request not found." });
      return;
    }
    res.json({ request: updated });
  });
  router.use((_req, res) =>
    res.status(404).json({ error: "API route not found." }),
  );
  router.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err?.status === 409) {
        res
          .status(409)
          .json({
            error:
              "This request was already saved with different details. Start a new request before resubmitting.",
          });
        return;
      }
      const bad =
        err?.type === "entity.parse.failed" || err?.type === "entity.too.large";
      res
        .status(bad ? 400 : 500)
        .json({
          error: bad
            ? "The request body is invalid or too large."
            : "Your request could not be saved. Please try again. No confirmation has been issued.",
        });
    },
  );
  return router;
}
