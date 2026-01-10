import { PatternGridWithSettings } from "@/components/viz-ui/pattern-grid"
import { colors, shades } from "@/utils/colors"

function Patterns() {
  return (
    <div className="space-y-8">
      <PatternGridWithSettings
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        size={3}
      />

      <PatternGridWithSettings
        items={"4444444\n4333334\n4322234\n4321234\n4322234\n4333334\n4444444"}
        rowSize={7}
        colSize={7}
      />

      <PatternGridWithSettings
        items={Array.from({ length: colors.length * shades.length }, (_, i) => i)}
        rowSize={shades.length}
        colSize={colors.length}
        cellSize="compact"
        showIndex={false}
        enableColors
      />
    </div>
  )
}

export default Patterns
