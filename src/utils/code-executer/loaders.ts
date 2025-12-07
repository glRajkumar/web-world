import type { ParamT, jsonMetaDataT, FunctionMetadataT, ClassMetadataT, testCasesT } from "./schema"
import { extractMetadataFromFile } from "./extractor"
import * as path from "path"

function mergeParams(params: ParamT[] = [], newParams: ParamT[] = []): ParamT[] {
  return params.map((oldParam) => {
    const updated = newParams.find((p) => p.name === oldParam.name)

    if (updated) {
      return {
        ...oldParam,
        ...updated,
        constraints: {
          ...oldParam.constraints,
          ...updated.constraints,
        },
      }
    }

    return oldParam
  })
}

type rt = Promise<{
  executers: (FunctionMetadataT | ClassMetadataT)[]
  testCases: testCasesT[]
}>
export async function loadMetadata(filePath: string): rt {
  const source = path.join("src", filePath)
  const codePath = path.join(process.cwd(), source)
  const metadata = extractMetadataFromFile(codePath)

  const executers: (FunctionMetadataT | ClassMetadataT)[] = []

  const metaModules = import.meta.glob("/src/test-cases/problems/**/*.ts")
  const metaModule = await metaModules[`/src/test-cases${filePath.replace(/\\/g, "/")}`]()

  const metaBase = (metaModule as any)["metadata"] as jsonMetaDataT ?? {}
  const staticMeta = metaBase.meta ?? {}

  for (const item of metadata) {
    if (item.type === "funtion") {
      const staticItem = staticMeta[item.name] as FunctionMetadataT

      executers.push({
        ...item,
        ...staticItem,
        params: mergeParams(item.params, staticItem?.params),
      })

    } else {
      const staticItem = staticMeta[item.name] as ClassMetadataT
      executers.push({
        ...item,
        ...staticItem,
        construct: mergeParams(item?.construct, staticItem?.construct),
        methods: item.methods?.map(m => {
          const staticMethod = staticItem?.methods?.find(sm => sm.name === m.name)
          return {
            ...m,
            params: mergeParams(m.params, staticMethod?.params)
          }
        }),
      })
    }
  }

  return {
    executers,
    testCases: metaBase?.testCases || [],
  }
}
