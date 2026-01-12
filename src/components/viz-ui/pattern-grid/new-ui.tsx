import { DragDropProvider } from "@dnd-kit/react";
import { move } from '@dnd-kit/helpers';

import { GridStateProvider, useGridState } from './grid-state-context';
import { ColExclude, DropOverLay, RowExclude } from "./common";
import { RowProvider } from './row';
import { ColProvider } from './col';
import { Cells } from './cells';

function DragHandler() {
  const { rowOrder, colOrder, moveRow, moveCol } = useGridState()

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
        moveRow(fromIndex, toIndex)
      }
      return
    }

    if (activeType === 'col' && colOrder.includes(activeId as typeof colOrder[number])) {
      const newOrder = move([...colOrder], event)
      const fromIndex = colOrder.findIndex(item => item === activeId)
      const toIndex = newOrder.findIndex(item => item === activeId)
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveCol(fromIndex, toIndex)
      }
      return
    }
  }

  return (
    <DragDropProvider onDragOver={handleDragOver}>
      <div className='grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] w-fit'>
        <span className="border-r border-b"></span>
        <ColProvider />
        <span className="border-b"></span>

        <RowProvider />
        <Cells />
        <RowExclude />

        <span className="border-r"></span>
        <ColExclude />
        <span></span>
      </div>

      <DropOverLay />
    </DragDropProvider>
  )
}

export function NewUi() {
  return (
    <div className="p-5 border my-8">
      <GridStateProvider>
        <DragHandler />
      </GridStateProvider>
    </div>
  )
}
