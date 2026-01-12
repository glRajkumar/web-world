import { createContext, useContext, useReducer, ReactNode } from 'react'
import { colors, shades, type colorsT, type shadesT, type bgT } from '@/utils/colors'

type State = {
  rowOrder: shadesT[]
  colOrder: colorsT[]
  cellGrid: bgT[][]
  excludedCells: Set<bgT>
  excludedRows: Set<shadesT>
  excludedCols: Set<colorsT>
}

type Action =
  | { type: 'MOVE_ROW'; fromIndex: number; toIndex: number }
  | { type: 'MOVE_COL'; fromIndex: number; toIndex: number }
  | { type: 'TOGGLE_CELL'; cell: bgT }
  | { type: 'TOGGLE_ROW'; shade: shadesT }
  | { type: 'TOGGLE_COL'; color: colorsT }

type GridStateContextValue = State & {
  moveRow: (fromIndex: number, toIndex: number) => void
  moveCol: (fromIndex: number, toIndex: number) => void
  isCellExcluded: (c: colorsT, s: shadesT) => boolean
  isRowExcluded: (s: shadesT) => boolean
  isColExcluded: (c: colorsT) => boolean
  toggleCell: (t: bgT) => void
  toggleCol: (c: colorsT) => void
  toggleRow: (s: shadesT) => void
}

const GridStateContext = createContext<GridStateContextValue | null>(null)

function initializeState(): State {
  const rowOrder = [...shades]
  const colOrder = [...colors]
  const cellGrid: bgT[][] = rowOrder.map(shade =>
    colOrder.map(color => `bg-${color}-${shade}` as bgT)
  )

  return {
    rowOrder,
    colOrder,
    cellGrid,
    excludedCells: new Set(),
    excludedRows: new Set(),
    excludedCols: new Set(),
  }
}

function toggleInSet<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set)
  next.has(item) ? next.delete(item) : next.add(item)
  return next
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MOVE_ROW': {
      const { fromIndex, toIndex } = action
      if (fromIndex === toIndex) return state

      const newRowOrder = [...state.rowOrder]
      const [moved] = newRowOrder.splice(fromIndex, 1)
      newRowOrder.splice(toIndex, 0, moved)

      const newCellGrid = [...state.cellGrid]
      const [movedRow] = newCellGrid.splice(fromIndex, 1)
      newCellGrid.splice(toIndex, 0, movedRow)

      return { ...state, rowOrder: newRowOrder, cellGrid: newCellGrid }
    }

    case 'MOVE_COL': {
      const { fromIndex, toIndex } = action
      if (fromIndex === toIndex) return state

      const newColOrder = [...state.colOrder]
      const [moved] = newColOrder.splice(fromIndex, 1)
      newColOrder.splice(toIndex, 0, moved)

      const newCellGrid = state.cellGrid.map(row => {
        const newRow = [...row]
        const [movedCell] = newRow.splice(fromIndex, 1)
        newRow.splice(toIndex, 0, movedCell)
        return newRow
      })

      return { ...state, colOrder: newColOrder, cellGrid: newCellGrid }
    }

    case 'TOGGLE_CELL':
      return { ...state, excludedCells: toggleInSet(state.excludedCells, action.cell) }

    case 'TOGGLE_ROW':
      return { ...state, excludedRows: toggleInSet(state.excludedRows, action.shade) }

    case 'TOGGLE_COL':
      return { ...state, excludedCols: toggleInSet(state.excludedCols, action.color) }

    default:
      return state
  }
}

export function GridStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, initializeState)

  const moveRow = (fromIndex: number, toIndex: number) =>
    dispatch({ type: 'MOVE_ROW', fromIndex, toIndex })

  const moveCol = (fromIndex: number, toIndex: number) =>
    dispatch({ type: 'MOVE_COL', fromIndex, toIndex })

  const toggleCell = (cell: bgT) =>
    dispatch({ type: 'TOGGLE_CELL', cell })

  const toggleRow = (shade: shadesT) =>
    dispatch({ type: 'TOGGLE_ROW', shade })

  const toggleCol = (color: colorsT) =>
    dispatch({ type: 'TOGGLE_COL', color })

  const isRowExcluded = (shade: shadesT) => state.excludedRows.has(shade)
  const isColExcluded = (color: colorsT) => state.excludedCols.has(color)
  const isCellExcluded = (color: colorsT, shade: shadesT) =>
    state.excludedCells.has(`bg-${color}-${shade}`)

  return (
    <GridStateContext.Provider
      value={{
        ...state,
        moveRow,
        moveCol,
        isCellExcluded,
        isRowExcluded,
        isColExcluded,
        toggleCell,
        toggleCol,
        toggleRow,
      }}
    >
      {children}
    </GridStateContext.Provider>
  )
}

export function useGridState() {
  const context = useContext(GridStateContext)
  if (!context) {
    throw new Error('useGridState must be used within GridStateProvider')
  }
  return context
}
