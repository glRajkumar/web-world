import { Suspense, use } from 'react'

import type { testCaseT } from '@/utils/schemas'
import { getJsonContent } from '@/actions/get-content'
import { DynamicCodeExtended } from './dynamic-code-extended'

function Inner({ promise }: { promise: Promise<testCaseT> }) {
  const jsonData = use(promise)

  return (
    <div>
      {
        jsonData.expected.map((ex, i) => (
          <div key={i} className='mb-4'>
            <div className='mb-0.5'>Example {i + 1}</div>

            <div className='mb-1 pb-4 pt-2 px-4 rounded-md bg-muted'>
              <strong className='block mb-1'>Input: </strong>
              <DynamicCodeExtended
                lang='js'
                code={`${ex.input}`}
                allowCopy={false}
                className='shadow-none'
              />
            </div>
            <div className='mb-1 pb-4 pt-2 px-4 rounded-md bg-muted'>
              <strong className='block mb-1'>Output: </strong>
              <DynamicCodeExtended
                lang='js'
                code={`${ex.output}`}
                allowCopy={false}
                className='shadow-none'
              />
            </div>
          </div>
        ))
      }
    </div>
  )
}

export function TestCase({ path }: { path: string }) {
  const fileName = path.split("/").pop() || ""
  const [prefix] = fileName?.split(".") || []

  const finalPath = "/test-cases" + path.replace(fileName, prefix + ".json")

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getJsonContent(finalPath)} />
    </Suspense>
  )
}
