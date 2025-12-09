import type { objectConstraintT, paramT } from "./schema"

function getPrimitiveFallback(type: string) {
  switch (type) {
    case "string": return ""
    case "number": return 0
    case "boolean": return false
    default: return null
  }
}

function getDefaultValueForParam(param: paramT): any {
  const { type, constraints } = param

  if (type === "string" || type === "number" || type === "boolean") {
    return constraints?.defaultValue ?? getPrimitiveFallback(type)
  }

  if (type === "object") {
    return getObjectDefault(constraints)
  }

  if (type === "array") {
    return getArrayDefault(constraints)
  }

  return null
}

function getObjectDefault(constraints?: objectConstraintT | any): any {
  if (constraints?.defaultValue !== undefined) {
    return constraints.defaultValue
  }

  if (!constraints?.constraint || typeof constraints.constraint !== "object") {
    return {}
  }

  const obj: Record<string, any> = {}

  for (const key in constraints.constraint) {
    const field = constraints.constraint[key]

    if (!field) continue

    if (field.type === "string" || field.type === "number" || field.type === "boolean") {
      obj[key] = field.constraint?.defaultValue ?? getPrimitiveFallback(field.type)
    }

    else if (field.type === "object") {
      obj[key] = getObjectDefault(field)
    }

    else if (field.type === "array") {
      obj[key] = getArrayDefault(field)
    }
  }

  return obj
}

function getArrayDefault(constraints?: any): any[] {
  if (constraints?.defaultValue !== undefined) {
    return constraints.defaultValue
  }

  if (!constraints?.constraint) return []

  const single = constraints.constraint

  if (single.type === "string" || single.type === "number" || single.type === "boolean") {
    return [single.constraint?.defaultValue ?? getPrimitiveFallback(single.type)]
  }

  if (single.type === "object") {
    return [getObjectDefault(single)]
  }

  return []
}

export function getDefaultValues(params: paramT[]) {
  const result: Record<string, any> = {}

  for (const param of params) {
    result[param.name] = getDefaultValueForParam(param)
  }

  return result
}
