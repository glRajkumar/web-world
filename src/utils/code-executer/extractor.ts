import ts from "typescript"
import fs from "fs"

function getInitializerValue(initializer?: ts.Expression): any {
  if (!initializer) return undefined

  if (ts.isNumericLiteral(initializer)) {
    return Number(initializer.text)
  }

  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text
  }

  if (initializer.kind === ts.SyntaxKind.TrueKeyword) return true
  if (initializer.kind === ts.SyntaxKind.FalseKeyword) return false
  if (initializer.kind === ts.SyntaxKind.NullKeyword) return null

  if (ts.isPrefixUnaryExpression(initializer) && initializer.operator === ts.SyntaxKind.MinusToken) {
    const value = getInitializerValue(initializer.operand)
    return typeof value === "number" ? -value : undefined
  }

  if (ts.isArrayLiteralExpression(initializer)) {
    return initializer.elements.map((el) => getInitializerValue(el as ts.Expression))
  }

  if (ts.isObjectLiteralExpression(initializer)) {
    const result: Record<string, any> = {}

    initializer.properties.forEach((prop) => {
      if (ts.isPropertyAssignment(prop)) {
        let key: string | undefined

        if (ts.isIdentifier(prop.name)) {
          key = prop.name.text
        }
        else if (ts.isStringLiteral(prop.name)) {
          key = prop.name.text
        }
        else if (ts.isNumericLiteral(prop.name)) {
          key = prop.name.text
        }

        if (key !== undefined) {
          result[key] = getInitializerValue(prop.initializer as ts.Expression)
        }
      }
    })

    return result
  }

  return initializer.getText()
}

function extractParameters(parameters: ts.NodeArray<ts.ParameterDeclaration>): paramT[] {
  return parameters.map((param) => {
    let type = "string"

    if (param.type) {
      if (param.type.kind === ts.SyntaxKind.NumberKeyword) {
        type = "number"
      }
      else if (param.type.kind === ts.SyntaxKind.BooleanKeyword) {
        type = "boolean"
      }
      else if (ts.isArrayTypeNode(param.type)) {
        type = "array"
      }
      else if (ts.isTypeReferenceNode(param.type) && param.type.typeName) {
        const typeName = param.type.typeName.getText()
        type = typeName === "Array" ? "array" : typeName
      }
    }

    const isOptional = Boolean(param.questionToken || param.initializer)
    const defaultValue = getInitializerValue(param.initializer)

    return {
      type,
      name: param.name?.getText() || "",
      required: !isOptional,
      ...(defaultValue ? { defaultValue } : {}),
    } as paramT
  })
}

export function extractMetadataFromFile(filePath: string): fnOrClsArrT {
  const sourceCode = fs.readFileSync(filePath, "utf-8")
  const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true)

  const items: fnOrClsArrT = []

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const params = extractParameters(node.parameters)
      items.push({
        type: "function",
        name: node.name.text,
        params,
        isAsync: node.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) ?? false,
      })
    }

    if (
      ts.isClassDeclaration(node) &&
      node.name &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const constructor = node.members.find(ts.isConstructorDeclaration)
      const methods = node.members.filter(m => {
        if (!ts.isMethodDeclaration(m)) return false

        const hasPrivateModifier = m.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.PrivateKeyword)
        if (hasPrivateModifier) return false

        const methodName = m.name?.getText(sourceFile) || ""
        if (methodName.startsWith('_')) return false

        return true
      })

      items.push({
        type: "class",
        name: node.name.text,
        construct: constructor ? extractParameters(constructor.parameters) : [],
        methods: (methods as ts.MethodDeclaration[]).map((method) => ({
          type: "function",
          name: method.name?.getText(sourceFile) || "",
          params: extractParameters(method.parameters),
          isAsync: method.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) ?? false,
        })),
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return items
}

export async function getFnOrCls(filePath: string, name: string): Promise<Function> {
  const modules = import.meta.glob("/src/problems/**/*.ts")
  const module = await modules["/src" + filePath]()
  const fnOrCls = (module as any)[name]

  if (!fnOrCls) {
    throw new Error(`Export "${name}" not found in ${filePath}`)
  }

  return fnOrCls
}
