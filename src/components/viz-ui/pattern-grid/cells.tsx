import { Fragment } from "react";

import { useGridState } from "./grid-state-context";

export function Cells() {
  const { rowOrder, colOrder } = useGridState()

  return (
    <div
      className='grid size-fit'
      style={{
        gridTemplateColumns: `repeat(${colOrder.length}, 1fr)`,
        gridTemplateRows: `repeat(${rowOrder.length}, 1fr)`
      }}
    >
      {
        rowOrder.map((sh, rowIdx) => (
          <Fragment key={sh}>
            {
              colOrder.map((clr, colIdx) => {
                const cellValue = `bg-${clr}-${sh}`
                return (
                  <button
                    key={`${clr}-${rowIdx}-${colIdx}`}
                    title={cellValue}
                    className={`size-8 border-r border-b ${cellValue}`}
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
