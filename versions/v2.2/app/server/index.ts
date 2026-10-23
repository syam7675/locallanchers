import express from "express";
import path from "node:path";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createStore } from "./store.ts";
import { createApi } from "./api.ts";
dotenv.config({ quiet: true });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = process.env.NODE_ENV === "production";
const app = express();
app.disable("x-powered-by");
const server = createHttpServer(app);
const store = createStore(
  path.resolve(root, process.env.DATABASE_PATH || "data/local-lanchers.sqlite"),
);
app.use(
  "/api",
  createApi(store, {
    password: process.env.OPS_PASSWORD,
    accountsEnabled: process.env.ENABLE_USER_ACCOUNTS === "true",
    production,
    publicOrigin: process.env.PUBLIC_ORIGIN,
  }),
);
if (production) {
  app.use(express.static(path.join(root, "dist")));
  app.get("*", (_req, res) => res.sendFile(path.join(root, "dist/index.html")));
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root,
    server: { middlewareMode: true, ws: { server } },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
const argPort = process.argv.indexOf("--port");
const port = Number(
  argPort >= 0 ? process.argv[argPort + 1] : process.env.PORT || 4173,
);
server.listen(port, "0.0.0.0", () =>
  console.log(`Local Lanchers 2.2 listening on port ${port}`),
);
function stop() {
  server.close(() => {
    store.close();
    process.exit(0);
  });
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
