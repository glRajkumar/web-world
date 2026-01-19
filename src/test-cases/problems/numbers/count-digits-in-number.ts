
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 227621,
      output: 6
    },
    {
      input: 31363,
      output: 5
    },
    {
      input: 53,
      output: 2
    }
  ],
  meta: {
    countDigitsInNumber: {
      type: "function",
      name: "countDigitsInNumber",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 52,
        constraints: {
          min: 1
        }
      }]
    }
  }
}
