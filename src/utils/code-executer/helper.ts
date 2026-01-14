
export async function getFnOrCls(filePath: string, name: string): Promise<Function> {
  const modules = import.meta.glob("/src/problems/**/*.ts")
  const module = await modules["/src" + filePath]()
  const fnOrCls = (module as any)[name]

  if (!fnOrCls) {
    throw new Error(`Export "${name}" not found in ${filePath}`)
  }

  return fnOrCls
}
