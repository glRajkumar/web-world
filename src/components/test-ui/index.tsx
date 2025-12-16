import { AccordionWrapper } from '@/components/shadcn-ui/accordion'
import FnOrCls from './fnOrCls'
import Params from './params'

function TestUI() {
  return (
    <div className='p-4 md:px-8'>
      <div className='border rounded-2xl'>
        <AccordionWrapper
          collapsible
          itemCls='px-4'
          items={[
            { value: "params", trigger: "Params", content: <Params /> },
            { value: "fns", trigger: "Functions", content: <FnOrCls type="fns" /> },
            { value: "cls", trigger: "Classes", content: <FnOrCls type="cls" /> },
          ]}
        />
      </div>
    </div>
  )
}

export default TestUI
