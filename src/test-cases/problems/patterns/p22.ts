
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "222\n212\n222"
    },
    {
      input: 3,
      output: "33333\n32223\n32123\n32223\n33333"
    },
    {
      input: 4,
      output: "4444444\n4333334\n4322234\n4321234\n4322234\n4333334\n4444444"
    }
  ],
  meta: {
    p22: {
      type: "function",
      name: "p22",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 3,
          max: 9,
        }
      }]
    },
  }
}
