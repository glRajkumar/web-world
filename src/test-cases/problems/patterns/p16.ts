
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "A\nBB"
    },
    {
      input: 3,
      output: "A\nBB\nCCC"
    },
    {
      input: 5,
      output: "A\nBB\nCCC\nDDDD\nEEEEE"
    }
  ],
  meta: {
    p16: {
      type: "function",
      name: "p16",
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
