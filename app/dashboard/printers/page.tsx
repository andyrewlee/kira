import Link from "next/link"

export default function PrintersPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl">Printers</h1>
      <p className="text-sm text-muted-foreground">Manage and design both receipt and label printers.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border rounded-md p-4">
          <div className="font-medium">Entire Order Printing</div>
          <p className="text-sm text-muted-foreground">Create order-wide layouts, edit templates, and register devices.</p>
          <div className="mt-3 flex gap-2 text-sm">
            <Link href="/dashboard/printers/editor" className="underline">Editor</Link>
            <span>•</span>
            <Link href="/dashboard/printers/templates" className="underline">Templates</Link>
            <span>•</span>
            <Link href="/dashboard/printers/layout" className="underline">Layouts</Link>
            <span>•</span>
            <Link href="/dashboard/printers/register" className="underline">Register</Link>
          </div>
        </div>
        <div className="border rounded-md p-4">
          <div className="font-medium">Per Item Printing</div>
          <p className="text-sm text-muted-foreground">Design per-item labels and use templates for quick starts.</p>
          <div className="mt-3 flex gap-2 text-sm">
            <Link href="/dashboard/printers/editor" className="underline">Editor</Link>
            <span>•</span>
            <Link href="/dashboard/printers/templates" className="underline">Templates</Link>
            <span>•</span>
            <Link href="/dashboard/printers/layout" className="underline">Layouts</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
