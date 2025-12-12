import type { arrayConstraintT, objectConstraintT, paramT } from "./schema"

function mergeArrayConstraints(oldC?: arrayConstraintT, newC?: arrayConstraintT): arrayConstraintT | undefined {
  if (!oldC && !newC) return undefined
  if (!oldC) return newC
  if (!newC) return oldC

  return {
    ...oldC,
    ...newC,
    template: newC.template ?? oldC.template,
    by: {
      ...oldC.by,
      ...newC.by,
    },
  }
}

function mergeObjectConstraints(oldC?: objectConstraintT, newC?: objectConstraintT): objectConstraintT | undefined {
  if (!oldC && !newC) return undefined
  if (!oldC) return newC
  if (!newC) return oldC

  if ('type' in oldC || 'type' in newC) {
    return newC
  }

  if (oldC && !('template' in oldC) && !('by' in oldC)) {
    return newC as any
  }

  if (newC && !('template' in newC) && !('by' in newC)) {
    return newC as any
  }

  return {
    ...oldC,
    ...newC,
    template: newC.template ?? oldC.template,
    by: {
      ...(oldC as any).by,
      ...(newC as any).by,
    },
  } as objectConstraintT
}

export function mergeParams(params: paramT[] = [], newParams: paramT[] = []): paramT[] {
  return params.map((oldParam) => {
    const updated = newParams.find((p) => p.name === oldParam.name)
    if (!updated) return oldParam

    if (oldParam.type !== updated.type) {
      return updated
    }

    if (oldParam.type === "array" && updated.type === "array") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeArrayConstraints(
          oldParam.constraints,
          updated.constraints
        ),
      }
    }

    if (oldParam.type === "object" && updated.type === "object") {
      return {
        ...oldParam,
        ...updated,
        constraints: mergeObjectConstraints(
          oldParam.constraints,
          updated.constraints
        ),
      }
    }

    if (oldParam.type === "string" && updated.type === "string") {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    if (oldParam.type === "number" && updated.type === "number") {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    if (oldParam.type === "boolean" && updated.type === "boolean") {
      return {
        ...oldParam,
        ...updated,
      }
    }

    return {
      ...oldParam,
      ...updated,
    }
  }) as any
}