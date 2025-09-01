"use client"

import CanvasEditor from "@/components/editor/CanvasEditor"

export default function LabelPrintersEditorPage() {
  return (
    <div className="space-y-4">
      <CanvasEditor storageKey="lp-editor" width={320} height={240} />
    </div>
  )
}
