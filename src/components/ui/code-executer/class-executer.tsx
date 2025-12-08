import { useRef, useState } from "react"

import type { classMetadataT } from "@/utils/code-executer/schema"
import { getFnOrCls } from "@/utils/code-executer/extractor"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"

export function ClassExecuter({ name, construct, methods, description, filePath }: classMetadataT & { filePath: string }) {
  const [initialised, setInitialised] = useState(false)
  const ref = useRef<any>(null)

  async function init(args: any[]) {
    const fn = await getFnOrCls(filePath, name)
    const result = new (fn as any)(...args)
    ref.current = result
  }

  const executeMethod = async (name: string, args: any[]) => {
    const result = ref.current[name](...args)
    console.log(result)
  }

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
          onExecute={init}
        />
      }

      {
        methods?.map(param => (
          <FunctionExecuter
            key={param.name}
            prefix="Method"
            {...param}
            onExecute={a => executeMethod(param.name, a)}
          />
        ))
      }
    </CardWrapper>
  )
}
