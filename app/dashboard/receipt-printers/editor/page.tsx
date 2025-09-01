"use client"

import CanvasEditor from "@/components/editor/CanvasEditor"

export default function ReceiptPrintersEditorPage() {
  return (
    <div className="space-y-4">
      <CanvasEditor storageKey="rp-editor" width={384} height={800} />
    </div>
  )
}
