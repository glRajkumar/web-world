import { useState } from "react"

import type { functionMetadataT } from "@/utils/code-executer/schema"
import { getFnOrCls } from "@/utils/code-executer/extractor"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card"
import { InputWrapper } from "@/components/shadcn-ui/field-wrapper"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"

type props = functionMetadataT & {
  prefix?: string
  onExecute?: (args: any[]) => void
}
export function FunctionExecuter({ name, params, description, isAsync, prefix = "Function", onExecute = () => { } }: props) {
  const [values, setValues] = useState(params?.reduce((prev: any, curr) => {
    prev[curr.name] = curr.constraints?.defaultValue
    return prev
  }, {}))

  function onChange(key: string, value: string | number) {
    setValues((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <Card className="mb-4 gap-4">
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>
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
            className="border"
            onClick={() => onExecute(Object.values(values))}
          >
            Execute
          </Button>
        </CardAction>
      </CardHeader>

      {
        params && params?.length > 0 &&
        <CardContent className="space-y-4">
          {
            params?.map(param => (
              <InputWrapper
                key={param.name}
                name={param.name}
                label={param.name}
                type={param.pType}
                value={values[param.name]}
                onChange={e => {
                  const val = param.pType === "number" ? e.target.valueAsNumber : e.target.value
                  onChange(param.name, val)
                }}
              />
            ))
          }
        </CardContent>
      }
    </Card>
  )
}

export function FunctionExecuterWrapper({ filePath, ...rest }: Omit<props, "onExecute"> & { filePath: string }) {
  const executeFunction = async (args: any[]) => {
    const fn = await getFnOrCls(filePath, rest.name)
    const result = fn(...args)
    console.log(result)
  }

  return (
    <FunctionExecuter
      {...rest}
      onExecute={executeFunction}
    />
  )
}