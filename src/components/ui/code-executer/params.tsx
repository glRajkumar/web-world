import { useMemo, useState } from "react"
import { FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash } from "lucide-react"

import type {
  paramT,
  ConstraintLeafT,
  enumConstraintT,
  arrayConstraintT,
  stringConstraintT,
  numberConstraintT,
  objectConstraintT,
} from "@/utils/code-executer/schema"

import { getDefaultValueByConstraints } from "@/utils/code-executer/get-default"
import { cn } from "@/lib/utils"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { InputWrapper, SwitchWrapper, SelectWrapper as EnumSelectWrapper } from "@/components/shadcn-ui/field-wrapper-rhf"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/shadcn-ui/field"
import { SelectWrapper } from "@/components/shadcn-ui/select"
import { Textarea } from "@/components/shadcn-ui/textarea"
import { Button } from "@/components/shadcn-ui/button"
import { Switch } from "@/components/shadcn-ui/switch"
import { Badge } from "@/components/shadcn-ui/badge"
import { Input } from "@/components/shadcn-ui/input"

function isConstraintLeaf(
  c: objectConstraintT | ConstraintLeafT | undefined,
): c is ConstraintLeafT {
  return !!c && typeof c === "object" && "type" in c
}

function isObjectConstraint(
  c: objectConstraintT | ConstraintLeafT | undefined,
): c is objectConstraintT {
  return !!c &&
    typeof c === "object" &&
    !("type" in c) &&
    ("template" in c || "by" in c)
}

function getObjectConstraintLabel(constraints?: objectConstraintT): string {
  if (!constraints) return "Object"

  if (isObjectConstraint(constraints)) {
    const { template, by } = constraints
    const keys = by ? Object.keys(by) : []
    const preview = keys.slice(0, 3).map(key => {
      const constraint = by?.[key]
      return `${key}: ${constraint?.type}`
    }).join("; ")

    const remaining = keys.length - 3
    const templatePart = template ? `template: ${template.type}` : ""
    const parts = [templatePart, preview].filter(Boolean)

    return `Object{${parts.join("; ")}${remaining > 0 ? `; +${remaining} more` : ""}}`
  }

  if (isConstraintLeaf(constraints) && (constraints as any)?.type === "object" && (constraints as any)?.constraints) {
    const innerConstraints = (constraints as any).constraints
    if ('by' in innerConstraints && innerConstraints.by) {
      const keys = Object.keys(innerConstraints.by).slice(0, 3)
      const preview = keys.map(key => {
        const constraint = innerConstraints.by[key]
        return `${key}: ${constraint.type}`
      }).join("; ")

      const remaining = Object.keys(innerConstraints.by).length - 3
      const templatePart = innerConstraints.template ? `template: ${innerConstraints.template.type}` : ""
      const parts = [templatePart, preview].filter(Boolean)

      return `Object{${parts.join("; ")}${remaining > 0 ? `; +${remaining} more` : ""}}`
    }
  }

  return "Object"
}

function isPredefinedConstraint(
  constraints: arrayConstraintT | undefined,
  index: number
): boolean {
  return !!(constraints?.by && constraints.by[index])
}

interface ParamFieldProps<T extends FieldValues> {
  param: paramT
  name: Path<T>
}

export function ParamField<T extends FieldValues>({ param, name }: ParamFieldProps<T>) {
  return (
    <FieldRenderer
      name={name}
      label={param.name}
      description={param.description}
      type={param.type}
      constraints={(param as any)?.constraints}
    />
  )
}

function ObjTextField({ name, type, isInvalid }: { name: string, type: string, isInvalid: boolean }) {
  const { clearErrors, setValue, setError, watch } = useFormContext()
  const oldVal = watch(name)

  const [val, setVal] = useState(oldVal ? JSON.stringify(oldVal, null, 2) : "")

  function getVal() {
    try {
      const str = JSON.stringify(oldVal, null, 2)
      return val === str ? str : val

    } catch (error) {
      return val
    }
  }

  function onBlur() {
    if (!val) return
    try {
      const value = JSON.parse(val)
      setValue(name, value)
      clearErrors(name)

    } catch (error) {
      setError(name, { message: `Error on ${type}`, type: "custom" }, { shouldFocus: true })
    }
  }

  return (
    <Textarea
      id={name}
      rows={6}
      value={getVal()}
      onBlur={onBlur}
      onChange={e => setVal(e.target.value)}
      placeholder={`Enter JSON ${type}`}
      aria-invalid={isInvalid}
    />
  )
}

interface FieldRendererProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  type?: string
  constraints?: ConstraintLeafT
}

function FieldRenderer<T extends FieldValues>({
  name,
  label,
  description,
  type,
  constraints,
}: FieldRendererProps<T>) {
  if (!type) {
    return (
      <DynamicTypeField
        name={name}
        label={label}
        description={description}
      />
    )
  }

  switch (type) {
    case "array":
      return (
        <ArrayField
          name={name}
          label={label}
          description={description}
          constraints={constraints as arrayConstraintT}
        />
      )

    case "object":
      return (
        <ObjectField
          name={name}
          label={label}
          description={description}
          constraints={constraints as objectConstraintT}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={name}
          label={label}
          description={description}
        />
      )

    case "number":
      return (
        <NumberField
          name={name}
          label={label}
          description={description}
          constraints={constraints as numberConstraintT}
        />
      )

    case "enum":
      return (
        <EnumField
          name={name}
          label={label}
          description={description}
          constraints={constraints as any}
        />
      )

    default:
      return (
        <StringField
          name={name}
          label={label}
          description={description}
          constraints={constraints as stringConstraintT}
        />
      )
  }
}

interface DynamicTypeFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
}

function getDefaultType(val: any) {
  if (typeof val === "object") {
    if (val === null) return "String"
    if (Array.isArray(val)) return "Array"
    return "Object"
  }

  if (typeof val === "boolean") return "Boolean"
  if (typeof val === "number") return "Number"
  return "String"
}

function DynamicTypeField<T extends FieldValues>({
  name,
  label,
  description,
}: DynamicTypeFieldProps<T>) {
  const { formState: { errors }, setValue, watch } = useFormContext<T>()
  const currentValue = watch(name)

  const [selectedType, setSelectedType] = useState(getDefaultType(currentValue))
  const isInvalid = !!errors?.[name]

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    switch (newType) {
      case "Boolean":
        setValue(name, false as any)
        break
      case "Number":
        setValue(name, 0 as any)
        break
      case "Array":
        setValue(name, [] as any)
        break
      case "Object":
        setValue(name, {} as any)
        break
      default:
        setValue(name, "" as any)
    }
  }

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <SelectWrapper
        value={selectedType}
        onValueChange={handleTypeChange}
        triggerCls="mb-1"
        options={["String", "Number", "Boolean", "Array", "Object"]}
      />

      {selectedType === "String" && (
        <Input
          id={name}
          value={(currentValue as string) ?? ""}
          onChange={(e) => setValue(name, e.target.value as any)}
          placeholder="Enter string value"
        />
      )}

      {selectedType === "Number" && (
        <Input
          id={name}
          type="number"
          value={(currentValue as number) ?? 0}
          onChange={e => {
            const val = e.target.valueAsNumber
            const final = Number.isNaN(val) ? "" : val
            setValue(name, final as any)
          }}
          placeholder="Enter number value"
        />
      )}

      {selectedType === "Boolean" && (
        <div>
          <Switch
            id={name}
            checked={!!currentValue}
            onCheckedChange={(v) => setValue(name, v as any)}
          />
        </div>
      )}

      {(selectedType === "Array" || selectedType === "Object") && (
        <ObjTextField
          name={name}
          type={selectedType}
          isInvalid={isInvalid}
        />
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[{ message: errors?.[name]?.message as string }]} />}
    </Field>
  )
}

interface StringFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: stringConstraintT
}

function StringField<T extends FieldValues>({
  name,
  label,
  description,
  constraints = {},
}: StringFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      placeholder={`Enter ${label}`}
      {...constraints}
    />
  )
}

interface NumberFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: numberConstraintT
}

function NumberField<T extends FieldValues>({
  name,
  label,
  description,
  constraints = {},
}: NumberFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      type="number"
      label={label}
      control={control}
      description={description}
      placeholder={`Enter ${label}`}
      {...constraints}
    />
  )
}

interface BooleanFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
}

function BooleanField<T extends FieldValues>({
  name,
  label,
  description,
}: BooleanFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <SwitchWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      className="[&_div]:justify-start"
    />
  )
}

interface EnumFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints: enumConstraintT
}

function EnumField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
}: EnumFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <EnumSelectWrapper
      name={name}
      label={label}
      control={control}
      options={constraints.values as string[]}
      description={description}
    />
  )
}

interface ArrayFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: arrayConstraintT
}

function ArrayField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
}: ArrayFieldProps<T>) {
  const { control } = useFormContext<T>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  })

  const handleAdd = () => {
    const defaultVal = constraints?.template
      ? getDefaultValueByConstraints(constraints.template)
      : ""
    append(defaultVal as any)
  }

  return (
    <Card className="@container overflow-x-auto">
      <CardHeader className="flex items-center gap-2 flex-wrap min-w-80">
        <div className="flex items-center gap-2 flex-wrap mr-auto">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary" className="@md:hidden">Array</Badge>
          <Badge variant="secondary" className="hidden @md:block">
            Array{constraints?.template ? `[${constraints.template.type}]` : ""}
          </Badge>

          <Badge variant="outline">
            {fields.length} items
          </Badge>

          {constraints?.min !== undefined && (
            <Badge variant="outline">
              min: {constraints.min}
            </Badge>
          )}

          {constraints?.max !== undefined && (
            <Badge variant="outline">
              max: {constraints.max}
            </Badge>
          )}
        </div>

        {description && (
          <CardDescription className="@md:order-1 w-full">{description}</CardDescription>
        )}

        <CardAction>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleAdd}
            disabled={constraints?.max !== undefined && fields.length >= constraints.max}
          >
            <Plus className="h-4 w-4" />
            Add {constraints?.max !== undefined && `(${fields.length}/${constraints.max})`}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 min-w-80">
        {fields.map((field, index) => {
          const itemName = `${name}.${index}` as Path<T>
          const itemConstraint: any = constraints?.by?.[index] || constraints?.template
          const isPredefined = isPredefinedConstraint(constraints, index)
          const canDelete = !isPredefined && (constraints?.min === undefined || fields.length > constraints.min)

          return (
            <div
              key={field.id}
              className={cn(
                "flex gap-2",
                itemConstraint?.type === "boolean" ? "items-center" : "items-start"
              )}
            >
              <div className="flex-1">
                <FieldRenderer
                  name={itemName}
                  label={`Item ${index + 1}`}
                  type={itemConstraint?.type}
                  constraints={itemConstraint?.constraints}
                />
              </div>

              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                disabled={!canDelete}
                title={
                  isPredefined
                    ? "Cannot delete predefined item"
                    : !canDelete
                      ? `Minimum ${constraints?.min} items required`
                      : "Delete item"
                }
                className={cn(itemConstraint?.type !== "boolean" && "mt-6")}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

interface ObjectFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: objectConstraintT
}

function ObjectField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
}: ObjectFieldProps<T>) {
  const { setValue, watch } = useFormContext<T>()
  const [newKey, setNewKey] = useState("")

  const currentValue: Record<string, unknown> = (watch(name) as any) ?? {}
  const objectKeys = Object.keys(currentValue)

  const list = useMemo(() => {
    return Object.keys(currentValue).map(k => {
      let root = constraints?.by?.[k] || constraints?.template
      if (root?.type === "object" && root?.constraints && (root?.constraints?.by?.[k] || root?.constraints?.template)) {
        root = root?.constraints?.by?.[k] || root?.constraints?.template
      }
      return {
        name: `${name}.${k}`,
        label: k,
        ...(root)
      } as {
        name: string
        label: string
        description?: string
        type?: string
        constraints?: ConstraintLeafT
      }
    })
  }, [currentValue, constraints])

  const handleAddKey = () => {
    const key = newKey.trim()
    if (!key || currentValue[key] !== undefined) return
    setValue(name, {
      ...currentValue,
      [newKey]: ""
    } as any)
    setNewKey("")
  }

  const handleDeleteKey = (key: string) => {
    const newVal = { ...currentValue }
    delete newVal[key]
    setValue(name, newVal as any)
  }

  return (
    <Card className="@container overflow-x-auto">
      <CardHeader className="flex items-center gap-2 flex-wrap min-w-80">
        <div className="flex items-center gap-2 flex-wrap mr-auto">
          <CardTitle>{label}</CardTitle>
          <Badge variant="secondary" className="@md:hidden">Object</Badge>
          <Badge variant="secondary" className="hidden @md:block">{getObjectConstraintLabel(constraints)}</Badge>
          <Badge variant="outline">{objectKeys.length} keys</Badge>
        </div>

        {description && (
          <CardDescription className="@md:order-1 w-full">{description}</CardDescription>
        )}

        <CardAction className="flex items-center gap-2">
          <Input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="Key name"
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddKey()
              }
            }}
          />
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleAddKey}
            disabled={!newKey.trim() || currentValue[newKey.trim()] !== undefined}
            className="h-9"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden @lg:block">Add</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 min-w-80">
        {list.map((param) => (
          <div
            key={param.name}
            className={cn(
              "flex gap-2",
              param?.type === "boolean" ? "items-center" : "items-start"
            )}
          >
            <div className="flex-1">
              <FieldRenderer {...param} />
            </div>

            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => handleDeleteKey(param?.label)}
              className={cn(param?.type !== "boolean" && "mt-6")}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
