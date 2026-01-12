
import { useGridState } from "./grid-state-context";

import { SelectWrapper } from "@/components/shadcn-ui/select";
import { Label } from "@/components/shadcn-ui/label";

export function Settings() {
  const { flow, updateFlow } = useGridState()

  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        <Label htmlFor="flow-order">Flow Order</Label>
        <SelectWrapper
          value={flow}
          onValueChange={updateFlow}
          triggerCls="w-28"
          options={[
            { value: "row", label: "Color" },
            { value: "col", label: "Shade" }
          ]}
        />
      </div>
    </>
  )
}
