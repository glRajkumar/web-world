import { GripHorizontal } from "lucide-react";

import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import { useGridState } from './grid-state-context';
import { Droppable } from "./common";

type props = {
  id: string
  index: number
  group: string
}
function ColDraggable({ id, index, group }: props) {
  const { ref, handleRef } = useSortable({
    id,
    type: "col",
    index,
    group,
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("col-p") }),
      RestrictToHorizontalAxis
    ]
  })

  return (
    <div ref={ref} className='flex flex-col'>
      <button
        ref={handleRef}
        className="size-8 border-r border-b flex items-center justify-center"
      >
        <GripHorizontal className="size-4 pointer-events-none" />
      </button>
    </div>
  )
}

export function ColProvider() {
  const { colOrder } = useGridState()

  return (
    <div className='border'>
      <Droppable id="col">
        <div
          id='col-p'
          className="w-fit flex border-l border-t"
        >
          {colOrder.map((clr, colIdx) => (
            <ColDraggable
              key={clr}
              id={clr}
              index={colIdx}
              group={`col-${clr}`}
            />
          ))}
        </div>
      </Droppable>
    </div>
  )
}
