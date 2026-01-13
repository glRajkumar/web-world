import { DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"

import { cn } from "@/lib/utils";

import { GridReorder } from './grid-reorder';
import { Settings } from "./settings";
import { Output } from "./output";

type props = {
  id: string
  children?: React.ReactNode
  className?: string
}
export function ColorsSystem({ id, children, className }: props) {
  return (
    <>
      <div className={cn("max-h-[70vh] overflow-y-auto pr-6 -mr-6", className)}>
        <Settings id={id} />
        <GridReorder id={id} />
        <Output id={id} />
      </div>

      {children}
    </>
  )
}

export function ColorsSystemModal({ id }: { id: string }) {
  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
      cancel=""
    >
      <ColorsSystem id={id} />
    </DialogWrapper>
  )
}
