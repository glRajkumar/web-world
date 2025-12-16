
export function getDefaultByConstraints(constraints: ConstraintLeafT) {
  switch (constraints.type) {
    case "boolean": return false
    case "number": return constraints.constraints?.min ?? 0
    case "object": return getObjectDefault(constraints.constraints)
    case "array": return getArrayDefault(constraints.constraints)
    default: return ""
  }
}

export function getDefaultValueForParam(param: paramT): any {
  const { type, defaultValue } = param

  if (defaultValue !== undefined) return defaultValue
  if (!type) return ""

  return getDefaultByConstraints(param)
}

export function getDefaultValues(params: paramT[]) {
  const result: Record<string, any> = {}

  for (const param of params) {
    result[param.name] = getDefaultValueForParam(param)
  }

  return result
}

export function getObjectDefault(constraints?: objectConstraintT): any {
  if (!constraints) return {}

  const { template, by } = constraints
  let obj: Record<string, any> = {}

  if (template) {
    const values = getDefaultByConstraints(template)
    obj = { ...values }
  }

  if (by) {
    for (const [key, field] of Object.entries(by)) {
      obj[key] = getDefaultByConstraints(field)
    }
  }

  return obj
}

export function getArrayDefault(constraints?: arrayConstraintT): any[] {
  if (!constraints) return []

  const { min, template, by } = constraints
  let arr = Array(min ?? 1).fill("")

  if (template) {
    const val = getDefaultByConstraints(template)
    arr = arr.map(v => val)
  }

  if (by) {
    for (const [key, field] of Object.entries(by)) {
      arr[Number(key)] = getDefaultByConstraints(field)
    }
  }

  return arr
}
