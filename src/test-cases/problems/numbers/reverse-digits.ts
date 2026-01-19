
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 1234,
      output: 4321
    },
    {
      input: 369,
      output: 963
    },
    {
      input: 22876,
      output: 67822
    }
  ],
  meta: {
    reverseDigits: {
      type: "function",
      name: "reverseDigits",
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
