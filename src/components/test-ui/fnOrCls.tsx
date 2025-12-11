import { Suspense, use } from 'react'

import { getProblemsContent } from '@/actions/files'

import { CodeExecuter } from '@/components/ui/code-executer'

function Inner({ promise }: { promise: ReturnType<typeof getProblemsContent> }) {
  const data = use(promise)

  return (
    <CodeExecuter
      filePath={data.filePath}
      executers={data.executers}
    />
  )
}

type props = {
  type: "fns" | "cls"
}

function FnOrCls({ type }: props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner
        promise={getProblemsContent({ data: `/problems/test-ui-${type}` })}
      />
    </Suspense>
  )
}

export default FnOrCls
