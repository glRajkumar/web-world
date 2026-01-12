import { DragDropProvider } from "@dnd-kit/react";
import { move } from '@dnd-kit/helpers';

import { Button } from "@/components/shadcn-ui/button";
import { Label } from "@/components/shadcn-ui/label";

import { GridStateProvider, useGridState } from './grid-state-context';
import { ColExclude, DropOverLay, RowExclude } from "./common";
import { RowProvider } from './row';
import { ColProvider } from './col';
import { Settings } from "./settings";
import { Output } from "./output";
import { Cells } from './cells';

function DragHandler() {
  const { rowOrder, colOrder, moveRow, moveCol, reset } = useGridState()

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
    <div className="max-h-[70vh] overflow-y-auto pr-6 -mr-6">
      <Settings />

      <div className="pb-2 overflow-x-auto">
        <Label className="mb-2">Colors</Label>

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

        <div className="flex items-center gap-4">
          <Label htmlFor="reset">Reset to default</Label>

          <Button
            id="reset"
            size="sm"
            variant="secondary"
            onClick={reset}
            className="my-4"
          >
            Reset
          </Button>
        </div>
      </div>

      <Output />
    </div>
  )
}

export function ColorsGrid() {
  return (
    <GridStateProvider>
      <DragHandler />
    </GridStateProvider>
  )
}
