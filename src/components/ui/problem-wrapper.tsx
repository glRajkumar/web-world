import { Suspense, use } from 'react'

import { getProblemsContent } from '@/actions/files'

import { CodeExecuter } from './code-executer'
import { CodePreview } from './code-preview'
import { TestCases } from './test-case'

function Inner({ promise }: { promise: ReturnType<typeof getProblemsContent> }) {
  const data = use(promise)

  return (
    <>
      <TestCases
        testCases={data.testCases}
      />

      <CodePreview
        jsCode={data.jsCode}
        tsCode={data.tsCode}
      />

      <CodeExecuter
        filePath={data.filePath}
        executers={data.executers}
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
