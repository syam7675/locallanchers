// The public design demo never accepts or stores personal information.
export default function handler(
  req: { url?: string; method?: string },
  res: { status: (code: number) => any; json: (body: unknown) => void },
) {
  const path = (req.url || "").split("?")[0];
  if (req.method === "GET" && path === "/api/health")
    return res
      .status(200)
      .json({
        ok: true,
        version: "2.1.0",
        mode: "public-demo",
        requestStorage: null,
        operationsConfigured: false,
      });
  if (req.method === "GET" && path === "/api/ops/session")
    return res.status(200).json({ authenticated: false, configured: false });
  return res
    .status(503)
    .json({
      error:
        "This is an interactive preview. Audit submissions and private operations will open when hosted storage is connected.",
    });
}
