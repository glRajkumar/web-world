import { useState } from "react"

export function useLogs() {
  const [logs, setLogs] = useState<logT[]>([])

  const addLog = (log: Omit<logT, 'id'>) => {
    setLogs(prev => [
      ...prev,
      {
        ...log,
        id: `${Date.now()}-${Math.random()}`,
      }
    ])
  }

  const clearById = (id: string) => setLogs(prev => prev.filter(p => p.id !== id))
  const clearLogs = () => setLogs([])

  return {
    logs,
    addLog,
    clearById,
    clearLogs,
  }
}
