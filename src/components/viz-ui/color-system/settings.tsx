
import { colors, colorsT, shades, shadesT } from "@/utils/colors";
import { flowT, useGridData, useGridStore } from "./grid-store";

import { SelectWrapper } from "@/components/shadcn-ui/select";
import { Label } from "@/components/shadcn-ui/label";

export function Settings({ id }: { id: string }) {
  const colorsStart = useGridData(id, s => s?.colorsStart)
  const shadesStart = useGridData(id, s => s?.shadesStart)
  const flow = useGridData(id, s => s?.flow)

  const updateColorsStart = useGridStore(s => s.updateColorsStart)
  const updateShadesStart = useGridStore(s => s.updateShadesStart)
  const updateFlow = useGridStore(s => s.updateFlow)

  return (
    <>
      <h6 className="mb-2 text-lg font-medium">Colors system settings</h6>

      <div className="flex items-center flex-wrap gap-8 mb-2">
        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Colors start</Label>
          <SelectWrapper
            value={colorsStart}
            onValueChange={v => updateColorsStart(id, v as colorsT)}
            triggerCls="w-28"
            contentCls="max-h-96"
            options={colors.map(c => ({ value: c, label: c }))}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Shades Start</Label>
          <SelectWrapper
            value={shadesStart}
            onValueChange={v => updateShadesStart(id, v as shadesT)}
            triggerCls="w-28"
            options={shades.map(s => ({ value: s, label: s }))}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Label htmlFor="flow-order">Flow Order</Label>
          <SelectWrapper
            value={flow}
            onValueChange={v => updateFlow(id, v as flowT)}
            triggerCls="w-28"
            options={[
              { value: "row", label: "Color" },
              { value: "col", label: "Shade" }
            ]}
          />
        </div>
      </div>
    </>
  )
}
