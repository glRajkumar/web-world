
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "12\n1"
    },
    {
      input: 3,
      output: "123\n12\n1"
    },
    {
      input: 5,
      output: "12345\n1234\n123\n12\n1"
    }
  ],
  meta: {
    p6_1: {
      type: "function",
      name: "p6_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 18,
        }
      }]
    },
    p6_2: {
      type: "function",
      name: "p6_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 18,
        }
      }]
    },
  }
}
