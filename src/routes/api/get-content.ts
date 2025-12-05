import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import path from 'path'
import fs from 'fs'

export const Route = createFileRoute('/api/get-content')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const search = url.searchParams

        const filePath = search.get('path')

        if (!filePath) {
          return new Response("File path is required", {
            status: 400
          })
        }

        const absolute = path.join(process.cwd(), "src", filePath)
        const content = await fs.promises.readFile(absolute, "utf8")

        return json({ content })
      }
    }
  }
})
