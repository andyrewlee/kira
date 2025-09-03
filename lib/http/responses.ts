export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function xml(xmlString: string, status = 200): Response {
  const length = Buffer.byteLength(xmlString, "utf-8").toString();
  return new Response(xmlString, {
    status,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Length": length,
      "Cache-Control": "no-store",
    },
  });
}

