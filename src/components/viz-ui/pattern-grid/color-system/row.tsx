import { GripVertical } from "lucide-react";

import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import { useGridStore } from './grid-store';
import { Droppable } from "./common";

type props = {
  id: string
  index: number
  group: string
}
function RowDraggable({ id, index, group }: props) {
  const { ref } = useSortable({
    id,
    type: "row",
    index,
    group,
    modifiers: [
      RestrictToElement.configure({ element: document.getElementById("row-p") }),
      RestrictToVerticalAxis
    ]
  })

  return (
    <button
      ref={ref}
      className="size-8 border-x border-b flex items-center justify-center"
    >
      <GripVertical className="size-4 pointer-events-none" />
    </button>
  )
}

export function RowProvider({ id }: { id: string }) {
  const rowOrder = useGridStore(s => s.grids?.[id]?.rowOrder)

  return (
    <Droppable id='row'>
      <div
        id='row-p'
        className="w-fit"
      >
        {
          rowOrder.map((sh, rowIdx) => (
            <RowDraggable
              key={sh}
              id={sh}
              index={rowIdx}
              group={`row-${sh}`}
            />
          ))
        }
      </div>
    </Droppable>
  )
}