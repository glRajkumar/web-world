import { Suspense, use } from 'react'
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock'
import * as js from 'js-beautify'
import types from 'typescript'

import { getContent } from '@/actions/get-content'

import { DynamicCodeExtended } from './dynamic-code-extended'

function compileTs(tsCode: string) {
  const result = types.transpileModule(tsCode, {
    compilerOptions: {
      module: types.ModuleKind.ESNext,
      target: types.ScriptTarget.ESNext,
    },
  })

  return js.js_beautify(result.outputText, {
    indent_size: 2,
    space_in_empty_paren: true,
    max_preserve_newlines: 2,
  })
}

function Inner({ promise }: { promise: Promise<string> }) {
  const tsCode = use(promise)
  const jsCode = compileTs(tsCode)

  return (
    <CodeBlockTabs defaultValue="Javascript">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="Javascript">Javascript</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="Typescript">Typescript</CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="Javascript">
        <DynamicCodeExtended
          lang='jsx'
          code={jsCode.trim()}
        />
      </CodeBlockTab>

      <CodeBlockTab value="Typescript">
        <DynamicCodeExtended
          lang='tsx'
          code={tsCode}
        />
      </CodeBlockTab>
    </CodeBlockTabs>
  )
}

export function CodePreview({ path }: { path: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getContent(path)} />
    </Suspense>
  )
}