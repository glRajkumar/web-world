import { useRef } from "react"
import { toast } from "sonner"

import { getFnOrCls } from "@/utils/code-executer/extractor"

import { useLogs } from "./use-logs"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"
import { Results } from "./results"

export function ClassExecuter({ name, construct, methods, description, filePath }: classMetadataT & { filePath: string }) {
  const logs = useLogs()
  const ref = useRef<any>(null)

  async function init(orderedArgs: any[], input: Record<string, primOrArrOrObjT>) {
    try {
      const fn = await getFnOrCls(filePath, name)
      const result = new (fn as any)(...orderedArgs)
      ref.current = result

      logs.addLog({
        input,
        name: `Constructor: ${name}`,
        output: "Instance created successfully",
      })

    } catch (error) {
      logs.addLog({
        input,
        name: `Constructor: ${name}`,
        output: "",
        error: JSON.stringify(error),
      })
    }
  }

  const executeMethod = async (name: string, orderedArgs: any[], input: Record<string, primOrArrOrObjT>) => {
    try {
      if (!ref.current) {
        return toast.error("Initiate class before executing methods")
      }

      const result = await ref.current[name](...orderedArgs)

      logs.addLog({
        input,
        name: `Method: ${name}`,
        output: result
      })

    } catch (error) {
      logs.addLog({
        input,
        name: `Method: ${name}`,
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
            onExecute={init}
            prefix=""
          />
        }

        {
          methods
            ?.filter(p => !p.name.startsWith("#"))
            ?.map(param => (
              <FunctionExecuter
                {...param}
                key={param.name}
                prefix="Method"
                onExecute={(a: any, b: any) => executeMethod(param.name, a, b)}
              />
            ))
        }
      </CardWrapper>

      <Results {...logs} />
    </div>
  )
}
