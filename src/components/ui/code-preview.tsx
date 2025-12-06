import { Suspense, use } from 'react'

import { beautify_js, compileTs } from '@/utils/files'
import { getContent } from '@/actions/files'

import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock'
import { DynamicCodeExtended } from '@/components/fuma-ui/dynamic-code-extended'

export function CodePreviewUI({ jsCode, tsCode }: { jsCode: string, tsCode: string }) {
  return (
    <CodeBlockTabs defaultValue="Javascript">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="Javascript">Javascript</CodeBlockTabsTrigger>
        <CodeBlockTabsTrigger value="Typescript">Typescript</CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="Javascript">
        <DynamicCodeExtended
          lang='jsx'
          code={beautify_js(jsCode)}
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

function Inner({ promise }: { promise: Promise<string> }) {
  const tsCode = use(promise)
  const jsCode = compileTs(tsCode)

  return (
    <CodePreviewUI
      jsCode={jsCode}
      tsCode={tsCode}
    />
  )
}

export function CodePreview({ path }: { path: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getContent({ data: path })} />
    </Suspense>
  )
}