export const runtime = "nodejs";

import { z } from "zod";
import { json } from "@/lib/http/responses";

const PrintStatusSchema = z.object({
  Name: z.string(),
  Status: z.string(), // XML payload as string
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (e) {
    return json({ error: "Invalid JSON body", details: String(e) }, 400);
  }

  const parsed = PrintStatusSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Invalid request", issues: parsed.error.issues }, 400);
  }

  // const { Name: printerName, Status } = parsed.data;

  // TODO: Use `printerName` to look up the printer and update its status from `Status` (XML).

  return json({ ok: true });
}
