
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n23"
    },
    {
      input: 3,
      output: "1\n23\n456"
    },
    {
      input: 5,
      output: "1\n23\n456\n78910\n1112131415"
    }
  ],
  meta: {
    p13: {
      type: "function",
      name: "p13",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 2,
          max: 9,
        }
      }]
    },
  }
}
