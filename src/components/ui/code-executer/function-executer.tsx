import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { generateZodSchema } from "@/utils/code-executer/schema"
import { getDefaultValues } from '@/utils/code-executer/get-default'
import { getFnOrCls } from "@/utils/code-executer/extractor"

import { useLogs } from './use-logs'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"

import { FieldRenderer } from "./params"
import { Results } from './results'

type props = functionMetadataT & {
  prefix?: string
  onExecute?: (orderedArgs: any[], data: Record<string, primOrArrOrObjT>) => void
}
export function FunctionExecuter({ name, params, description, isAsync, prefix = "Function", onExecute = () => { } }: props) {
  const hasParams = params && params.length > 0
  const schema = hasParams ? generateZodSchema(params) : z.object({})

  const methods = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: hasParams ? getDefaultValues(params) : {}
  })

  function handleSubmit(data: any) {
    onExecute(params?.map(p => data[p?.name]) as any, data)
  }

  return (
    <Card className="mb-4 gap-4">
      <CardHeader className="flex items-center justify-between flex-wrap">
        <div className="space-y-1">
          <CardTitle className='flex items-center gap-2'>
            {prefix && <span className="font-medium">{prefix}: </span>}
            {name}
            {isAsync && <Badge>Async</Badge>}
          </CardTitle>

          {description && <CardDescription>{description}</CardDescription>}
        </div>

        <CardAction>
          <Button
            size="sm"
            variant="secondary"
            className="h-auto py-1 border text-xs rounded-sm"
            onClick={methods.handleSubmit(handleSubmit)}
          >
            Execute
          </Button>
        </CardAction>
      </CardHeader>

      {
        params && params?.length > 0 &&
        <CardContent className="space-y-4">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className='space-y-4 [&_[role="group"]]:gap-1'
            >
              {params.map((param) => (
                <FieldRenderer
                  key={param.name}
                  label={param.name}
                  {...param}
                />
              ))}
            </form>
          </FormProvider>
        </CardContent>
      }
    </Card>
  )
}

export function FunctionExecuterWrapper({ filePath, ...rest }: Omit<props, "onExecute"> & { filePath: string }) {
  const logs = useLogs()

  const executeFunction = async (orderedArgs: any[], input: Record<string, primOrArrOrObjT>) => {
    try {
      const fn = await getFnOrCls(filePath, rest.name)
      const result = fn(...orderedArgs)

      logs.addLog({
        input,
        output: result
      })

    } catch (error) {
      logs.addLog({
        input,
        output: "",
        error: JSON.stringify(error),
      })
    }
  }

  return (
    <div className='grid sm:grid-cols-2 gap-4'>
      <FunctionExecuter
        {...rest}
        onExecute={executeFunction}
      />

      <Results {...logs} />
    </div>
  )
}