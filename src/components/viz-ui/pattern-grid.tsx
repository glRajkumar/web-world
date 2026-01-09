import { useId, useState } from "react"
import { Settings } from "lucide-react"

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

export function PatternGrid({ items, showIndex = true, ...rest }: baseProps & { cellSize?: CellSize; showBorder?: boolean }) {
  const row = (rest.size || rest.rowSize)!
  const col = (rest.size || rest.colSize)!
  const total = row * col

  const itemsSplited = typeof items === "string" ? strToArr(items) : items
  const list = itemsSplited.length !== total ? Array(total).fill(1) : itemsSplited

  const cellSize = (rest as any).cellSize || "large"
  const showBorder = (rest as any).showBorder ?? true

  return (
    <div
      className="grid border"
      style={{
        gridTemplateRows: `repeat(${row}, 1fr)`,
        gridTemplateColumns: `repeat(${col}, 1fr)`,
      }}
    >
      {
        list.map((_, i) => (
          <div
            className={cn(
              "flex items-center justify-center border relative",
              !showBorder && "border-transparent",
              sizeClasses[cellSize as CellSize],
              cellSize === "compact" && showIndex && "items-end justify-end"
            )}
            key={i}
          >
            {
              showIndex && cellSize !== "small" &&
              <span className="text-xs absolute top-0.5 left-1 text-muted-foreground">
                {i}
              </span>
            }

            <span className="font-medium leading-none">{itemsSplited[i]}</span>
          </div>
        ))
      }
    </div>
  )
}

export function PatternGridWithSettings(props: baseProps) {
  const [showBorder, setShowBorder] = useState(true)
  const [cellSize, setCellSize] = useState<CellSize>("large")
  const [show, setShow] = useState(props.showIndex ?? true)
  const id = useId()

  return (
    <div className="flex flex-wrap items-end gap-2">
      <PatternGrid
        {...props}
        showIndex={show}
        cellSize={cellSize}
        showBorder={showBorder}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-48" side="top" align="start">
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

          <div className="my-4 flex items-center gap-2">
            <Checkbox id={id} checked={show} onCheckedChange={() => setShow(p => !p)} />
            <Label htmlFor={id}>Show Indices</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-border`} checked={showBorder} onCheckedChange={() => setShowBorder(s => !s)} />
            <Label htmlFor={`${id}-border`} className="text-sm">Show cell borders</Label>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
