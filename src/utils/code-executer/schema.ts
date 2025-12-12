import { z } from "zod"

type primitiveT = string | number | boolean | null | undefined

type primOrArrOrObjT = primitiveT | primArrT | primObjT

type primArrT = Array<primOrArrOrObjT>
type primObjT = {
  [key: string]: primOrArrOrObjT
}

export type numberConstraintT = {
  min?: number
  max?: number
  step?: number
}

export type stringConstraintT = {
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type enumConstraintT = {
  values: primitiveT[]
}

export type objectConstraintT = {
  template?: ConstraintLeafT
  by?: Record<string, ConstraintLeafT>
}

export type arrayConstraintT = {
  min?: number
  max?: number
  canIncludeFalsy?: boolean
  template?: ConstraintLeafT
  by?: Record<number, ConstraintLeafT>
}

export type ConstraintLeafT =
  | { type: "boolean" }
  | { type: "enum"; constraints: enumConstraintT }
  | { type: "string"; constraints?: stringConstraintT }
  | { type: "number"; constraints?: numberConstraintT }
  | { type: "object"; constraints?: objectConstraintT }
  | { type: "array"; constraints?: arrayConstraintT }

type paramCommon = {
  name: string
  required?: boolean
  description?: string
}

type stringParamT = paramCommon & {
  type: "string"
  constraints?: stringConstraintT
  defaultValue?: string
}

type numberParamT = paramCommon & {
  type: "number"
  constraints?: numberConstraintT
  defaultValue?: number
}

type booleanParamT = paramCommon & {
  type: "boolean"
  defaultValue?: boolean
}

type arrayParamT = paramCommon & {
  type: "array"
  constraints?: arrayConstraintT
  defaultValue?: primOrArrOrObjT[]
}

type objectParamT = paramCommon & {
  type: "object"
  constraints?: objectConstraintT
  defaultValue?: Record<string, primOrArrOrObjT>
}

type enumParamT = paramCommon & {
  type: "enum"
  constraints: enumConstraintT
  defaultValue?: string
}

type untypedParamT = paramCommon & {
  type?: undefined
  constraints?: undefined
  defaultValue?: primOrArrOrObjT
}

export type paramT =
  | stringParamT
  | numberParamT
  | booleanParamT
  | arrayParamT
  | objectParamT
  | enumParamT
  | untypedParamT

export type functionMetadataT = {
  type: "function"
  name: string
  params?: paramT[]
  isAsync?: boolean
  description?: string
}

export type classMetadataT = {
  type: "class"
  name: string
  construct?: paramT[]
  methods?: functionMetadataT[]
  description?: string
}

export type fnOrClsArrT = Array<functionMetadataT | classMetadataT>

export type testCaseT = {
  input: primOrArrOrObjT
  output: primOrArrOrObjT
}

export type metaT = Record<string, functionMetadataT | classMetadataT>

export type jsonMetaDataT = {
  testCases?: testCaseT[]
  meta: metaT
}

export type logT = {
  id: string
  input: primOrArrOrObjT
  output: primOrArrOrObjT
  name?: string
  error?: string
}

function generateLeafSchema(constraint: ConstraintLeafT): z.ZodTypeAny {
  let schema: z.ZodTypeAny

  switch (constraint.type) {
    case "string": {
      schema = z.string()
      const { constraints } = constraint
      if (constraints?.minLength !== undefined) {
        schema = (schema as z.ZodString).min(constraints.minLength,
          `Minimum length is ${constraints.minLength}`)
      }
      if (constraints?.maxLength !== undefined) {
        schema = (schema as z.ZodString).max(constraints.maxLength,
          `Maximum length is ${constraints.maxLength}`)
      }
      if (constraints?.pattern) {
        schema = (schema as z.ZodString).regex(new RegExp(constraints.pattern),
          `Must match pattern: ${constraints.pattern}`)
      }
      return schema
    }
    case "number": {
      schema = z.number()
      const { constraints } = constraint
      if (constraints?.min !== undefined) {
        schema = (schema as z.ZodNumber).min(constraints.min,
          `Minimum value is ${constraints.min}`)
      }
      if (constraints?.max !== undefined) {
        schema = (schema as z.ZodNumber).max(constraints.max,
          `Maximum value is ${constraints.max}`)
      }
      return schema
    }
    case "boolean": {
      return z.boolean()
    }
    case "enum": {
      return z.enum(constraint.constraints.values as [string, ...string[]])
    }
    case "array": {
      const { constraints } = constraint
      let itemSchema: z.ZodTypeAny = z.any()

      if (constraints?.template) {
        itemSchema = generateLeafSchema(constraints.template)
      }

      if (constraints?.by) {
        const indexedSchemas: z.ZodTypeAny[] = []

        const maxIndex = Object.keys(constraints.by)
          .map(Number)
          .reduce((max, current) => Math.max(max, current), -1)

        const tupleSize = maxIndex + 1

        for (let i = 0; i < tupleSize; i++) {
          const indexConstraint = constraints.by[i]
          if (indexConstraint) {
            indexedSchemas.push(generateLeafSchema(indexConstraint))
          } else {
            indexedSchemas.push(itemSchema)
          }
        }

        schema = z.tuple(indexedSchemas as [z.ZodTypeAny, ...z.ZodTypeAny[]]).rest(itemSchema)
      } else {
        schema = z.array(itemSchema)
      }

      if (constraints?.min !== undefined) {
        schema = (schema as z.ZodArray<any>).min(constraints.min,
          `Minimum ${constraints.min} items required`)
      }
      if (constraints?.max !== undefined) {
        schema = (schema as z.ZodArray<any>).max(constraints.max,
          `Maximum ${constraints.max} items allowed`)
      }

      return schema
    }
    case "object": {
      const { constraints } = constraint

      if (!constraints) {
        return z.record(z.string(), z.any())
      }

      if ('type' in constraints) {
        const valSchema = generateLeafSchema(constraints as ConstraintLeafT)
        return z.record(z.string(), valSchema)
      }

      const { template, by } = constraints as objectConstraintT

      if (by) {
        const shape: Record<string, z.ZodTypeAny> = {}
        for (const [key, leaf] of Object.entries(by)) {
          shape[key] = generateLeafSchema(leaf)
        }
        return z.object(shape)
      }

      if (template) {
        const valSchema = generateLeafSchema(template)
        return z.record(z.string(), valSchema)
      }

      return z.record(z.string(), z.any())
    }
    default: {
      return z.any()
    }
  }
}

export function generateZodSchema(params: paramT[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  params.forEach(param => {
    let schema: z.ZodTypeAny

    const constraintLeaf: ConstraintLeafT = {
      type: param.type ?? 'any' as any,
      constraints: (param as any)?.constraints,
    }

    schema = generateLeafSchema(constraintLeaf)

    if (param.required === false) {
      schema = schema.optional()
    }

    if (param.defaultValue !== undefined) {
      schema = schema.default(param.defaultValue)
    }

    shape[param.name] = schema
  })

  return z.object(shape)
}
