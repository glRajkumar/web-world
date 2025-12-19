import { useState } from 'react'
import { Trash2, CheckCircle, XCircle, AlertCircle, Trash, Minimize, Expand } from 'lucide-react'

import { useLogs } from './use-logs'

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
        <strong className="text-gray-700">Input:</strong>
        <button
          onClick={() => setIsMaximised(p => !p)}
          className='cursor-pointer'
          title={isMaximised ? "" : "Get detailed input data"}
        >
          {isMaximised ? <Minimize className='size-3' /> : <Expand className='size-3' />}
        </button>
      </div>

      <div className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
        {
          isMaximised
            ? <DetailedInputs input={input} />
            : <MiniLog input={input} />
        }
      </div>
    </div>
  )
}

type props = ReturnType<typeof useLogs>
export function Results({ logs, clearById, clearLogs }: props) {
  if (logs.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="text-center py-8 text-gray-500">
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

      <CardContent className="space-y-3 max-h-[620px] overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border ${log?.error
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
              }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {
                log?.error
                  ? <XCircle className="h-5 w-5 text-red-600" />
                  : <CheckCircle className="h-5 w-5 text-green-600" />
              }

              {log.name && <span className="font-semibold">{log.name}</span>}

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
              <InputLog input={log.input} />

              {log.error ? (
                <div>
                  <strong className="text-red-700">Error:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto text-red-600">
                    {log.error}
                  </pre>
                </div>
              ) : (
                <div>
                  <strong className="text-gray-700">Output:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(log.output, null, 2)}
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