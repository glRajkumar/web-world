import { create } from 'zustand'
import { colors, shades, type colorsT, type shadesT, type bgT } from '@/utils/colors'

export type flowT = 'row' | 'col'

type GridState = {
  flow: flowT
  rowOrder: shadesT[]
  colOrder: colorsT[]
  cellGrid: bgT[][]
  colorsStart: colorsT
  shadesStart: shadesT
  excludedRows: Set<shadesT>
  excludedCols: Set<colorsT>
  excludedCells: Set<bgT>
}

type GridStore = {
  grids: Record<string, GridState>

  init: (id: string) => void
  reset: (id: string) => void
  remove: (id: string) => void

  moveRow: (id: string, from: number, to: number) => void
  moveCol: (id: string, from: number, to: number) => void

  toggleCell: (id: string, cell: bgT) => void
  toggleRow: (id: string, shade: shadesT) => void
  toggleCol: (id: string, color: colorsT) => void

  updateFlow: (id: string, flow: flowT) => void
  updateColorsStart: (id: string, c: colorsT) => void
  updateShadesStart: (id: string, s: shadesT) => void
}

function startArrayBy<T>(arr: readonly T[], startBy: T): T[] {
  const idx = arr.indexOf(startBy)
  return idx === -1 ? [...arr] : [...arr.slice(idx), ...arr.slice(0, idx)]
}

function toggleInSet<T>(set: Set<T>, item: T) {
  const next = new Set(set)
  next.has(item) ? next.delete(item) : next.add(item)
  return next
}

function createInitialGrid(): GridState {
  const rowOrder = [...shades]
  const colOrder = [...colors]
  const cellGrid = rowOrder.map(s => colOrder.map(c => `bg-${c}-${s}` as bgT))

  return {
    flow: 'row',
    rowOrder,
    colOrder,
    cellGrid,
    colorsStart: colOrder[0],
    shadesStart: rowOrder[0],
    excludedCells: new Set(),
    excludedRows: new Set(),
    excludedCols: new Set(),
  }
}

export const useGridStore = create<GridStore>((set) => ({
  grids: {},

  init: id => set(s =>
    s.grids[id] ? s : { grids: { ...s.grids, [id]: createInitialGrid() } }
  ),

  reset: id => set(s => ({
    grids: { ...s.grids, [id]: createInitialGrid() },
  })),

  remove: id => set(s => {
    const next = { ...s.grids }
    delete next[id]
    return { grids: next }
  }),

  moveRow: (id, from, to) => set(s => {
    const g = s.grids[id]
    if (!g || from === to) return s

    const rowOrder = [...g.rowOrder]
    const cellGrid = [...g.cellGrid]

    const [r] = rowOrder.splice(from, 1)
    const [cg] = cellGrid.splice(from, 1)

    rowOrder.splice(to, 0, r)
    cellGrid.splice(to, 0, cg)

    return { grids: { ...s.grids, [id]: { ...g, rowOrder, cellGrid } } }
  }),

  moveCol: (id, from, to) => set(s => {
    const g = s.grids[id]
    if (!g || from === to) return s

    const colOrder = [...g.colOrder]
    const [c] = colOrder.splice(from, 1)
    colOrder.splice(to, 0, c)

    const cellGrid = g.cellGrid.map((row) => {
      const r = [...row]
      const [cell] = r.splice(from, 1)
      r.splice(to, 0, cell)
      return r
    })

    return { grids: { ...s.grids, [id]: { ...g, colOrder, cellGrid } } }
  }),

  toggleCell: (id, cell) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const wasExcluded = g.excludedCells.has(cell)
    const excludedCells = toggleInSet(g.excludedCells, cell)
    const isExcludedNow = excludedCells.has(cell)

    const nextExcludedRows = new Set(g.excludedRows)
    const nextExcludedCols = new Set(g.excludedCols)

    const parts = cell.split('-')
    const color = parts[1] as colorsT
    const shade = parts[2] as shadesT

    if (!wasExcluded && isExcludedNow) {
      const fullRow = g.colOrder.every(col => excludedCells.has(`bg-${col}-${shade}` as bgT))
      if (fullRow) {
        nextExcludedRows.add(shade)
        for (const col of g.colOrder) excludedCells.delete(`bg-${col}-${shade}` as bgT)
      }

      const fullCol = g.rowOrder.every(rShade => excludedCells.has(`bg-${color}-${rShade}` as bgT))
      if (fullCol) {
        nextExcludedCols.add(color)
        for (const rShade of g.rowOrder) excludedCells.delete(`bg-${color}-${rShade}` as bgT)
      }
    }

    if (wasExcluded && !isExcludedNow) {
      if (g.excludedRows.has(shade)) {
        nextExcludedRows.delete(shade)
        for (const col of g.colOrder) {
          const cellStr = `bg-${col}-${shade}` as bgT
          if (col !== color) excludedCells.add(cellStr)
        }
      }

      if (g.excludedCols.has(color)) {
        nextExcludedCols.delete(color)
        for (const rShade of g.rowOrder) {
          const cellStr = `bg-${color}-${rShade}` as bgT
          if (rShade !== shade) excludedCells.add(cellStr)
        }
      }
    }

    return {
      grids: {
        ...s.grids,
        [id]: {
          ...g,
          excludedCells,
          excludedRows: nextExcludedRows,
          excludedCols: nextExcludedCols,
        },
      },
    }
  }),

  toggleRow: (id, shade) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const willExclude = !g.excludedRows.has(shade)
    let nextExcludedCells = new Set(g.excludedCells)
    if (willExclude) {
      for (const cell of g.excludedCells) {
        if (cell.endsWith(`-${shade}`)) {
          nextExcludedCells.delete(cell)
        }
      }
    }

    return {
      grids: {
        ...s.grids,
        [id]: {
          ...g,
          excludedRows: toggleInSet(g.excludedRows, shade),
          excludedCells: nextExcludedCells,
        },
      },
    }
  }),

  toggleCol: (id, color) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const willExclude = !g.excludedCols.has(color)
    let nextExcludedCells = new Set(g.excludedCells)
    if (willExclude) {
      for (const cell of g.excludedCells) {
        if (cell.startsWith(`bg-${color}-`)) {
          nextExcludedCells.delete(cell)
        }
      }
    }

    return {
      grids: {
        ...s.grids,
        [id]: {
          ...g,
          excludedCols: toggleInSet(g.excludedCols, color),
          excludedCells: nextExcludedCells,
        },
      },
    }
  }),

  updateFlow: (id, flow) => set(s => ({
    grids: { ...s.grids, [id]: { ...s.grids[id], flow } },
  })),

  updateColorsStart: (id, color) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const colOrder = startArrayBy(colors, color)
    const cellGrid = g.rowOrder.map(s =>
      colOrder.map((c) => `bg-${c}-${s}` as bgT)
    )

    return {
      grids: {
        ...s.grids,
        [id]: { ...g, colorsStart: color, colOrder, cellGrid },
      },
    }
  }),

  updateShadesStart: (id, shade) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const rowOrder = startArrayBy(shades, shade)
    const cellGrid = rowOrder.map(s =>
      g.colOrder.map((c) => `bg-${c}-${s}` as bgT)
    )

    return {
      grids: {
        ...s.grids,
        [id]: { ...g, shadesStart: shade, rowOrder, cellGrid },
      },
    }
  }),
}))

export function useExcludedCheck(id: string) {
  const excludedCells = useGridStore(s => s.grids?.[id]?.excludedCells)
  const excludedRows = useGridStore(s => s.grids?.[id]?.excludedRows)
  const excludedCols = useGridStore(s => s.grids?.[id]?.excludedCols)

  const isCellExcluded = (c: colorsT, s: shadesT) => excludedCells.has(`bg-${c}-${s}` as bgT)
  const isRowExcluded = (s: shadesT) => excludedRows.has(s)
  const isColExcluded = (c: colorsT) => excludedCols.has(c)

  return {
    isCellExcluded,
    isColExcluded,
    isRowExcluded,
  }
}