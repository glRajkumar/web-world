import * as Base from 'fumadocs-ui/components/codeblock'
import { cn } from '@/lib/utils'

type CodeBlockAsyncProps = { children: string } & Base.CodeBlockProps

export function CodeBlock({ children, title, className, ...rest }: CodeBlockAsyncProps) {
  return (
    <Base.CodeBlock
      {...rest}
      keepBackground
      title={title}
      className={cn('my-0', className)}
    >
      <Base.Pre className='px-4'>
        {children}
      </Base.Pre>
    </Base.CodeBlock>
  )
}