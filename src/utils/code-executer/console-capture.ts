import { outputText } from "./output"

export function captureConsole() {
  const consoleLogs: string[] = []
  const originalConsoleLog = console.log
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn
  const originalConsoleInfo = console.info

  const captureFn = (...args: any[]) => {
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return outputText(arg as primOrArrOrObjT)
        } catch {
          return String(arg)
        }
      }
      if (arg === null) return 'null'
      if (arg === undefined) return 'undefined'
      return String(arg)
    })

    // const formatted = formattedArgs.filter((_, i) => i > 0).join(' ') // ?.split("→  ")?.[1]
    const filtered = formattedArgs.filter((_, i) => i > 0)
    const formatted = filtered[filtered.length - 1]
    consoleLogs.push(formatted)
  }

  console.log = captureFn as typeof console.log
  console.error = captureFn as typeof console.error
  console.warn = captureFn as typeof console.warn
  console.info = captureFn as typeof console.info

  const restore = () => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    console.info = originalConsoleInfo
  }

  return { consoleLogs, restore }
}

