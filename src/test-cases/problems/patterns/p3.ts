
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n12"
    },
    {
      input: 3,
      output: "1\n12\n123"
    },
    {
      input: 5,
      output: "1\n12\n123\n1234\n12345"
    }
  ],
  meta: {
    p3_1: {
      type: "function",
      name: "p3_1",
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
    p3_2: {
      type: "function",
      name: "p3_2",
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
