
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "AB\nA"
    },
    {
      input: 3,
      output: "ABC\nAB\nA"
    },
    {
      input: 5,
      output: "ABCDE\nABCD\nABC\nAB\nA"
    }
  ],
  meta: {
    p15: {
      type: "function",
      name: "p15",
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
