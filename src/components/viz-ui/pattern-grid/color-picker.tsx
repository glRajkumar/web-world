import { useRef, useState } from "react"
import { Plus, X } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { Button } from "@/components/shadcn-ui/button"
import { Label } from "@/components/shadcn-ui/label"
import { Input } from "@/components/shadcn-ui/input"

import { DebouncedColorInput } from "@/components/ui/debounced-color-input"

type props = {
  colors: Record<string, string>
  onChange: (k: string, v: string) => void
  onRemove: (k: string) => void
}

export function ColorPicker({ colors, onChange, onRemove }: props) {
  const [newColor, setNewColor] = useState("#000000")
  const [newKey, setNewKey] = useState("")
  const scrollRef = useRef<HTMLSpanElement>(null)

  const addColor = () => {
    if (!newKey.trim() || colors[newKey]) return

    setNewKey("")
    setNewColor("#000000")
    onChange(newKey, newColor)
    setTimeout(() => {
      scrollRef.current?.scrollIntoView()
    }, 100)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">Colors</Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" side="top" align="start">
        <Label className="p-3 text-sm border-b">Custom Color Mappings</Label>

        <div className="no-scroll-bar px-3 py-4 min-h-40 max-h-52 space-y-2 overflow-y-auto">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2">
              <Input
                value={key}
                disabled
              />

              <DebouncedColorInput
                value={color}
                onChange={val => onChange(key, val)}
              />

              <Button
                variant="secondary"
                onClick={() => onRemove(key)}
              >
                <X />
              </Button>
            </div>
          ))}

          <span ref={scrollRef}></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 border-t">
          <Input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="key"
          />

          <DebouncedColorInput
            value={newColor}
            onChange={val => setNewColor(val)}
          />

          <Button size="sm" onClick={addColor}>
            <Plus />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}