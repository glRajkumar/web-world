import path from "node:path"
import fs from "node:fs";

import { toCamelCase, toTitle } from "../utils.js"

function files(name) {
  if (!name.includes("/")) {
    throw new Error(
      `Invalid name "${name}". Expected format: <folder>/<problem-name>`
    )
  }

  const [root, base] = name.split("/")
  const fnName = toCamelCase(base)

  const contPath = path.join("content", "docs", "problems", root, `${base}.mdx`)
  const contCont = `---
title: ${toTitle(base)}
description: desc
isProbStateDesc: true
---

<ProblemWrapper path="/problems/${name}" />
`

  const probPath = path.join("problems", root, `${base}.ts`)
  const probCont = `
export function ${fnName}() {
 
}
`

  const tcPath = path.join("test-cases", "problems", root, `${base}.ts`)
  const tcCont = `
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: "",
      output: ""
    },
    {
      input: "",
      output: ""
    },
    {
      input: "",
      output: ""
    }
  ],
  meta: {
    ${fnName}: {
      type: "function",
      name: "${fnName}",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 1,
        constraints: {
          min: 1
        }
      }]
    }
  }
}
`

  const jsonPath = path.join("src", "content", "docs", "problems", root, "meta.json")
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  json.pages.push(base)
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), "utf8")

  return [
    { path: contPath, content: contCont },
    { path: probPath, content: probCont },
    { path: tcPath, content: tcCont },
  ]
}

export default { files }