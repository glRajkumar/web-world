import { DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"

import { ColorsGrid } from "./colors-grid"

export function ColorSystem() {
  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
    >
      <ColorsGrid />
    </DialogWrapper>
  )
}
