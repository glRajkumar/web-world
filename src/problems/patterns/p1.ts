import { createServerFn } from '@tanstack/react-start'
import path from 'path'
import fs from 'fs'

const getContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    const absolute = path.join(process.cwd(), filePath)
    const code = await fs.promises.readFile(absolute, "utf8")
    return code
  })
