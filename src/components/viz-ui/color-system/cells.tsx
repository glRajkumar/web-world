import { Fragment } from "react";

import type { bgT } from "@/utils/colors";

import { useExcludedCheck, useGridData, useGridStore } from "./grid-store";
import { cn } from "@/lib/utils";

export function Cells({ id }: { id: string }) {
  const colOrder = useGridData(id, s => s?.colOrder)
  const rowOrder = useGridData(id, s => s?.rowOrder)

  const { isCellExcluded, isColExcluded, isRowExcluded } = useExcludedCheck(id)
  const toggleCell = useGridStore(s => s.toggleCell)

  return (
    <div
      className='grid size-fit'
      style={{
        gridTemplateColumns: `repeat(${colOrder.length}, 1fr)`,
        gridTemplateRows: `repeat(${rowOrder.length}, 1fr)`
      }}
    >
      {
        rowOrder.map(sh => (
          <Fragment key={sh}>
            {
              colOrder.map((clr) => {
                const twc = `bg-${clr}-${sh}` as bgT

                const disabled =
                  isRowExcluded(sh) ||
                  isColExcluded(clr) ||
                  isCellExcluded(clr, sh)

                return (
                  <button
                    key={twc}
                    title={twc}
                    onClick={() => toggleCell(id, twc)}
                    className={cn(
                      "size-8 border-r border-b transition",
                      twc,
                      disabled && "opacity-30 grayscale"
                    )}
                  />
                )
              })
            }
          </Fragment>
        ))
      }
    </div>
  )
}
