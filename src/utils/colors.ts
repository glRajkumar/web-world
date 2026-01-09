type ColorTone = "dark" | "light"

const shades = ["100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const
const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate"] as const

export type shadesT = typeof shades[number]
export type colorsT = typeof colors[number]
type bgT = `bg-${colorsT}-${shadesT}`

// 18 x 10
export const twBgClrs: bgT[] = [
  "bg-red-100", "bg-orange-100", "bg-amber-100", "bg-yellow-100", "bg-lime-100", "bg-green-100", "bg-emerald-100", "bg-teal-100", "bg-cyan-100", "bg-sky-100", "bg-blue-100", "bg-indigo-100", "bg-violet-100", "bg-purple-100", "bg-fuchsia-100", "bg-pink-100", "bg-rose-100", "bg-slate-100",
  "bg-red-200", "bg-orange-200", "bg-amber-200", "bg-yellow-200", "bg-lime-200", "bg-green-200", "bg-emerald-200", "bg-teal-200", "bg-cyan-200", "bg-sky-200", "bg-blue-200", "bg-indigo-200", "bg-violet-200", "bg-purple-200", "bg-fuchsia-200", "bg-pink-200", "bg-rose-200", "bg-slate-200",
  "bg-red-300", "bg-orange-300", "bg-amber-300", "bg-yellow-300", "bg-lime-300", "bg-green-300", "bg-emerald-300", "bg-teal-300", "bg-cyan-300", "bg-sky-300", "bg-blue-300", "bg-indigo-300", "bg-violet-300", "bg-purple-300", "bg-fuchsia-300", "bg-pink-300", "bg-rose-300", "bg-slate-300",
  "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-yellow-400", "bg-lime-400", "bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-fuchsia-400", "bg-pink-400", "bg-rose-400", "bg-slate-400",
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500", "bg-rose-500", "bg-slate-500",
  "bg-red-600", "bg-orange-600", "bg-amber-600", "bg-yellow-600", "bg-lime-600", "bg-green-600", "bg-emerald-600", "bg-teal-600", "bg-cyan-600", "bg-sky-600", "bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-purple-600", "bg-fuchsia-600", "bg-pink-600", "bg-rose-600", "bg-slate-600",
  "bg-red-700", "bg-orange-700", "bg-amber-700", "bg-yellow-700", "bg-lime-700", "bg-green-700", "bg-emerald-700", "bg-teal-700", "bg-cyan-700", "bg-sky-700", "bg-blue-700", "bg-indigo-700", "bg-violet-700", "bg-purple-700", "bg-fuchsia-700", "bg-pink-700", "bg-rose-700", "bg-slate-700",
  "bg-red-800", "bg-orange-800", "bg-amber-800", "bg-yellow-800", "bg-lime-800", "bg-green-800", "bg-emerald-800", "bg-teal-800", "bg-cyan-800", "bg-sky-800", "bg-blue-800", "bg-indigo-800", "bg-violet-800", "bg-purple-800", "bg-fuchsia-800", "bg-pink-800", "bg-rose-800", "bg-slate-800",
  "bg-red-900", "bg-orange-900", "bg-amber-900", "bg-yellow-900", "bg-lime-900", "bg-green-900", "bg-emerald-900", "bg-teal-900", "bg-cyan-900", "bg-sky-900", "bg-blue-900", "bg-indigo-900", "bg-violet-900", "bg-purple-900", "bg-fuchsia-900", "bg-pink-900", "bg-rose-900", "bg-slate-900",
  "bg-red-950", "bg-orange-950", "bg-amber-950", "bg-yellow-950", "bg-lime-950", "bg-green-950", "bg-emerald-950", "bg-teal-950", "bg-cyan-950", "bg-sky-950", "bg-blue-950", "bg-indigo-950", "bg-violet-950", "bg-purple-950", "bg-fuchsia-950", "bg-pink-950", "bg-rose-950", "bg-slate-950",
]

type optT = {
  order?: "col" | "row"

  fromShade?: shadesT
  toShade?: shadesT

  fromColor?: colorsT
  toColor?: colorsT

  excludeRow?: shadesT[]
  excludeCol?: colorsT[]
}

export function getTwBgColors(options?: optT): bgT[] {
  const {
    order = "row",

    fromShade = "100",
    toShade = "950",

    fromColor = "red",
    toColor = "slate",

    excludeRow = [],
    excludeCol = [],
  } = options || {}

  const fromShadeIdx = shades.indexOf(fromShade)
  const toShadeIdx = shades.indexOf(toShade)

  if (fromShadeIdx === -1 || toShadeIdx === -1) {
    throw new Error("Invalid fromShade / toShade value")
  }

  const fromColorIdx = fromColor ? colors.indexOf(fromColor) : 0
  const toColorIdx = toColor ? colors.indexOf(toColor) : colors.length - 1

  if (fromColor && fromColorIdx === -1) {
    throw new Error("Invalid fromColor value")
  }

  if (toColor && toColorIdx === -1) {
    throw new Error("Invalid toColor value")
  }

  if (order === "row") {
    return twBgClrs.filter(cls => {
      const [, color, shade] = cls.split("-") as ["bg", colorsT, shadesT]

      const shadeIdx = shades.indexOf(shade)
      const colorIdx = colors.indexOf(color)

      const shadeInRange = shadeIdx >= fromShadeIdx && shadeIdx <= toShadeIdx
      const colorInRange = colorIdx >= fromColorIdx && colorIdx <= toColorIdx

      return (
        shadeInRange &&
        colorInRange &&
        !excludeRow.includes(shade) &&
        !excludeCol.includes(color)
      )
    })
  }

  const result: bgT[] = []

  const includedColors = colors
    .slice(fromColorIdx, toColorIdx + 1)
    .filter(c => !excludeCol.includes(c))

  const includedShades = shades
    .slice(fromShadeIdx, toShadeIdx + 1)
    .filter(s => !excludeRow.includes(s))

  for (const color of includedColors) {
    for (const shade of includedShades) {
      result.push(`bg-${color}-${shade}`)
    }
  }

  return result
}

export function hexToRGB(hex: string) {
  let h = hex.replace("#", "")

  if (h.length === 3) {
    h = h.split("").map(c => c + c).join("")
  }

  if (h.length >= 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }

  return null
}

export function parseToRGB(color: string): { r: number; g: number; b: number } | null {
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = "#000"
  ctx.fillStyle = color

  const computed = ctx.fillStyle

  // Hex
  if (computed.startsWith("#")) {
    return hexToRGB(computed)
  }

  // rgb / rgba
  const match = computed.match(/\d+/g)
  if (!match || match.length < 3) return null

  return {
    r: Number(match[0]),
    g: Number(match[1]),
    b: Number(match[2]),
  }
}

const memoised = new Map<string, ColorTone>()
export function getColorTone(color: string): ColorTone {
  if (memoised.get(color)) return memoised.get(color)!

  const rgb = parseToRGB(color)

  if (!rgb) {
    throw new Error(`Invalid color value: ${color}`)
  }

  const { r, g, b } = rgb

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const tone = luminance <= 128 ? "dark" : "light"
  memoised.set(color, tone)

  return tone
}
