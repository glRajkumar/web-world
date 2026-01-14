import { useRef } from "react"
import { toast } from "sonner"

import { captureConsole } from "@/utils/code-executer/console-capture"
import { getFnOrCls } from "@/utils/code-executer/helper"

import { useLogs } from "./use-logs"
import { cn } from "@/lib/utils"

import { CardWrapper } from "@/components/shadcn-ui/card"

import { FunctionExecuter } from "./function-executer"
import { Results } from "./results"

type props = classMetadataT & { filePath: string, contentCls?: string }
export function ClassExecuter({ name, construct, methods, description, filePath, contentCls = "max-h-[620px]" }: props) {
  const logs = useLogs()
  const ref = useRef<any>(null)

  async function init(orderedArgs: any[], input: Record<string, primOrArrOrObjT>) {
    const { consoleLogs, restore } = captureConsole()

    try {
      const fn = await getFnOrCls(filePath, name)
      const result = new (fn as any)(...orderedArgs)
      ref.current = result

      logs.addLog({
        input,
        name: `Constructor: ${name}`,
        output: "Instance created successfully",
        consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined
      })

    } catch (error: any) {
      logs.addLog({
        input,
        name: `Constructor: ${name}`,
        output: "",
        error: error?.message || "Unknown error",
        consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined
      })
    } finally {
      restore()
    }
  }

  const executeMethod = async (name: string, orderedArgs: any[], input: Record<string, primOrArrOrObjT>) => {
    const { consoleLogs, restore } = captureConsole()

    try {
      if (!ref.current) {
        restore()
        return toast.error("Initiate class before executing methods")
      }

      const result = await ref.current[name](...orderedArgs)

      logs.addLog({
        input,
        name: `Method: ${name}`,
        output: result,
        consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined
      })

    } catch (error: any) {
      logs.addLog({
        input,
        name: `Method: ${name}`,
        output: "",
        error: error?.message || "Unknown error",
        consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined
      })
    } finally {
      restore()
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      <CardWrapper
        title={`Class: ${name}`}
        description={description}
        wrapperCls="mb-4"
        contentCls={cn("overflow-y-auto", contentCls)}
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
                contentCls="max-h-none"
                onExecute={(a: any, b: any) => executeMethod(param.name, a, b)}
              />
            ))
        }
      </CardWrapper>

      <Results {...logs} />
    </div>
  )
}
