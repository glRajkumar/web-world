import { Suspense, use } from 'react'

import { getProblemsContent } from '@/actions/files'

import { CodePreviewUI } from './code-preview'
import { TestCaseUI } from './test-case'

function Inner({ promise }: { promise: ReturnType<typeof getProblemsContent> }) {
  const data = use(promise)

  return (
    <>
      <TestCaseUI
        jsonData={JSON.parse(data.testCaseCode)}
      />

      <CodePreviewUI
        jsCode={data.tsCode}
        tsCode={data.tsCode}
      />
    </>
  )
}

export function ProblemWrapper({ path }: { path: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getProblemsContent({ data: path })} />
    </Suspense>
  )
}
