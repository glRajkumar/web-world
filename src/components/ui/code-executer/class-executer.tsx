import { useRef } from "react"

import { getFnOrCls } from "@/utils/code-executer/extractor"

import { useLogs } from "./use-logs"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"
import { Results } from "./results"

export function ClassExecuter({ name, construct, methods, description, filePath }: classMetadataT & { filePath: string }) {
  const logs = useLogs()
  const ref = useRef<any>(null)

  async function init(args: any[]) {
    try {
      const fn = await getFnOrCls(filePath, name)
      const result = new (fn as any)(...args)
      ref.current = result

      logs.addLog({
        name: `Constructor: ${name}`,
        input: args,
        output: "Instance created successfully",
      })

    } catch (error) {
      logs.addLog({
        name: `Constructor: ${name}`,
        input: args,
        output: "",
        error: JSON.stringify(error),
      })
    }
  }

  const executeMethod = async (name: string, args: any[]) => {
    try {
      const result = await ref.current[name](...args)
      console.log(result)
      logs.addLog({
        name: `Method: ${name}`,
        input: args,
        output: result
      })

    } catch (error) {
      logs.addLog({
        name: `Method: ${name}`,
        input: args,
        output: "",
        error: JSON.stringify(error),
      })
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      <CardWrapper
        title={`Class: ${name}`}
        description={description}
        wrapperCls="mb-4"
      >
        {
          construct &&
          <FunctionExecuter
            type="function"
            name="Constructor"
            params={construct}
            prefix=""
            onExecute={init}
          />
        }

        {
          methods
            ?.filter(p => !p.name.startsWith("#"))
            ?.map(param => (
              <FunctionExecuter
                key={param.name}
                prefix="Method"
                {...param}
                onExecute={(a: any) => executeMethod(param.name, a)}
              />
            ))
        }
      </CardWrapper>

      <Results {...logs} />
    </div>
  )
}
