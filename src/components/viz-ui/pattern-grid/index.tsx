import { CSSProperties, useId, useState } from "react"
import { Settings } from "lucide-react"

import { type CellSize, sizeClasses, strToArr } from "./util"
import { getColorTone, twBgClrs } from "@/utils/colors"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { SelectWrapper } from "@/components/shadcn-ui/select"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"

import { ColorPicker } from "./color-picker"
import { ColorSystem } from "./color-system"

type baseProps = {
  items: string | (string | number)[]
  cellSize?: CellSize
  showIndex?: boolean
  showBorder?: boolean
  showValues?: boolean
  enableColors?: boolean
} & (
    | ({ size: number; rowSize?: never; colSize?: never })
    | ({ size?: never; rowSize: number; colSize: number })
  )

export function PatternGrid({
  items, colors, showIndex = true, cellSize = "large",
  showBorder = true, showValues = true, enableColors = false,
  ...rest
}: baseProps & { colors?: Record<string, string> }) {
  const row = (rest.size || rest.rowSize)!
  const col = (rest.size || rest.colSize)!
  const total = row * col

  const itemsSplited = typeof items === "string" ? strToArr(items) : items
  const list = itemsSplited.length !== total ? [...itemsSplited, ...Array(total - itemsSplited.length).fill("")] : itemsSplited

  const bgClrs = enableColors ? list.reduce<Record<string, string>>((prev, curr) => {
    const val = `${curr}`.trim()
    if (!val) return prev

    if (!prev[val]) {
      const len = Object.keys(prev).length
      prev[val] = colors?.[val] ? "bg-[var(--bg-clr)]" : twBgClrs[len]
    }
    return prev
  }, {}) : {}

  return (
    <div
      className="grid border"
      style={{
        gridTemplateRows: `repeat(${row}, 1fr)`,
        gridTemplateColumns: `repeat(${col}, 1fr)`,
      }}
    >
      {
        list.map((_, i) => {
          const val = `${list[i]}`.trim()
          const txtTone = colors?.[val]
            ? getColorTone(colors?.[val])
            : bgClrs[val] ? Number(bgClrs[val].match(/\d+/)?.[0]) > 400 ? "dark" : "" : ""

          const txtClr = txtTone === "dark" ? "text-white" : ""
          const indTxt = txtTone === "dark" ? "text-white/60" : "text-black/60"

          return (
            <div
              key={i}
              className={cn(
                "flex items-center justify-center border relative",
                !showBorder && "border-transparent",
                sizeClasses[cellSize as CellSize],
                cellSize === "compact" && showIndex && "items-end justify-end",
                bgClrs[val],
                txtClr
              )}
              style={colors?.[val] ? { "--bg-clr": colors?.[val] } as CSSProperties : {}}
            >
              {
                showIndex && cellSize !== "small" &&
                <span className={cn("text-xs absolute top-0.5 left-1", indTxt)}>{i}</span>
              }

              <span className={cn("font-medium leading-none", !showValues && "hidden")}>{val}</span>
            </div>
          )
        })
      }
    </div>
  )
}

export function PatternGridWithSettings(props: baseProps) {
  const [enableColors, setEnableColors] = useState(props.enableColors ?? false)
  const [showBorder, setShowBorder] = useState(props.showBorder ?? true)
  const [showValues, setShowValues] = useState(props.showValues ?? true)
  const [showIndex, setShowIndex] = useState(props.showIndex ?? true)
  const [cellSize, setCellSize] = useState<CellSize>(props.cellSize || "large")
  const [colors, setColors] = useState<Record<string, string>>({})
  const id = useId()

  function onChangeClr(key: string, val: string) {
    setColors(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const onRemoveClr = (key: string) => {
    setColors(prev => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <PatternGrid
        {...props}
        colors={colors}
        cellSize={cellSize}
        showIndex={showIndex}
        showBorder={showBorder}
        showValues={showValues}
        enableColors={enableColors}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-48 space-y-4" side="top" align="start">
          <div>
            <Label htmlFor={`${id}-cell`} className="text-sm">Cell Size</Label>
            <SelectWrapper
              id={`${id}-cell`}
              value={cellSize}
              onValueChange={v => setCellSize(v as CellSize)}
              options={["small", "compact", "large"]}
              itemCls="capitalize"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={id} checked={showIndex} onCheckedChange={() => setShowIndex(p => !p)} />
            <Label htmlFor={id}>Show Indices</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-values`} checked={showValues} onCheckedChange={() => setShowValues(s => !s)} />
            <Label htmlFor={`${id}-values`}>Show Values</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-border`} checked={showBorder} onCheckedChange={() => setShowBorder(s => !s)} />
            <Label htmlFor={`${id}-border`} className="text-sm">Show cell borders</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-colors`} checked={enableColors} onCheckedChange={() => setEnableColors(s => !s)} />
            <Label htmlFor={`${id}-colors`}>Enable Cell Colors</Label>
          </div>
        </PopoverContent>
      </Popover>

      {enableColors &&
        <ColorPicker
          colors={colors}
          onChange={onChangeClr}
          onRemove={onRemoveClr}
        />
      }

      <ColorSystem />
    </div>
  )
}
