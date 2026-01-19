import path from "node:path"
import fs from "node:fs"

import problemGen from "./templates/problem.js"

const generators = {
  problem: problemGen,
}

const [, , type, name] = process.argv

if (!type || !name) {
  console.error("❌ Usage: gen <type> <name>")
  console.error("Available types:", Object.keys(generators).join(", "))
  process.exit(1)
}

const generator = generators[type]
if (!generator) {
  console.error(`❌ Unknown type: ${type}`)
  process.exit(1)
}

let files
try {
  files = generator.files(name)
} catch (err) {
  console.error(`❌ ${err.message}`)
  process.exit(1)
}

files.forEach(({ path: relativePath, content }) => {
  const filePath = path.join(process.cwd(), "src", relativePath)
  const dir = path.dirname(filePath)

  fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(filePath)) {
    console.error(`❌ File already exists: ${filePath}`)
    process.exit(1)
  }

  fs.writeFileSync(filePath, content, "utf8")
  console.log(`✅ Created: ${filePath}`)
})
