import * as fs from "fs"
import ts from "typescript"

import type { fnOrClsArrT, paramT } from "./schema"

function extractParameters(parameters: ts.NodeArray<ts.ParameterDeclaration>): paramT[] {
  return parameters
    .filter((param) => !param.modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword))
    .map((param) => {
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

      return {
        type: "param",
        pType: type,
        name: param.name?.getText() || "",
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
        type: "funtion",
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
      const methods = node.members.filter(
        (m) => ts.isMethodDeclaration(m) && !m.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.PrivateKeyword),
      )

      items.push({
        type: "class",
        name: node.name.text,
        construct: constructor ? extractParameters(constructor.parameters) : [],
        methods: (methods as ts.MethodDeclaration[]).map((method) => ({
          type: "funtion",
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

export async function getFnOrCls(filePath: string, name: string): Promise<Function> { // | (new (...args: any[]) => any
  const modules = import.meta.glob("/src/problems/**/*.ts")
  const module = await modules["/src" + filePath]()
  const fnOrCls = (module as any)[name]

  if (!fnOrCls) {
    throw new Error(`Export "${name}" not found in ${filePath}`)
  }

  return fnOrCls
}
