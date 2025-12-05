import { DynamicCodeBlock, DynamicCodeblockProps } from 'fumadocs-ui/components/dynamic-codeblock'
import { cn } from '@/lib/utils'

type props = Omit<DynamicCodeblockProps, "wrapInSuspense" | "codeblock" | "options"> & {
  className?: string
  allowCopy?: boolean
}

export function DynamicCodeExtended({ className, allowCopy = true, ...props }: props) {
  return (
    <DynamicCodeBlock
      {...props}
      wrapInSuspense
      codeblock={{
        className: cn("bg-fd-card", className),
        allowCopy,
      }}
      options={{
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        }
      }}
    />
  )
}
