import { z } from "zod"

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
  name: z.string(),
  type: z.enum(["number", "string", "boolean", "array", "object"]),
  constraints: z.union([NumberConstraintZ, StringConstraintZ, ArrayConstraintZ]).optional(),
})

const FunctionMetadataZ = z.object({
  type: z.literal("funtion"),
  name: z.string(),
  params: z.array(ParamZ).optional(),
  isAsync: z.boolean().optional(),
})

const ClassMetadataZ = z.object({
  type: z.literal("class"),
  name: z.string(),
  constructor: z.object({ params: z.array(ParamZ).optional() }).optional(),
  methods: z.array(FunctionMetadataZ).optional(),
})

export const FileMetadataZ = z.array(z.union([FunctionMetadataZ, ClassMetadataZ]))

export type NumberConstraintT = z.infer<typeof NumberConstraintZ>
export type StringConstraintT = z.infer<typeof StringConstraintZ>
export type ArrayConstraintT = z.infer<typeof ArrayConstraintZ>
export type ParamT = z.infer<typeof ParamZ>
export type FunctionMetadataT = z.infer<typeof FunctionMetadataZ>
export type ClassMetadataT = z.infer<typeof ClassMetadataZ>
export type FileMetadataT = z.infer<typeof FileMetadataZ>
