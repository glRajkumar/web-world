import { Suspense, use } from 'react'

import type { testCaseT } from '@/utils/schemas'
import { getJsonContent } from '@/actions/get-content'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion"
import { DynamicCodeExtended } from './dynamic-code-extended'

function Inner({ promise }: { promise: Promise<testCaseT> }) {
  const jsonData = use(promise)

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
