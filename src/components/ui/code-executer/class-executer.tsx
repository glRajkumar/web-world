import { useRef } from "react"

import type { classMetadataT } from "@/utils/code-executer/schema"
import { getFnOrCls } from "@/utils/code-executer/extractor"

import { UseLogs } from "./use-logs"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"
import { Results } from "./results"

export function ClassExecuter({ name, construct, methods, description, filePath }: classMetadataT & { filePath: string }) {
  const { logs, addLog, clearLogs } = UseLogs()
  const ref = useRef<any>(null)

  async function init(args: any[]) {
    try {
      const fn = await getFnOrCls(filePath, name)
      const result = new (fn as any)(...args)
      ref.current = result

      addLog({
        name: `Constructor: ${name}`,
        input: args,
        output: "Instance created successfully",
      })

    } catch (error) {
      addLog({
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
      addLog({
        name: `Method: ${name}`,
        input: args,
        output: result
      })

    } catch (error) {
      addLog({
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

      <Results
        logs={logs}
        onClear={clearLogs}
      />
    </div>
  )
}
