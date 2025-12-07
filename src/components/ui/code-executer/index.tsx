import { getProblemsContent } from "@/actions/files"

import { FunctionExecuter } from "./function-executer"
import { ClassExecuter } from "./class-executer"

type props = Pick<Awaited<ReturnType<typeof getProblemsContent>>, "filePath" | "executers">

export function CodeExecuter({ filePath, executers }: props) {
  return (
    <div>
      {
        executers.map(ex => {
          if (ex.type === "funtion") {
            return <FunctionExecuter key={ex.name} {...ex} />
          }
          return <ClassExecuter key={ex.name} {...ex} />
        })
      }
    </div>
  )
}
