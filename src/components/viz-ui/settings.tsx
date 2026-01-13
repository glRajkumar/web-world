import { Settings2 } from "lucide-react";

import { DialogWrapper } from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";

import { ColorsSystem } from "./color-system";

export function Settings() {
  return (
    <DialogWrapper
      title="Global Settings"
      trigger={
        <Button
          size="icon"
          title="Global Settings"
          variant="outline"
          className="fixed bottom-4 right-4"
        >
          <Settings2 />
        </Button>
      }
      contentCls="sm:max-w-3xl"
      cancel=""
    >
      <ColorsSystem id="global" />
    </DialogWrapper>
  )
}