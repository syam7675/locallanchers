export default function handler(
  _req: unknown,
  res: { status: (code: number) => { json: (body: unknown) => void } },
) {
  return res.status(200).json({ authenticated: false, configured: false });
}
