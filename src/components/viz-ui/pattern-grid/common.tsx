import { GripHorizontal, GripVertical } from "lucide-react";
import { DragOverlay, useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";

import { useGridState } from "./grid-state-context";

type props = { children: React.ReactNode, id: string }
export function Droppable({ children, id }: props) {
  const { ref } = useDroppable({
    id,
    type: id,
    collisionPriority: CollisionPriority.Low,
  })

  return <div ref={ref}>{children}</div>
}

export function DropOverLay() {
  const { colOrder, cellGrid, rowOrder } = useGridState()

  return (
    <DragOverlay>
      {source => {
        const id = source.id.toString()
        const isCol = source.type === "col"

        const i = isCol ? colOrder.findIndex(f => f === id) : rowOrder.findIndex(f => f === id)
        const items = isCol ? cellGrid.map(r => r[i]) : cellGrid[i]

        return (
          <div className={`flex items-center w-fit bg-white border ${isCol ? "flex-col border-b-0" : "border-r-0"}`}>
            <button
              className={`size-8 shrink-0 flex items-center justify-center ${isCol ? "border-b" : "border-r"}`}
            >
              {
                !isCol
                  ? <GripVertical className="size-4" />
                  : <GripHorizontal className="size-4" />
              }
            </button>

            {items
              .map(s => (
                <button
                  key={s}
                  className={`size-8 shrink-0 ${isCol ? "border-b" : "border-r"} ${s}`}
                />
              ))}
          </div>
        )
      }}
    </DragOverlay>
  )
}
