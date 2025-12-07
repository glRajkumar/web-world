import type { ClassMetadataT } from "@/utils/code-executer/schema"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"

export function ClassExecuter({ name, construct, methods, description }: ClassMetadataT) {
  return (
    <CardWrapper
      title={`Class: ${name}`}
      description={description}
    >
      {
        construct &&
        <FunctionExecuter
          type="funtion"
          name="Constructor"
          params={construct}
          prefix=""
        />
      }

      {
        methods?.map(param => (
          <FunctionExecuter
            key={param.name}
            prefix="Method"
            {...param}
          />
        ))
      }
    </CardWrapper>
  )
}
