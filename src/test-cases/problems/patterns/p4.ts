
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "1\n22"
    },
    {
      input: 3,
      output: "1\n22\n333"
    },
    {
      input: 5,
      output: "1\n22\n333\n4454\n55555"
    }
  ],
  meta: {
    p4_1: {
      type: "function",
      name: "p4_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 9,
        }
      }]
    },
    p4_2: {
      type: "function",
      name: "p4_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 1,
          max: 9,
        }
      }]
    },
  }
}
