import { useShallow } from 'zustand/shallow'
import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import type { colorsT, shadesT, bgT } from '@/utils/colors'
import { colors, shades } from '@/utils/colors'

export type flowT = 'row' | 'col'

type GridState = {
  flow: flowT
  rowOrder: shadesT[]
  colOrder: colorsT[]
  colorsStart: colorsT
  shadesStart: shadesT
  excludedRows: shadesT[]
  excludedCols: colorsT[]
  excludedCells: bgT[]
}

type initOptT = Omit<GridState, "rowOrder" | "colOrder">

type GridStore = {
  grids: Record<string, GridState>

  init: (id: string, o?: Partial<initOptT>) => void
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

function toggleInArray<T>(arr: T[], item: T): T[] {
  const idx = arr.indexOf(item)
  if (idx === -1) {
    return [...arr, item]
  } else {
    return arr.filter(x => x !== item)
  }
}

function addToArray<T>(arr: T[], item: T): T[] {
  if (arr.includes(item)) return arr
  return [...arr, item]
}

function removeFromArray<T>(arr: T[], item: T): T[] {
  return arr.filter(x => x !== item)
}

function createInitialGrid(option?: Partial<initOptT>): GridState {
  const {
    flow = "row", colorsStart = "red", shadesStart = "100",
    excludedCells = [], excludedRows = [],
    excludedCols = [],
  } = option || {}

  const rowOrder = startArrayBy([...shades], shadesStart)
  const colOrder = startArrayBy([...colors], colorsStart)

  return {
    flow,
    rowOrder,
    colOrder,
    colorsStart,
    shadesStart,
    excludedCells,
    excludedRows,
    excludedCols,
  }
}

export const useGridStore = create<GridStore>()(persist((set) => ({
  grids: {
    global: createInitialGrid({ shadesStart: "400" }),
  },

  init: (id, opts) => set(s =>
    s.grids[id] ? s : { grids: { ...s.grids, [id]: createInitialGrid(opts) } }
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

    const [r] = rowOrder.splice(from, 1)
    rowOrder.splice(to, 0, r)

    return { grids: { ...s.grids, [id]: { ...g, rowOrder } } }
  }),

  moveCol: (id, from, to) => set(s => {
    const g = s.grids[id]
    if (!g || from === to) return s

    const colOrder = [...g.colOrder]
    const [c] = colOrder.splice(from, 1)
    colOrder.splice(to, 0, c)

    return { grids: { ...s.grids, [id]: { ...g, colOrder } } }
  }),

  toggleCell: (id, cell) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const wasExcluded = g.excludedCells.includes(cell)
    let excludedCells = toggleInArray(g.excludedCells, cell)
    const isExcludedNow = excludedCells.includes(cell)

    let nextExcludedRows = [...g.excludedRows]
    let nextExcludedCols = [...g.excludedCols]

    const parts = cell.split('-')
    const color = parts[1] as colorsT
    const shade = parts[2] as shadesT

    if (!wasExcluded && isExcludedNow) {
      const fullRow = g.colOrder.every(col => excludedCells.includes(`bg-${col}-${shade}` as bgT))
      if (fullRow) {
        nextExcludedRows = addToArray(nextExcludedRows, shade)
        excludedCells = g.colOrder.reduce((acc, col) =>
          removeFromArray(acc, `bg-${col}-${shade}` as bgT), excludedCells)
      }

      const fullCol = g.rowOrder.every(rShade => excludedCells.includes(`bg-${color}-${rShade}` as bgT))
      if (fullCol) {
        nextExcludedCols = addToArray(nextExcludedCols, color)
        excludedCells = g.rowOrder.reduce((acc, rShade) =>
          removeFromArray(acc, `bg-${color}-${rShade}` as bgT), excludedCells)
      }
    }

    if (wasExcluded && !isExcludedNow) {
      if (g.excludedRows.includes(shade)) {
        nextExcludedRows = removeFromArray(nextExcludedRows, shade)
        for (const col of g.colOrder) {
          const cellStr = `bg-${col}-${shade}` as bgT
          if (col !== color) excludedCells = addToArray(excludedCells, cellStr)
        }
      }

      if (g.excludedCols.includes(color)) {
        nextExcludedCols = removeFromArray(nextExcludedCols, color)
        for (const rShade of g.rowOrder) {
          const cellStr = `bg-${color}-${rShade}` as bgT
          if (rShade !== shade) excludedCells = addToArray(excludedCells, cellStr)
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

    const willExclude = !g.excludedRows.includes(shade)
    let nextExcludedCells = [...g.excludedCells]
    if (willExclude) {
      nextExcludedCells = nextExcludedCells.filter(cell => !cell.endsWith(`-${shade}`))
    }

    return {
      grids: {
        ...s.grids,
        [id]: {
          ...g,
          excludedRows: toggleInArray(g.excludedRows, shade),
          excludedCells: nextExcludedCells,
        },
      },
    }
  }),

  toggleCol: (id, color) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const willExclude = !g.excludedCols.includes(color)
    let nextExcludedCells = [...g.excludedCells]
    if (willExclude) {
      nextExcludedCells = nextExcludedCells.filter(cell => !cell.startsWith(`bg-${color}-`))
    }

    return {
      grids: {
        ...s.grids,
        [id]: {
          ...g,
          excludedCols: toggleInArray(g.excludedCols, color),
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

    return {
      grids: {
        ...s.grids,
        [id]: { ...g, colorsStart: color, colOrder },
      },
    }
  }),

  updateShadesStart: (id, shade) => set(s => {
    const g = s.grids[id]
    if (!g) return s

    const rowOrder = startArrayBy(shades, shade)

    return {
      grids: {
        ...s.grids,
        [id]: { ...g, shadesStart: shade, rowOrder },
      },
    }
  }),
}), { name: "colors-sytem" }))

export function useGridData<T>(id: string, selector: (s: GridState) => T) {
  return useGridStore(useShallow(s => selector(s?.grids?.[id])))
}

export function useBgClrs(id: string) {
  return useGridStore(useShallow(s => {
    const g = s.grids[id]
    if (!g) return []

    const final: bgT[] = []

    if (g.flow === "row") {
      g.rowOrder.forEach(sh => {
        if (!g.excludedRows.includes(sh)) {
          g.colOrder.forEach(clr => {
            if (!g.excludedCols.includes(clr)) {
              const twc = `bg-${clr}-${sh}` as bgT
              if (!g.excludedCells.includes(twc)) {
                final.push(twc)
              }
            }
          })
        }
      })
    }
    else {
      g.colOrder.forEach(clr => {
        if (!g.excludedCols.includes(clr)) {
          g.rowOrder.forEach(sh => {
            if (!g.excludedRows.includes(sh)) {
              const twc = `bg-${clr}-${sh}` as bgT
              if (!g.excludedCells.includes(twc)) {
                final.push(twc)
              }
            }
          })
        }
      })
    }

    return final
  }))
}


export function useExcludedCheck(id: string) {
  const excludedCells = useGridData(id, s => s?.excludedCells)
  const excludedRows = useGridData(id, s => s?.excludedRows)
  const excludedCols = useGridData(id, s => s?.excludedCols)

  const isCellExcluded = (c: colorsT, s: shadesT) => excludedCells.includes(`bg-${c}-${s}` as bgT)
  const isRowExcluded = (s: shadesT) => excludedRows.includes(s)
  const isColExcluded = (c: colorsT) => excludedCols.includes(c)

  return {
    isCellExcluded,
    isColExcluded,
    isRowExcluded,
  }
}