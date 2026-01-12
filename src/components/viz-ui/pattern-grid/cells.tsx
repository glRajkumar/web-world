import { Fragment } from "react";

import type { bgT } from "@/utils/colors";

import { useGridState } from "./grid-state-context";
import { cn } from "@/lib/utils";

export function Cells() {
  const {
    rowOrder, colOrder,
    isCellExcluded, isColExcluded, isRowExcluded,
    toggleCell,
  } = useGridState()

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
                    onClick={() => toggleCell(twc)}
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
