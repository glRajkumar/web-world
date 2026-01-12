import { createContext, useContext, useReducer, ReactNode } from 'react'
import { colors, shades, type colorsT, type shadesT, type bgT } from '@/utils/colors'

type flowT = "row" | "col"
type State = {
  rowOrder: shadesT[]
  colOrder: colorsT[]
  cellGrid: bgT[][]
  excludedCells: Set<bgT>
  excludedRows: Set<shadesT>
  excludedCols: Set<colorsT>
  flow: flowT
}

type Action =
  | { type: 'MOVE_ROW'; fromIndex: number; toIndex: number }
  | { type: 'MOVE_COL'; fromIndex: number; toIndex: number }
  | { type: 'TOGGLE_CELL'; cell: bgT }
  | { type: 'TOGGLE_ROW'; shade: shadesT }
  | { type: 'TOGGLE_COL'; color: colorsT }
  | { type: 'UPDATE_FLOW'; flow: flowT }
  | { type: 'RESET' }

type GridStateContextValue = State & {
  moveRow: (fromIndex: number, toIndex: number) => void
  moveCol: (fromIndex: number, toIndex: number) => void
  isCellExcluded: (c: colorsT, s: shadesT) => boolean
  isRowExcluded: (s: shadesT) => boolean
  isColExcluded: (c: colorsT) => boolean
  toggleCell: (t: bgT) => void
  toggleCol: (c: colorsT) => void
  toggleRow: (s: shadesT) => void
  updateFlow: (f: flowT) => void
  reset: () => void
}

const GridStateContext = createContext<GridStateContextValue | null>(null)

function initializeState(): State {
  const rowOrder = [...shades]
  const colOrder = [...colors]
  const cellGrid: bgT[][] = rowOrder.map(shade =>
    colOrder.map(color => `bg-${color}-${shade}` as bgT)
  )

  return {
    flow: "row",
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

    case 'TOGGLE_CELL': {
      const nextExcludedCells = toggleInSet(state.excludedCells, action.cell)
      const wasExcluded = state.excludedCells.has(action.cell)
      const isExcludedNow = nextExcludedCells.has(action.cell)

      const nextExcludedRows = new Set(state.excludedRows)
      const nextExcludedCols = new Set(state.excludedCols)

      const parts = action.cell.split('-')
      const color = parts[1] as colorsT
      const shade = parts[2] as shadesT

      if (!wasExcluded && isExcludedNow) {
        const fullRow = state.colOrder.every(col => nextExcludedCells.has(`bg-${col}-${shade}` as bgT))
        if (fullRow) {
          nextExcludedRows.add(shade)
          for (const col of state.colOrder) nextExcludedCells.delete(`bg-${col}-${shade}` as bgT)
        }

        const fullCol = state.rowOrder.every(rShade => nextExcludedCells.has(`bg-${color}-${rShade}` as bgT))
        if (fullCol) {
          nextExcludedCols.add(color)
          for (const rShade of state.rowOrder) nextExcludedCells.delete(`bg-${color}-${rShade}` as bgT)
        }
      }

      if (wasExcluded && !isExcludedNow) {
        if (state.excludedRows.has(shade)) {
          nextExcludedRows.delete(shade)
          for (const col of state.colOrder) {
            const cellStr = `bg-${col}-${shade}` as bgT
            if (col !== color) nextExcludedCells.add(cellStr)
          }
        }

        if (state.excludedCols.has(color)) {
          nextExcludedCols.delete(color)
          for (const rShade of state.rowOrder) {
            const cellStr = `bg-${color}-${rShade}` as bgT
            if (rShade !== shade) nextExcludedCells.add(cellStr)
          }
        }
      }

      return {
        ...state,
        excludedCells: nextExcludedCells,
        excludedRows: nextExcludedRows,
        excludedCols: nextExcludedCols,
      }
    }

    case 'TOGGLE_ROW': {
      const willExclude = !state.excludedRows.has(action.shade)
      let nextExcludedCells = new Set(state.excludedCells)
      if (willExclude) {
        for (const cell of state.excludedCells) {
          if (cell.endsWith(`-${action.shade}`)) {
            nextExcludedCells.delete(cell)
          }
        }
      }
      return {
        ...state,
        excludedRows: toggleInSet(state.excludedRows, action.shade),
        excludedCells: nextExcludedCells,
      }
    }

    case 'TOGGLE_COL': {
      const willExclude = !state.excludedCols.has(action.color)
      let nextExcludedCells = new Set(state.excludedCells)
      if (willExclude) {
        for (const cell of state.excludedCells) {
          if (cell.startsWith(`bg-${action.color}-`)) {
            nextExcludedCells.delete(cell)
          }
        }
      }
      return {
        ...state,
        excludedCols: toggleInSet(state.excludedCols, action.color),
        excludedCells: nextExcludedCells,
      }
    }

    case 'RESET':
      return initializeState()

    case 'UPDATE_FLOW':
      return { ...state, flow: action.flow }

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

  const toggleCell = (cell: bgT) => dispatch({ type: 'TOGGLE_CELL', cell })
  const toggleRow = (shade: shadesT) => dispatch({ type: 'TOGGLE_ROW', shade })
  const toggleCol = (color: colorsT) => dispatch({ type: 'TOGGLE_COL', color })

  const isCellExcluded = (c: colorsT, s: shadesT) => state.excludedCells.has(`bg-${c}-${s}`)
  const isRowExcluded = (shade: shadesT) => state.excludedRows.has(shade)
  const isColExcluded = (color: colorsT) => state.excludedCols.has(color)

  const updateFlow = (flow: flowT) => dispatch({ type: 'UPDATE_FLOW', flow })
  const reset = () => dispatch({ type: 'RESET' })

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
        updateFlow,
        reset,
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
