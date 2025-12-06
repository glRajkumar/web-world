import { Suspense, use } from 'react'

import type { testCaseT } from '@/utils/schemas'
import { getContent } from '@/actions/files'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion"
import { DynamicCodeExtended } from '../fuma-ui/dynamic-code-extended'

export function TestCaseUI({ jsonData }: { jsonData: testCaseT }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="test-cases" className='border last:border-b rounded-xl mb-8 not-prose'>
        <AccordionTrigger className='px-4 hover:cursor-pointer'>Test Cases</AccordionTrigger>

        <AccordionContent className='px-4 flex gap-x-8 gap-y-4 flex-wrap'>
          {
            jsonData.expected.map((ex, i) => (
              <div key={i}>
                <div className='mb-0.5'>Example {i + 1}</div>

                <div className='flex items-center flex-wrap gap-2 mb-1 pb-4 pt-2 px-4 rounded-md bg-muted'>
                  <strong className='block w-20 mb-1'>Input: </strong>
                  <DynamicCodeExtended
                    lang='js'
                    code={`${ex.input}`}
                    allowCopy={false}
                    className='shadow-none [&_.line]:px-4!'
                  />
                </div>

                <div className='flex items-center flex-wrap gap-2 mb-1 pb-4 pt-2 px-4 rounded-md bg-muted'>
                  <strong className='block w-20 mb-1'>Output: </strong>
                  <DynamicCodeExtended
                    lang='js'
                    code={`${ex.output}`}
                    allowCopy={false}
                    className='shadow-none [&_.line]:px-4!'
                  />
                </div>
              </div>
            ))
          }
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function Inner({ promise }: { promise: Promise<string> }) {
  const jsonData = use(promise)
  return <TestCaseUI jsonData={JSON.parse(jsonData)} />
}

export function TestCase({ path }: { path: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner promise={getContent({ data: "/test-cases/" + path })} />
    </Suspense>
  )
}
