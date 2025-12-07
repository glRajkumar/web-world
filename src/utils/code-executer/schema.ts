import { z } from "zod"

const primitiveZ = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined()
])

const pOrArrOrObjZ = z.union([
  primitiveZ,
  z.array(primitiveZ),
  z.record(z.string(), primitiveZ)
])

const NumberConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.number().optional(),
})

const StringConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  defaultValue: z.string().optional(),
})

const ArrayConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  type: z.enum(["string", "number", "boolean"]).optional(),
  defaultValue: z.array(z.any()).optional(),
})

const ParamZ = z.object({
  type: z.literal("param"),
  name: z.string(),
  pType: z.enum(["number", "string", "boolean", "array", "object"]).default("string").optional(),
  constraints: z.union([NumberConstraintZ, StringConstraintZ, ArrayConstraintZ]).optional(),
  description: z.string().optional(),
})

const FunctionMetadataZ = z.object({
  type: z.literal("funtion"),
  name: z.string(),
  params: z.array(ParamZ).optional(),
  isAsync: z.boolean().optional(),
  description: z.string().optional(),
})

const ClassMetadataZ = z.object({
  type: z.literal("class"),
  name: z.string(),
  construct: z.array(ParamZ).optional(),
  methods: z.array(FunctionMetadataZ).optional(),
  description: z.string().optional(),
})

const testCasesZ = z.object({
  input: pOrArrOrObjZ,
  output: pOrArrOrObjZ,
})

const metaZ = z.record(z.string(), z.union([FunctionMetadataZ, ClassMetadataZ]))

export const FnOrClsArrZ = z.array(z.union([FunctionMetadataZ, ClassMetadataZ]))

export const jsonMetaDataZ = z.object({
  testCases: z.array(testCasesZ).optional(),
  meta: metaZ,
})

export type NumberConstraintT = z.infer<typeof NumberConstraintZ>
export type StringConstraintT = z.infer<typeof StringConstraintZ>
export type ArrayConstraintT = z.infer<typeof ArrayConstraintZ>
export type ParamT = z.infer<typeof ParamZ>
export type FunctionMetadataT = z.infer<typeof FunctionMetadataZ>
export type ClassMetadataT = z.infer<typeof ClassMetadataZ>
export type FnOrClsArrT = z.infer<typeof FnOrClsArrZ>
export type jsonMetaDataT = z.infer<typeof jsonMetaDataZ>
export type testCasesT = z.infer<typeof testCasesZ>
export type metaT = z.infer<typeof metaZ>
