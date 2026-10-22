import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export const statuses = ["New", "Reviewing", "Contacted", "Completed"] as const;
export type RequestStatus = (typeof statuses)[number];
import type { AuditInput } from "../shared/audit.ts";
export { validateAudit } from "../shared/audit.ts";
export function createStore(filename: string) {
  if (filename !== ":memory:")
    mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
  db.exec(`CREATE TABLE IF NOT EXISTS audit_requests(id TEXT PRIMARY KEY, idempotency TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New', payload TEXT NOT NULL, notes TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS request_events(id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES audit_requests(id), created_at TEXT NOT NULL, event TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);`);
  const clean = (r: any) =>
    r
      ? {
          id: r.id,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          status: r.status,
          ...JSON.parse(r.payload),
          notes: r.notes,
        }
      : null;
  return {
    db,
    create(input: AuditInput, key: string) {
      const existing = db
        .prepare("SELECT * FROM audit_requests WHERE idempotency=?")
        .get(key);
      if (existing) {
        const { companyWebsite: unused, ...payload } = input;
        if ((existing as any).payload !== JSON.stringify(payload))
          throw Object.assign(
            new Error(
              "The request details changed. Start a new request before resubmitting.",
            ),
            { status: 409 },
          );
        return { request: clean(existing), duplicate: true };
      }
      const id = `LL-${randomUUID()}`;
      const now = new Date().toISOString();
      const { companyWebsite, ...payload } = input;
      db.prepare(
        "INSERT INTO audit_requests(id,idempotency,created_at,updated_at,payload) VALUES(?,?,?,?,?)",
      ).run(id, key, now, now, JSON.stringify(payload));
      db.prepare("INSERT INTO request_events VALUES(?,?,?,?)").run(
        randomUUID(),
        id,
        now,
        "Audit request received",
      );
      return {
        request: clean(
          db.prepare("SELECT * FROM audit_requests WHERE id=?").get(id),
        ),
        duplicate: false,
      };
    },
    list(status = "", query = "") {
      const all = db
        .prepare("SELECT * FROM audit_requests ORDER BY created_at DESC")
        .all()
        .map(clean);
      return all.filter(
        (r: any) =>
          (!status || r.status === status) &&
          (!query ||
            [r.businessName, r.name, r.city, r.id]
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase())),
      );
    },
    update(id: string, status: RequestStatus, notes: string) {
      const before = db
        .prepare("SELECT id FROM audit_requests WHERE id=?")
        .get(id);
      if (!before) return null;
      const now = new Date().toISOString();
      db.prepare(
        "UPDATE audit_requests SET status=?,notes=?,updated_at=? WHERE id=?",
      ).run(status, notes, now, id);
      db.prepare("INSERT INTO request_events VALUES(?,?,?,?)").run(
        randomUUID(),
        id,
        now,
        `Status updated to ${status}`,
      );
      return clean(
        db.prepare("SELECT * FROM audit_requests WHERE id=?").get(id),
      );
    },
    close() {
      db.close();
    },
  };
}
export type Store = ReturnType<typeof createStore>;
