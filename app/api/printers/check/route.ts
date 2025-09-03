export const runtime = "nodejs";

import { z } from "zod";
import { parseStringPromise } from "xml2js";
import { json, xml } from "@/lib/http/responses";
import { renderPerItemXml, renderOrderXml, renderEmptyXml, type PrintJobImage } from "@/lib/printers/templates";

const PrinterCheckRequestSchema = z.object({
  Name: z.string(),
  ConnectionType: z.enum(["GetRequest", "SetResponse"]),
  ResponseFile: z.string().optional(),
});

type PrinterCheckRequest = z.infer<typeof PrinterCheckRequestSchema>;
type ConnectionType = z.infer<typeof PrinterCheckRequestSchema>["ConnectionType"];

export async function POST(req: Request) {
  const parsed = await parseBody(req);
  if (!parsed.ok) return json(parsed.error, 400);

  const { Name: printerName, ConnectionType: type, ResponseFile } = parsed.data;

  const handlers: Record<ConnectionType, () => Promise<Response>> = {
    GetRequest: async () => handleGetRequest({ printerName }),
    SetResponse: async () => handleSetResponse({ printerName, responseFile: ResponseFile }),
  };

  return handlers[type]();
}

async function handleGetRequest({ printerName }: { printerName: string }) {
  // TODO: Fetch pending jobs for `printerName` and pass as `printJobs`.
  const { template } = getPrinterConfig(printerName);
  const xmlBody = await buildGetRequestXml({ printerName, template });
  return xml(xmlBody);
}

async function handleSetResponse({
  printerName,
  responseFile,
}: {
  printerName: string;
  responseFile?: string;
}) {
  if (!responseFile) return json({ error: "ResponseFile is required for SetResponse" }, 400);

  const jobIds = await parsePrintedJobIds(responseFile);

  // TODO: Mark print jobs as completed for this printer using `jobIds`
  // e.g., await completePrintJobs({ printerName, jobIds })

  return json({ ok: true, printerName, jobIdsCount: jobIds.length });
}

async function buildGetRequestXml({
  printerName,
  template = "PerItem",
  printJobs,
}: {
  printerName: string;
  template?: "PerItem" | "Order";
  printJobs?: PrintJobImage[];
}): Promise<string> {
  if (printJobs && printJobs.length > 0) {
    return template === "Order"
      ? renderOrderXml(printJobs)
      : renderPerItemXml(printJobs);
  }
  // No jobs: return an empty PrintRequestInfo envelope
  return renderEmptyXml();
}

type PrinterTemplate = "PerItem" | "Order";
type PrinterConfig = { template: PrinterTemplate };

function getPrinterConfig(printerName: string): PrinterConfig {
  // TODO: Replace with real lookup (e.g., Convex or DB) per printer
  // Example: return { template: dbTemplateFor(printerName) }
  return { template: "PerItem" };
}

async function parsePrintedJobIds(responseFile: string): Promise<string[]> {
  try {
    const parsedResponseFile = await parseStringPromise(responseFile);
    const prints = parsedResponseFile?.["PrintResponseInfo"]?.["ePOSPrint"] ?? [];
    const jobIds: string[] = [];
    prints.forEach((print: any) => {
      const receiptId = print?.["Parameter"]?.[0]?.["printjobid"]?.[0];
      const isSuccess = print?.["PrintResponse"]?.[0]?.["response"]?.[0]?.["$"]?.["success"];
      if (isSuccess === "true" && typeof receiptId === "string") jobIds.push(receiptId);
    });
    return jobIds;
  } catch (e) {
    console.error("Failed parsing ResponseFile XML", e);
    return [];
  }
}

async function parseBody(req: Request): Promise<
  | { ok: true; data: PrinterCheckRequest }
  | { ok: false; error: unknown }
> {
  try {
    const body = await req.json();
    const parsed = PrinterCheckRequestSchema.safeParse(body);
    if (!parsed.success) return { ok: false, error: { error: "Invalid request", issues: parsed.error.issues } };
    return { ok: true, data: parsed.data };
  } catch (e) {
    return { ok: false, error: { error: "Invalid JSON body", details: String(e) } };
  }
}
