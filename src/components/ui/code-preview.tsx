import { beautify_js } from '@/utils/ts-help'

import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock'
import { DynamicCodeExtended } from '@/components/fuma-ui/dynamic-code-extended'

export function CodePreview({ jsCode, tsCode }: { jsCode: string, tsCode: string }) {
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
