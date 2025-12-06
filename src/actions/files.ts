import { createServerFn } from '@tanstack/react-start'
import path from 'path'
import fs from 'fs'

import { compileTs } from '@/utils/files'

async function getFileContent(filePath: string) {
  const absolute = path.join(process.cwd(), "src", filePath)
  const code = await fs.promises.readFile(absolute, "utf8")
  return code.trim()
}

export const getContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    return await getFileContent(filePath)
  })

export const getProblemsContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    const testCaseCode = await getFileContent("/test-cases/" + filePath + ".json")
    const tsCode = await getFileContent(filePath + ".ts")
    const jsCode = compileTs(tsCode)

    return {
      testCaseCode,
      tsCode,
      jsCode,
    }
  })
