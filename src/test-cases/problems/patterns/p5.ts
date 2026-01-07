
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "**\n*"
    },
    {
      input: 3,
      output: "***\n**\n*"
    },
    {
      input: 5,
      output: "*****\n****\n***\n**\n*"
    }
  ],
  meta: {
    p5_1: {
      type: "function",
      name: "p5_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 24,
        }
      }]
    },
    p5_2: {
      type: "function",
      name: "p5_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 24,
        }
      }]
    },
  }
}
