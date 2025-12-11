import type { jsonMetaDataT } from "@/utils/code-executer/schema"

export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "* *\n* *"
    },
    {
      input: 3,
      output: "* * *\n* * *\n* * *"
    },
    {
      input: 5,
      output: "* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *"
    }
  ],
  meta: {
    p1_1: {
      type: "function",
      name: "p1_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 2,
        constraints: {
          min: 10,
          max: 11,
        }
      }]
    }
  }
}
