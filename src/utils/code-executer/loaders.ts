import { extractMetadataFromFile } from "./extractor"
import { mergeParams } from "./merger"
import path from "path"

type rt = Promise<{
  executers: (functionMetadataT | classMetadataT)[]
  testCases: testCaseT[]
}>
export async function loadMetadata(filePath: string): rt {
  const source = path.join("src", filePath)
  const codePath = path.join(process.cwd(), source)
  const metadata = extractMetadataFromFile(codePath)

  const executers: (functionMetadataT | classMetadataT)[] = []

  const metaModules = import.meta.glob("/src/test-cases/problems/**/*.ts")
  const metaModule = await metaModules[`/src/test-cases${filePath.replace(/\\/g, "/")}`]()

  const metaBase = (metaModule as any)["metadata"] as jsonMetaDataT ?? {}
  const staticMeta = metaBase.meta ?? {}

  for (const item of metadata) {
    if (item.type === "function") {
      const staticItem = staticMeta[item.name] as functionMetadataT

      executers.push({
        ...item,
        ...staticItem,
        params: mergeParams(item.params, staticItem?.params),
      })

    } else {
      const staticItem = staticMeta[item.name] as classMetadataT
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
