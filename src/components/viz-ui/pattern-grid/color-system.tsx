import { Fragment, useState } from "react"
import { X } from "lucide-react"

import { type colorsT, type shadesT, bgT, colors, shades } from "@/utils/colors"
import { cn } from "@/lib/utils"

import { DialogWrapper } from "@/components/shadcn-ui/dialog"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"

export function ColorSystem() {
  const [excludedCells, setExcludedCells] = useState<Set<bgT>>(new Set())
  const [excludedRows, setExcludedRows] = useState<Set<shadesT>>(new Set())
  const [excludedCols, setExcludedCols] = useState<Set<colorsT>>(new Set())

  const isRowExcluded = (shade: shadesT) => excludedRows.has(shade)
  const isColExcluded = (color: colorsT) => excludedCols.has(color)

  const isCellExcluded = (color: colorsT, shade: shadesT) =>
    excludedCells.has(`bg-${color}-${shade}`)

  function toggleCol(color: colorsT) {
    setExcludedCols(prev => {
      const next = new Set(prev)
      next.has(color) ? next.delete(color) : next.add(color)
      return next
    })
  }

  function toggleRow(shade: shadesT) {
    setExcludedRows(prev => {
      const next = new Set(prev)
      next.has(shade) ? next.delete(shade) : next.add(shade)
      return next
    })
  }

  function toggleCell(twc: bgT) {
    setExcludedCells(prev => {
      const next = new Set(prev)
      next.has(twc) ? next.delete(twc) : next.add(twc)
      return next
    })
  }

  return (
    <DialogWrapper
      title="Color System"
      trigger={<Button variant="outline" size="sm">Color System</Button>}
      contentCls="sm:max-w-3xl"
    >
      <Label>Colors Available</Label>
      <div className="overflow-x-auto">
        <div
          className="grid w-fit border-l border-t"
          style={{
            gridTemplateColumns: `repeat(${colors.length + 1}, 1fr)`,
            gridTemplateRows: `repeat(${shades.length + 1}, 1fr)`
          }}
        >
          <span className="size-8 border-r border-b" />

          {colors.map(color => (
            <button
              key={color}
              onClick={() => toggleCol(color)}
              className={cn(
                "size-8 flex items-center justify-center border-r border-b",
                isColExcluded(color) && "line-through opacity-40"
              )}
            >
              <X className="size-4" />
            </button>
          ))}

          {shades.map(shade => (
            <Fragment key={shade}>
              <button
                onClick={() => toggleRow(shade)}
                className={cn(
                  "size-8 flex items-center justify-center border-r border-b",
                  isRowExcluded(shade) && "line-through opacity-40"
                )}
              >
                <X className="size-4" />
              </button>

              {colors.map(color => {
                const twc = `bg-${color}-${shade}` as const
                const disabled =
                  isRowExcluded(shade) ||
                  isColExcluded(color) ||
                  isCellExcluded(color, shade)

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
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </DialogWrapper>
  )
}
