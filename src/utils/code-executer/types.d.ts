type primitiveT = string | number | boolean | null | undefined

type primOrArrOrObjT = primitiveT | primArrT | primObjT

type primArrT = Array<primOrArrOrObjT>
type primObjT = {
  [key: string]: primOrArrOrObjT
}

type numberConstraintT = {
  min?: number
  max?: number
  step?: number
}

type stringConstraintT = {
  minLength?: number
  maxLength?: number
  pattern?: string
}

type enumConstraintT = {
  values: primitiveT[]
}

type objectConstraintT = {
  template?: ConstraintLeafT
  by?: Record<string, ConstraintLeafT>
}

type arrayConstraintT = {
  min?: number
  max?: number
  canIncludeFalsy?: boolean
  template?: ConstraintLeafT
  by?: Record<number, ConstraintLeafT>
}

type ConstraintLeafT =
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

type paramT =
  | stringParamT
  | numberParamT
  | booleanParamT
  | arrayParamT
  | objectParamT
  | enumParamT
  | untypedParamT

type functionMetadataT = {
  type: "function"
  name: string
  params?: paramT[]
  isAsync?: boolean
  description?: string
}

type classMetadataT = {
  type: "class"
  name: string
  construct?: paramT[]
  methods?: functionMetadataT[]
  description?: string
}

type fnOrClsArrT = Array<functionMetadataT | classMetadataT>

type testCaseT = {
  input: primOrArrOrObjT
  output: primOrArrOrObjT
}

type metaT = Record<string, functionMetadataT | classMetadataT>

type jsonMetaDataT = {
  testCases?: testCaseT[]
  meta: metaT
}

type logT = {
  id: string
  input: Record<string, primOrArrOrObjT>
  output: primOrArrOrObjT
  name?: string
  error?: string
}
