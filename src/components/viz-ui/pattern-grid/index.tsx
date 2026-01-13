import { CSSProperties, useMemo, useState } from "react"
import { Settings } from "lucide-react"

import { type CellSize, sizeClasses, strToArr } from "./util"
import { useBgClrs, useGridStore } from "../color-system/grid-store"
import { getColorTone } from "@/utils/colors"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { SelectWrapper } from "@/components/shadcn-ui/select"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"

import { ColorsSystemModal } from "../color-system"
import { ColorPicker } from "./color-picker"

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
  clrSysId = "global", ...rest
}: baseProps & { colors?: Record<string, string>; clrSysId?: string }) {
  const twBgClrs = useBgClrs(clrSysId)
  const row = (rest.size || rest.rowSize)!
  const col = (rest.size || rest.colSize)!

  const list = useMemo(() => {
    const total = row * col
    const itemsSplited = typeof items === "string" ? strToArr(items) : items
    return itemsSplited.length !== total
      ? [...itemsSplited, ...Array(total - itemsSplited.length).fill("")]
      : itemsSplited
  }, [row, col, items])

  const bgClrs = useMemo(() => {
    if (!enableColors) return {}

    return list.reduce<Record<string, string>>((prev, curr) => {
      const val = `${curr}`.trim()
      if (!val) return prev

      if (!prev[val]) {
        const len = Object.keys(prev).length
        prev[val] = colors?.[val] ? "bg-[var(--bg-clr)]" : `${twBgClrs[len]}`
      }
      return prev
    }, {})
  }, [list, enableColors, twBgClrs])

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

export function PatternGridWithSettings(props: baseProps & { id: string }) {
  const remove = useGridStore(s => s.remove)
  const init = useGridStore(s => s.init)

  const [colorSystemType, setColorSystemType] = useState<"global" | "own">("global")
  const [enableColors, setEnableColors] = useState(props.enableColors ?? false)
  const [showBorder, setShowBorder] = useState(props.showBorder ?? true)
  const [showValues, setShowValues] = useState(props.showValues ?? true)
  const [showIndex, setShowIndex] = useState(props.showIndex ?? true)
  const [cellSize, setCellSize] = useState<CellSize>(props.cellSize || "large")
  const [colors, setColors] = useState<Record<string, string>>({})
  const id = props.id

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

  function onChangeClrSysTye(v: "global" | "own") {
    if (v === "global") remove(id)
    else init(id)
    setColorSystemType(v)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <PatternGrid
        {...props}
        clrSysId={colorSystemType === "global" ? "global" : props.id}
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

        <PopoverContent className="w-60 space-y-4" side="top" align="start">
          <div>
            <Label htmlFor={`${id}-cell`} className="mb-0.5 text-sm">Cell Size</Label>
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

          {
            enableColors &&
            <div>
              <Label htmlFor={`${id}-color-system-type`} className="mb-0.5 text-sm">Color System Type</Label>
              <SelectWrapper
                id={`${id}-color-system-type`}
                value={colorSystemType}
                onValueChange={onChangeClrSysTye}
                options={["global", "own"]}
                itemCls="capitalize"
              />

              {
                colorSystemType === "global" &&
                <span className="text-[10px] text-muted-foreground">
                  You can edit color system at global settings
                </span>
              }
            </div>
          }
        </PopoverContent>
      </Popover>

      {
        enableColors &&
        <>
          <ColorPicker
            colors={colors}
            onChange={onChangeClr}
            onRemove={onRemoveClr}
          />

          {
            colorSystemType === "own" &&
            <ColorsSystemModal
              id={id}
            />
          }
        </>
      }
    </div>
  )
}
