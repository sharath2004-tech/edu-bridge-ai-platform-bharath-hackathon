"use client"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export function OfflineVideoRefreshPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Can't see your offline videos?</DialogTitle>
        <DialogDescription>
          If you are unable to see the content, please press <b>Ctrl + F5</b> for content.
        </DialogDescription>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setOpen(false)}>
          OK
        </button>
      </DialogContent>
    </Dialog>
  )
}
