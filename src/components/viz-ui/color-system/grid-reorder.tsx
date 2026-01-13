import { DragDropProvider } from "@dnd-kit/react";
import { move } from '@dnd-kit/helpers';

import { useGridData, useGridStore } from './grid-store';

import { Button } from "@/components/shadcn-ui/button";
import { Label } from "@/components/shadcn-ui/label";

import { ColExclude, DropOverLay, RowExclude } from "./common";
import { RowProvider } from './row';
import { ColProvider } from './col';
import { Cells } from './cells';

type props = { id: string }
export function GridReorder({ id }: props) {
  const colOrder = useGridData(id, s => s?.colOrder)
  const rowOrder = useGridData(id, s => s?.rowOrder)

  const moveRow = useGridStore(s => s.moveRow)
  const moveCol = useGridStore(s => s.moveCol)
  const reset = useGridStore(s => s.reset)

  const handleDragOver = (event: Parameters<typeof move>[1]) => {
    const activeId = event.operation.source?.id.toString()
    const overId = event.operation.target?.id.toString()
    const activeType = event.operation.source?.type

    if (!overId) return

    if (activeType === 'row' && rowOrder.includes(activeId as typeof rowOrder[number])) {
      const newOrder = move([...rowOrder], event)
      const fromIndex = rowOrder.findIndex(item => item === activeId)
      const toIndex = newOrder.findIndex(item => item === activeId)
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveRow(id, fromIndex, toIndex)
      }
      return
    }

    if (activeType === 'col' && colOrder.includes(activeId as typeof colOrder[number])) {
      const newOrder = move([...colOrder], event)
      const fromIndex = colOrder.findIndex(item => item === activeId)
      const toIndex = newOrder.findIndex(item => item === activeId)
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveCol(id, fromIndex, toIndex)
      }
      return
    }
  }

  return (
    <div className="pb-2 overflow-x-auto">
      <Label className="mb-2">Colors</Label>

      <DragDropProvider onDragOver={handleDragOver}>
        <div className='grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] w-fit'>
          <span className="border-r border-b"></span>
          <ColProvider id={id} />
          <span className="border-b"></span>

          <RowProvider id={id} />
          <Cells id={id} />
          <RowExclude id={id} />

          <span className="border-r"></span>
          <ColExclude id={id} />
          <span></span>
        </div>

        <DropOverLay id={id} />
      </DragDropProvider>

      <div className="flex items-center gap-4">
        <Label htmlFor="reset">Reset to default</Label>

        <Button
          id="reset"
          size="sm"
          variant="secondary"
          onClick={() => reset(id)}
          className="my-4"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
