import { DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"

import { ColorsGrid } from "./colors-grid"

export function ColorSystem() {
  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
    >
      <Label>Colors Available</Label>

      <div className="overflow-x-auto">
        <ColorsGrid />
      </div>
    </DialogWrapper>
  )
}
