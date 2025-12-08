import { z } from "zod"

export const PrimitiveZ = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
])

export const PrimOrArrOrObjZ = z.union([
  PrimitiveZ,
  z.array(PrimitiveZ),
  z.record(z.string(), PrimitiveZ),
])

export const NumberConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.number().optional(),
})

export const StringConstraintZ = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  defaultValue: z.string().optional(),
})

export const BooleanConstraintZ = z.object({
  defaultValue: z.boolean().optional(),
})

export const ArrayConstraintZ = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  type: z.enum(["string", "number", "boolean"]).optional(),
  defaultValue: z.array(PrimOrArrOrObjZ).optional(),
})

export const ObjectConstraintZ = z.object({
  defaultValue: z.record(z.string(), PrimOrArrOrObjZ).optional(),
})

const CommonParamZ = z.object({
  type: z.literal("param"),
  name: z.string(),
  required: z.boolean().optional(),
  description: z.string().optional(),
})

export const ParamZ = z.discriminatedUnion("pType", [
  CommonParamZ.extend({
    pType: z.literal("string"),
    constraints: StringConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    pType: z.literal("number"),
    constraints: NumberConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    pType: z.literal("boolean"),
    constraints: BooleanConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    pType: z.literal("array"),
    constraints: ArrayConstraintZ.optional(),
  }),
  CommonParamZ.extend({
    pType: z.literal("object"),
    constraints: ObjectConstraintZ.optional(),
  }),
])

export const FunctionMetadataZ = z.object({
  type: z.literal("funtion"),
  name: z.string(),
  params: z.array(ParamZ).optional(),
  isAsync: z.boolean().optional(),
  description: z.string().optional(),
})

export const ClassMetadataZ = z.object({
  type: z.literal("class"),
  name: z.string(),
  construct: z.array(ParamZ).optional(),
  methods: z.array(FunctionMetadataZ).optional(),
  description: z.string().optional(),
})

export const TestCaseZ = z.object({
  input: PrimOrArrOrObjZ,
  output: PrimOrArrOrObjZ,
})

export const MetaZ = z.record(z.string(),
  z.union([FunctionMetadataZ, ClassMetadataZ])
)

export const JsonMetaDataZ = z.object({
  testCases: z.array(TestCaseZ).optional(),
  meta: MetaZ,
})

export const LogZ = z.object({
  input: PrimOrArrOrObjZ,
  output: PrimOrArrOrObjZ,
  error: z.string().optional(),
  method: z.string().optional(),
})

export const FnOrClsArrZ = z.array(
  z.union([FunctionMetadataZ, ClassMetadataZ])
)

export type numberConstraintT = z.infer<typeof NumberConstraintZ>
export type stringConstraintT = z.infer<typeof StringConstraintZ>
export type arrayConstraintT = z.infer<typeof ArrayConstraintZ>
export type paramT = z.infer<typeof ParamZ>
export type functionMetadataT = z.infer<typeof FunctionMetadataZ>
export type classMetadataT = z.infer<typeof ClassMetadataZ>
export type fnOrClsArrT = z.infer<typeof FnOrClsArrZ>
export type jsonMetaDataT = z.infer<typeof JsonMetaDataZ>
export type testCaseT = z.infer<typeof TestCaseZ>
export type metaT = z.infer<typeof MetaZ>
export type logT = z.infer<typeof LogZ>
