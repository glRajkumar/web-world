import type { FunctionMetadataT } from "@/utils/code-executer/schema"

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

type props = FunctionMetadataT & {
  prefix?: string
  onExecute?: () => void
}
export function FunctionExecuter({ name, params, description, isAsync, prefix = "Function", onExecute = () => { } }: props) {
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
            onClick={onExecute}
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
              />
            ))
          }
        </CardContent>
      }
    </Card>
  )
}
