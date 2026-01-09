import { useId, useState } from "react"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import { Label } from "@/components/shadcn-ui/label"

type props = {
  items: string | (string | number)[]
  showIndex?: boolean
  showIndexToggler?: boolean
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

export function PatternGrid({ items, showIndex = true, showIndexToggler = true, ...rest }: props) {
  const [show, setShow] = useState(showIndexToggler && showIndex)
  const id = useId()

  const row = (rest.size || rest.rowSize)!
  const col = (rest.size || rest.colSize)!
  const total = row * col

  const itemsSplited = typeof items === "string" ? strToArr(items) : items
  const list = itemsSplited.length !== total ? Array(total).fill(1) : itemsSplited

  return (
    <>
      {
        showIndexToggler &&
        <div className="mb-2 flex items-center flex-wrap gap-2">
          <Checkbox id={id} checked={show} onCheckedChange={() => setShow(p => !p)} />
          <Label htmlFor={id}>Show Indices</Label>
        </div>
      }

      <div
        className="grid w-fit border"
        style={{
          gridTemplateRows: `repeat(${row}, 1fr)`,
          gridTemplateColumns: `repeat(${col}, 1fr)`,
        }}
      >
        {
          list.map((_, i) => (
            <div className="py-6 px-7 border relative" key={i}>
              {
                show &&
                <span className="text-xs absolute top-0.5 left-1 text-muted-foreground">
                  {i}
                </span>
              }

              <span className="font-medium">{itemsSplited[i]}</span>
            </div>
          ))
        }
      </div>
    </>
  )
}
