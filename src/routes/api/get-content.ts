import { createFileRoute } from '@tanstack/react-router'
import path from 'path'
import fs from 'fs'

export const Route = createFileRoute('/api/get-content')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const raw = url.searchParams.get("path")

        if (!raw) {
          return new Response("File path is required", {
            status: 400
          })
        }

        const filePath = decodeURIComponent(raw)

        const absolute = path.join(process.cwd(), "src", filePath)
        const code = await fs.promises.readFile(absolute, "utf8")

        const content = code.replaceAll("export ", "").trim()
        return Response.json({ content })
      }
    }
  }
})
