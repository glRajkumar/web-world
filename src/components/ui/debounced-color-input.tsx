import { ChangeEvent, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/shadcn-ui/input"

type props = {
  value: string
  onChange: (value: string) => void
  className?: string
  debounceMs?: number
}

export function DebouncedColorInput({
  value,
  onChange,
  className = '',
  debounceMs = 150
}: props) {
  const [draftValue, setDraftValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDraftValue(newValue)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue)
      timeoutRef.current = null
    }, debounceMs)
  }

  return (
    <Input
      type="color"
      value={draftValue}
      onChange={handleChange}
      className={cn("w-12 shrink-0 p-1", className)}
    />
  )
}
