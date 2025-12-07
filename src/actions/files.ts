import { createServerFn } from '@tanstack/react-start'
import path from 'path'
import fs from 'fs'

import { loadMetadata } from '@/utils/code-executer/loaders'
import { compileTs } from '@/utils/ts-help'

async function getFileContent(filePath: string) {
  const absolute = path.join(process.cwd(), 'src', filePath)
  const code = await fs.promises.readFile(absolute, 'utf8')
  return code.trim()
}

export const getContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => await getFileContent(filePath))

export const getProblemsContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    const tsCode = await getFileContent(filePath + '.ts')
    const jsCode = compileTs(tsCode)

    const data = await loadMetadata(filePath + '.ts')

    return {
      filePath: `${filePath + '.ts'}`,
      ...data,
      tsCode,
      jsCode,
    }
  })
