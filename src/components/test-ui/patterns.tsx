import { PatternGridWithSettings } from "@/components/viz-ui/pattern-grid"

function Patterns() {
  return (
    <div className="space-y-8">
      <PatternGridWithSettings
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        size={3}
      />

      <PatternGridWithSettings
        items={"1\n12\n123\n1234\n12345"}
        rowSize={5}
        colSize={5}
      />
    </div>
  )
}

export default Patterns
