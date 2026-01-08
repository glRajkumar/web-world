
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "A\nAB"
    },
    {
      input: 3,
      output: "A\nAB\nABC"
    },
    {
      input: 5,
      output: "A\nAB\nABC\nABCD\nABCDE"
    }
  ],
  meta: {
    p14: {
      type: "function",
      name: "p14",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 26,
        }
      }]
    },
  }
}
