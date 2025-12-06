import type { FunctionMetadataT, ClassMetadataT } from "./schema"
import { extractMetadataFromFile } from "./extractor"
import * as path from "path"

type fnT = FunctionMetadataT & { compiledFn: Function }
type clsT = ClassMetadataT & { compiledFCls: any }

type rt = Promise<{
  functions: fnT[]
  classes: clsT[]
}>

export async function loadMetadata(filePath: string): rt {
  const source = path.join("src", filePath)
  const codePath = path.join(process.cwd(), source)
  const metadata = extractMetadataFromFile(codePath)

  const functions: fnT[] = []
  const classes: clsT[] = []

  const modules = import.meta.glob("/src/problems/**/*.ts")
  const fns = await modules[`/${source.replace(/\\/g, "/")}`]()

  for (const item of metadata) {
    const fn = (fns as any)[item.name]
    if (!fn) continue

    if (item.type === "funtion") {
      functions.push({
        name: item.name,
        type: "funtion",
        params: item.params,
        compiledFn: fn,
      })

    } else {
      classes.push({
        name: item.name,
        type: "class",
        constructor: item.constructor,
        methods: item.methods,
        compiledFCls: fn,
      })
    }
  }

  return { functions, classes }
}
