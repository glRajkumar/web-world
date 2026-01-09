import { useId, useState, useMemo } from "react"
import { Settings, X } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { SelectWrapper } from "@/components/shadcn-ui/select"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"
import { cn } from "@/lib/utils"

type baseProps = {
  items: string | (string | number)[]
  showIndex?: boolean
} & (
    | ({
      size: number
      rowSize?: never
      colSize?: never
    })
    | ({
      size?: never
      rowSize: number
      colSize: number
    })
  )

function strToArr(str: string) {
  const splited = str.split("\n")
  const max = Math.max(...splited.map(i => i.length))

  return splited.reduce<string[]>((acc, row) => {
    const chars = row.split("")

    const missing = max - chars.length
    for (let i = 0; i < missing; i++) {
      chars.push("")
    }

    acc.push(...chars)
    return acc
  }, [])
}

type CellSize = "small" | "compact" | "large"

const sizeClasses: Record<CellSize, string> = {
  small: "size-6",
  compact: "size-10 p-1",
  large: "size-16",
}

type props = {
  cellSize?: CellSize
  showBorder?: boolean
  showValues?: boolean
  colorOverrides?: Record<string, string>
  enableColors?: boolean
}
export function PatternGrid({ items, showIndex = true, ...rest }: baseProps & props) {
  const row = (rest.size || rest.rowSize)!
  const col = (rest.size || rest.colSize)!
  const total = row * col

  const itemsSplited = typeof items === "string" ? strToArr(items) : items
  const list = itemsSplited.length !== total ? [...itemsSplited, ...Array(total - itemsSplited.length).fill("")] : itemsSplited

  const cellSize = rest.cellSize || "large"
  const showBorder = rest.showBorder ?? true
  const showValues = rest.showValues ?? true
  const enableColors = rest.enableColors ?? false
  const colorOverrides = rest.colorOverrides as Record<string, string> | undefined

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
          const value = list[i]
          const valueKey = String(value)

          const getPalette = (num: number) => {
            const out: string[] = []
            const golden = 137.50776405003785
            for (let k = 0; k < num; k++) {
              const h = Math.round((k * golden) % 360)
              const s = 65 + (k % 5) * 4
              const l = 48 + (k % 4) * 4
              out.push(`hsl(${h} ${s}% ${l}%)`)
            }
            return out
          }

          const DEFAULT_PALETTE = getPalette(100)

          const resolvedColor = (() => {
            if (!enableColors) return undefined
            if (colorOverrides && colorOverrides[valueKey]) return colorOverrides[valueKey]
            const num = Number(value)
            if (!Number.isNaN(num)) {
              return DEFAULT_PALETTE[(Math.abs(num) - 1) % DEFAULT_PALETTE.length]
            }
            let h = 0
            for (let j = 0; j < valueKey.length; j++) {
              h = (h << 5) - h + valueKey.charCodeAt(j)
              h |= 0
            }
            const idx = Math.abs(h) % DEFAULT_PALETTE.length
            return DEFAULT_PALETTE[idx]
          })()

          const textColor = (() => {
            if (!resolvedColor) return undefined
            const m = /hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(resolvedColor)
            if (m) {
              const l = Number(m[3])
              return l > 60 ? "#000" : "#fff"
            }
            return "#000"
          })()

          return (
            <div
              className={cn(
                "flex items-center justify-center border relative",
                !showBorder && "border-transparent",
                sizeClasses[cellSize as CellSize],
                cellSize === "compact" && showIndex && "items-end justify-end"
              )}
              key={i}
              style={resolvedColor ? { background: resolvedColor, color: textColor } : undefined}
            >
              {
                showIndex && cellSize !== "small" &&
                <span className="text-xs absolute top-0.5 left-1 text-muted-foreground">
                  {i}
                </span>
              }

              <span hidden={!showValues} className="font-medium leading-none">{value}</span>
            </div>
          )
        })
      }
    </div>
  )
}

export function PatternGridWithSettings(props: baseProps) {
  const [showBorder, setShowBorder] = useState(true)
  const [cellSize, setCellSize] = useState<CellSize>("large")
  const [show, setShow] = useState(props.showIndex ?? true)
  const [showValues, setShowValues] = useState(true)
  const [enableColors, setEnableColors] = useState(false)
  const [colorRows, setColorRows] = useState<Array<{ key: string; color: string }>>([])
  const id = useId()
  const colorOverrides = useMemo(() => {
    const out: Record<string, string> = {}
    colorRows.forEach(r => {
      const k = String(r.key).trim()
      if (!k) return
      out[k] = r.color
    })
    return out
  }, [colorRows])

  return (
    <div className="flex flex-wrap items-end gap-2">
      <PatternGrid
        {...props}
        showIndex={show}
        cellSize={cellSize}
        showBorder={showBorder}
        showValues={showValues}
        enableColors={enableColors}
        colorOverrides={colorOverrides}
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
            <Checkbox id={id} checked={show} onCheckedChange={() => setShow(p => !p)} />
            <Label htmlFor={id}>Show Indices</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-border`} checked={showBorder} onCheckedChange={() => setShowBorder(s => !s)} />
            <Label htmlFor={`${id}-border`} className="text-sm">Show cell borders</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-values`} checked={showValues} onCheckedChange={() => setShowValues(s => !s)} />
            <Label htmlFor={`${id}-values`}>Show Values</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-colors`} checked={enableColors} onCheckedChange={() => setEnableColors(s => !s)} />
            <Label htmlFor={`${id}-colors`}>Enable Cell Colors</Label>
          </div>
        </PopoverContent>
      </Popover>

      {enableColors && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">Colors</Button>
          </PopoverTrigger>

          <PopoverContent className="w-64" side="top" align="start">
            <div className="space-y-2">
              <Label className="text-sm">Custom Color Mappings</Label>
              {colorRows.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={r.key}
                    onChange={e => setColorRows(prev => prev.map((p, i) => i === idx ? { ...p, key: e.target.value } : p))}
                    placeholder="key"
                    className="w-24 rounded border p-1 text-sm"
                  />
                  <input
                    type="color"
                    value={r.color}
                    onChange={e => setColorRows(prev => prev.map((p, i) => i === idx ? { ...p, color: e.target.value } : p))}
                    className="w-10 h-8 p-0 border rounded"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setColorRows(prev => prev.filter((_, i) => i !== idx))}>
                    <X />
                  </Button>
                </div>
              ))}

              <div>
                <Button size="sm" onClick={() => setColorRows(prev => [...prev, { key: "", color: "#000000" }])}>+ Add color</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
