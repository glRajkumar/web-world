
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 143,
      output: true
    },
    {
      input: 371,
      output: true
    },
    {
      input: 12,
      output: false
    }
  ],
  meta: {
    armstrongNum: {
      type: "function",
      name: "armstrongNum",
      params: [{
        name: "num",
        type: "number",
        defaultValue: 1,
        constraints: {
          min: 1
        }
      }]
    }
  }
}
