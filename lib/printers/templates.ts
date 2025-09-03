export type PrintJobImage = {
  id: string;
  height: number;
  image: string; // base64 image content
  // Additional fields can be added and referenced via {{field}}
};

export function renderPerItemXml(printJobs: PrintJobImage[]): string {
  const items = (printJobs || [])
    .map((job) => perItemBlock(job))
    .join("\n");
  return `<PrintRequestInfo Version="2.00">\n${items}\n</PrintRequestInfo>`;
}

export function renderOrderXml(printJobs: PrintJobImage[]): string {
  const items = (printJobs || [])
    .map((job) => orderBlock(job))
    .join("\n");
  return `<PrintRequestInfo Version=\"2.00\">\n${items}\n</PrintRequestInfo>`;
}

export function renderEmptyXml(): string {
  return `<PrintRequestInfo Version="2.00">\n</PrintRequestInfo>`;
}

function perItemBlock(job: PrintJobImage): string {
  const id = xmlEscape(job.id);
  const height = String(job.height ?? 0);
  const image = xmlEscape(job.image);
  return `  <ePOSPrint>
    <Parameter>
      <devid>local_printer</devid>
      <timeout>3600000</timeout>
      <printjobid>${id}</printjobid>
    </Parameter>
    <PrintData>
      <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
        <image align="center" width="470" height="${height}" color="color_1" mode="mono">${image}</image>
        <feed line="2" />
        <cut type="feed" />
      </epos-print>
    </PrintData>
  </ePOSPrint>`;
}

function orderBlock(job: PrintJobImage): string {
  const id = xmlEscape(job.id);
  const height = String(job.height ?? 0);
  const image = xmlEscape(job.image);
  return `  <ePOSPrint>
    <Parameter>
      <devid>local_printer</devid>
      <timeout>90000</timeout>
      <printjobid>${id}</printjobid>
    </Parameter>
    <PrintData>
      <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
        <image align="center" width="575" height="${height}" color="color_1" mode="mono">${image}</image>
        <text smooth="true"/>
        <feed line="2" />
        <cut type="feed" />
      </epos-print>
    </PrintData>
  </ePOSPrint>`;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
