
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 3,
      output: "***\n* *\n***"
    },
    {
      input: 4,
      output: "****\n*  *\n*  *\n****"
    },
    {
      input: 5,
      output: "*****\n*   *\n*   *\n*   *\n*****"
    }
  ],
  meta: {
    p21: {
      type: "function",
      name: "p21",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 3,
          max: 26,
        }
      }]
    },
  }
}
