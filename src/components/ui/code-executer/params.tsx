import { FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash } from "lucide-react"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { InputWrapper, SwitchWrapper } from "@/components/shadcn-ui/field-wrapper-rhf"
import { Button } from "@/components/shadcn-ui/button"
import { Badge } from "@/components/shadcn-ui/badge"

import type {
  paramT,
  arrayConstraintT,
  objectConstraintT,
  stringConstraintT,
  numberConstraintT,
} from "@/utils/code-executer/schema"

import { cn } from "@/lib/utils"

interface ParamFieldProps<T extends FieldValues> {
  param: paramT
  name: Path<T>
  depth?: number
}

export function ParamField<T extends FieldValues>({
  param,
  name,
  depth = 0,
}: ParamFieldProps<T>) {
  switch (param.type) {
    case "array":
      return (
        <ArrayField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints as arrayConstraintT | undefined}
          depth={depth}
        />
      )

    case "object":
      return (
        <ObjectField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints as Record<string, objectConstraintT> | undefined}
          depth={depth}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={name}
          label={param.name}
          description={param.description}
        />
      )

    case "number":
      return (
        <NumberField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )

    default:
      return (
        <StringField
          name={name}
          label={param.name}
          description={param.description}
          constraints={param.constraints}
        />
      )
  }
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
  constraints: { defaultValue, ...rest } = {},
}: StringFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      label={label}
      control={control}
      description={description}
      placeholder={defaultValue || `Enter ${label}`}
      {...rest}
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
  constraints: { defaultValue, ...rest } = {},
}: NumberFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <InputWrapper
      name={name}
      type="number"
      label={label}
      control={control}
      description={description}
      placeholder={defaultValue?.toString() || `Enter ${label}`}
      {...rest}
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
    />
  )
}

interface ArrayItemRendererProps<T extends FieldValues> {
  itemName: Path<T>
  index: number
  constraints?: arrayConstraintT
  depth: number
  label?: string
}

function ArrayItemRenderer<T extends FieldValues>({
  itemName,
  index,
  constraints,
  depth,
}: ArrayItemRendererProps<T>) {
  const { control } = useFormContext<T>()

  const label = `Item ${index + 1}`

  if (!constraints) {
    return (
      <InputWrapper
        name={itemName}
        control={control}
        label={label}
      />
    )
  }

  switch (constraints.type) {
    case "array":
      return (
        <ArrayField
          name={itemName}
          label={label}
          constraints={constraints.constraint}
          depth={depth + 1}
        />
      )

    case "object":
      return (
        <ObjectField
          name={itemName}
          label={label}
          constraints={constraints.constraint}
          depth={depth + 1}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={itemName}
          label={label}
        />
      )

    case "number":
      return (
        <NumberField
          name={itemName}
          label={label}
          constraints={constraints.constraint}
        />
      )

    default:
      return (
        <StringField
          name={itemName}
          label={label}
          constraints={constraints.constraint}
        />
      )
  }
}

interface ArrayFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: arrayConstraintT
  depth: number
}

function ArrayField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
  depth,
}: ArrayFieldProps<T>) {
  const { control } = useFormContext<T>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  })

  const getDefaultValue = () => {
    if (!constraints) return ""

    switch (constraints.type) {
      case "string":
        return constraints.constraint?.defaultValue || ""
      case "number":
        return constraints.constraint?.defaultValue || 0
      case "boolean":
        return constraints.constraint?.defaultValue || false
      case "array":
        return []
      case "object":
        return {}
      default:
        return ""
    }
  }

  return (
    <Card className={cn(depth > 0 && "ml-2")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary" className="ml-2">
            Array[{constraints?.type || "any"}]
          </Badge>

          <Badge variant="outline" className="ml-1">
            {fields.length} items
          </Badge>
        </div>

        {description && (
          <CardDescription>{description}</CardDescription>
        )}

        <CardAction>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => append(getDefaultValue() as any)}
            disabled={constraints?.max !== undefined && fields.length >= constraints.max}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {fields.map((field, index) => {
          const itemName = `${name}.${index}` as Path<T>
          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <ArrayItemRenderer
                  itemName={itemName}
                  index={index}
                  constraints={constraints}
                  depth={depth}
                />
              </div>

              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                disabled={
                  constraints?.min !== undefined &&
                  fields.length <= constraints.min
                }
                className="mt-6"
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

interface ObjectFieldRendererProps<T extends FieldValues> {
  label: string
  fieldName: Path<T>
  constraint: objectConstraintT
  depth: number
}

function ObjectFieldRenderer<T extends FieldValues>({
  label,
  fieldName,
  constraint,
  depth,
}: ObjectFieldRendererProps<T>) {
  switch (constraint.type) {
    case "array":
      return (
        <ArrayField
          name={fieldName}
          label={label}
          constraints={constraint.constraint}
          depth={depth + 1}
        />
      )

    case "object":
      return (
        <ObjectField
          name={fieldName}
          label={label}
          constraints={constraint.constraint}
          depth={depth + 1}
        />
      )

    case "boolean":
      return (
        <BooleanField
          name={fieldName}
          label={label}
        />
      )

    case "number":
      return (
        <NumberField
          name={fieldName}
          label={label}
          constraints={constraint.constraint}
        />
      )

    default:
      return (
        <StringField
          name={fieldName}
          label={label}
          constraints={constraint.constraint}
        />
      )
  }
}

interface ObjectFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  constraints?: Record<string, objectConstraintT>
  depth: number
}

function ObjectField<T extends FieldValues>({
  name,
  label,
  description,
  constraints,
  depth,
}: ObjectFieldProps<T>) {
  if (!constraints || Object.keys(constraints).length === 0) {
    return (
      <Card className={cn("gap-3", depth > 0 && "ml-2")}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{label}</CardTitle>
            <Badge variant="secondary">Object</Badge>
          </div>

          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          No schema defined for this object
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(depth > 0 && "ml-2")}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{label}</CardTitle>

          <Badge variant="secondary">Object</Badge>

          <Badge variant="outline" className="ml-1">
            {Object.keys(constraints).length} fields
          </Badge>
        </div>

        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {Object.entries(constraints).map(([key, constraint]) => {
          const fieldName = `${name}.${key}` as Path<T>

          return (
            <ObjectFieldRenderer
              key={key}
              label={key}
              fieldName={fieldName}
              constraint={constraint}
              depth={depth}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
