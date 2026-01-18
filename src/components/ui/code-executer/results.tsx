import { useEffect, useRef, useState } from 'react'
import { Trash2, CheckCircle, XCircle, AlertCircle, Trash, Minimize, Expand } from 'lucide-react'

import { outputText } from '@/utils/code-executer/output'
import { useLogs } from './use-logs'
import { cn } from '@/lib/utils'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'

type inputProps = {
  input: Record<string, primOrArrOrObjT>
}
function DetailedInputs({ input }: inputProps) {
  return Object.keys(input).map(key => (
    <div key={key} className='flex items-start flex-wrap gap-x-1 gap-y-0.5 mb-1.5'>
      <span>{key} :</span>
      {typeof input[key] === "object" && input[key] !== null
        ? <pre className='w-full'>{JSON.stringify(input[key], null, 2)}</pre>
        : <span>{`${input[key]}`}</span>
      }
    </div>
  ))
}

function MiniLog({ input }: inputProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {
        Object.keys(input).map((key, i, arr) => {
          if (typeof input[key] === "object" && input[key] !== null) {
            return <pre key={key} className='w-full'>{JSON.stringify(input[key], null, 2)}{i < arr.length - 1 && ", "}</pre>
          }

          return <span key={key}>{`${input[key]}`}{i < arr.length - 1 && ", "}</span>
        })
      }
    </div>
  )
}

function InputLog({ input }: inputProps) {
  const [isMaximised, setIsMaximised] = useState(false)

  return (
    <div>
      <div className='flex items-center justify-between gap-2'>
        <strong className="text-zinc-700 dark:text-zinc-300">Input:</strong>
        <button
          onClick={() => setIsMaximised(p => !p)}
          className='cursor-pointer'
          title={isMaximised ? "" : "Get detailed input data"}
        >
          {isMaximised ? <Minimize className='size-3' /> : <Expand className='size-3' />}
        </button>
      </div>

      <div className="mt-1 p-2 bg-white dark:bg-zinc-800 rounded border dark:border-zinc-700 text-xs overflow-x-auto">
        {
          isMaximised
            ? <DetailedInputs input={input} />
            : <MiniLog input={input} />
        }
      </div>
    </div>
  )
}

type props = ReturnType<typeof useLogs> & {
  contentCls?: string
}
export function Results({ logs, contentCls = "max-h-[620px]", clearById, clearLogs }: props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logs.length > 1) {
      const el = scrollRef.current
      if (!el) return

      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [logs.length])

  if (logs.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No execution results yet</p>
          <p className="text-sm">Execute functions to see results here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4 gap-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Execution Results</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={clearLogs}
          className='text-xs'
        >
          <Trash2 className="h-2 w-2" />
          Clear All
        </Button>
      </CardHeader>

      <CardContent
        ref={scrollRef}
        className={cn("space-y-3 overflow-y-auto", contentCls)}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn("p-3 rounded-lg border", log?.error
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {
                log?.error
                  ? <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  : <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              }

              {log.name && <span className="font-semibold dark:text-zinc-100">{log.name}</span>}

              <Button
                size="icon"
                variant="ghost"
                onClick={() => clearById(log.id)}
                className='size-auto p-1 ml-auto hover:bg-destructive hover:text-white'
              >
                <Trash />
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              {Object.keys(log.input).length > 0 && <InputLog input={log.input} />}

              {log.consoleLogs && log.consoleLogs.length > 0 && (
                <div>
                  <strong className="text-zinc-700 dark:text-zinc-300">Console Logs:</strong>
                  <pre className="mt-1 p-2 bg-white dark:bg-zinc-800 rounded border dark:border-zinc-700 text-xs overflow-x-auto">
                    {log.consoleLogs.join('\n')}
                  </pre>
                </div>
              )}

              {log.error ? (
                <div>
                  <strong className="text-red-700 dark:text-red-400">Error:</strong>
                  <pre className="mt-1 p-2 bg-white dark:bg-zinc-800 rounded border dark:border-zinc-700 text-xs overflow-x-auto text-red-600 dark:text-red-400">
                    {log.error}
                  </pre>
                </div>
              ) : (
                <div>
                  <strong className="text-zinc-700 dark:text-zinc-300">Output:</strong>
                  <pre className="mt-1 p-2 bg-white dark:bg-zinc-800 rounded border dark:border-zinc-700 text-xs overflow-x-auto">
                    {outputText(log.output) ?? "No data found"}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}