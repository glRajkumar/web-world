
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "**\n**"
    },
    {
      input: 3,
      output: "***\n***\n***"
    },
    {
      input: 5,
      output: "*****\n*****\n*****\n*****\n*****"
    }
  ],
  meta: {
    p1_1: {
      type: "function",
      name: "p1_1",
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
    p1_2: {
      type: "function",
      name: "p1_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 24,
        }
      }]
    }
  }
}
