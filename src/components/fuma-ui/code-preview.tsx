import { Suspense, use } from 'react'
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock'
import { createServerFn } from '@tanstack/react-start'
import types from 'typescript'
import path from 'path'
import fs from 'fs'

import { CodeBlock } from './code-block-extended'

const getContent = createServerFn({ method: 'GET' })
  .inputValidator((filePath: string) => filePath)
  .handler(async ({ data: filePath }) => {
    const absolute = path.join(process.cwd(), filePath)
    const code = await fs.promises.readFile(absolute, "utf8")
    return code
  })

function compileTs(tsCode: string) {
  const result = types.transpileModule(tsCode, {
    compilerOptions: {
      module: types.ModuleKind.ESNext,
      target: types.ScriptTarget.ESNext,
    }
  })

  return result.outputText
}

type props = {
  path: string
}

export function Inner({ promise }: { promise: Promise<string> }) {
  const tsCode = use(promise)
  const jsCode = compileTs(tsCode)

  return (
    <CodeBlockTabs defaultValue="Javascript">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="Javascript">Javascript</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="Typescript">Typescript</CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="Javascript">
        <Suspense fallback={"Loading..."}>
          <CodeBlock lang='jsx'>
            {jsCode}
          </CodeBlock>
        </Suspense>
      </CodeBlockTab>

      <CodeBlockTab value="Typescript">
        <Suspense fallback={"Loading..."}>
          <CodeBlock lang='tsx'>
            {tsCode}
          </CodeBlock>
        </Suspense>
      </CodeBlockTab>
    </CodeBlockTabs>
  )
}

export function CodePreview({ path: filePath }: props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getContent({ data: filePath })} />
    </Suspense>
  )
}