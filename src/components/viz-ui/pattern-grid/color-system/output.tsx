import { useMemo, useState } from "react";

import { useExcludedCheck, useGridStore } from "./grid-store";
import { type bgT } from "@/utils/colors";
import { cn } from "@/lib/utils";

import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";

export function Output({ id }: { id: string }) {
  const { isCellExcluded, isColExcluded, isRowExcluded } = useExcludedCheck(id)
  const colOrder = useGridStore(s => s.grids?.[id]?.colOrder)
  const rowOrder = useGridStore(s => s.grids?.[id]?.rowOrder)
  const flow = useGridStore(s => s.grids?.[id]?.flow)

  const [col, setCol] = useState(colOrder.length)
  const [row, setRow] = useState(rowOrder.length)

  const list = useMemo(() => {
    const final: bgT[] = []

    if (flow === "row") {
      rowOrder.forEach(sh => {
        if (!isRowExcluded(sh)) {
          colOrder.forEach(clr => {
            if (!isColExcluded(clr)) {
              if (!isCellExcluded(clr, sh)) {
                const twc = `bg-${clr}-${sh}` as bgT
                final.push(twc)
              }
            }
          })
        }
      })
    }
    else {
      colOrder.forEach(clr => {
        if (!isColExcluded(clr)) {
          rowOrder.forEach(sh => {
            if (!isRowExcluded(sh)) {
              if (!isCellExcluded(clr, sh)) {
                const twc = `bg-${clr}-${sh}` as bgT
                final.push(twc)
              }
            }
          })
        }
      })
    }

    return final
  }, [colOrder, rowOrder, flow, isRowExcluded, isColExcluded, isCellExcluded])

  return (
    <>
      <h6 className="mb-4 text-lg font-medium">Output Sample</h6>

      <div className="mb-4 flex items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="row-count" className="shrink-0">Row Count</Label>
          <Input
            id="row-count"
            min={1}
            max={rowOrder.length * colOrder.length}
            type="number"
            value={row}
            onChange={e => setRow(e.target.valueAsNumber)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="col-count" className="shrink-0">Col Count</Label>
          <Input
            id="col-count"
            min={1}
            max={rowOrder.length * colOrder.length}
            type="number"
            value={col}
            onChange={e => setCol(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid w-fit border-l border-t"
          style={{
            gridTemplateColumns: `repeat(${col}, 1fr)`,
            gridTemplateRows: `repeat(${row}, 1fr)`
          }}
        >
          {
            list.map(clr => (
              <span
                key={clr}
                className={cn("size-8 border-r border-b", clr)}
              />
            ))
          }
        </div>
      </div>
    </>
  )
}
