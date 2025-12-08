import { getProblemsContent } from "@/actions/files"

import { FunctionExecuterWrapper } from "./function-executer"
import { ClassExecuter } from "./class-executer"

type props = Pick<Awaited<ReturnType<typeof getProblemsContent>>, "filePath" | "executers">

export function CodeExecuter({ filePath, executers }: props) {
  return (
    <div>
      {
        executers.map(ex => {
          if (ex.type === "funtion") {
            return <FunctionExecuterWrapper key={ex.name} filePath={filePath} {...ex} />
          }
          return <ClassExecuter key={ex.name} filePath={filePath} {...ex} />
        })
      }
    </div>
  )
}
