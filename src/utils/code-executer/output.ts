
function toSerializable(value: primOrArrOrObjT, seen = new WeakSet<object>()): primOrArrOrObjT {
  if (value === null || value === undefined) return value

  const valueType = typeof value
  if (["string", "number", "boolean"].includes(valueType)) return value
  if (valueType === "function" || valueType === "symbol") return `[${valueType}]` as unknown as primOrArrOrObjT

  if (valueType === "object") {
    if (seen.has(value as object)) return "[Circular]" as unknown as primOrArrOrObjT
    seen.add(value as object)
  }

  if (value instanceof Map) {
    return {
      __type: "Map",
      entries: Array.from(value.entries()).map(([key, val]) => ({
        key: toSerializable(key as primOrArrOrObjT, seen),
        value: toSerializable(val as primOrArrOrObjT, seen),
      })),
    } as unknown as primOrArrOrObjT
  }

  if (value instanceof Set) {
    return {
      __type: "Set",
      values: Array.from(value.values()).map(val => toSerializable(val as primOrArrOrObjT, seen)),
    } as unknown as primOrArrOrObjT
  }

  if (Array.isArray(value)) {
    return value.map(item => toSerializable(item as primOrArrOrObjT, seen)) as unknown as primOrArrOrObjT
  }

  if (valueType === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, primOrArrOrObjT>).map(([k, v]) => [k, toSerializable(v, seen)])
    ) as primOrArrOrObjT
  }

  return value
}

export function outputText(output: primOrArrOrObjT) {
  if (
    ["string", "number", "boolean"].includes(typeof output)
    || output === null
    || output === undefined
  ) {
    return `${output}`
  }

  const serializable = toSerializable(output)
  return JSON.stringify(serializable, null, 2)
}
