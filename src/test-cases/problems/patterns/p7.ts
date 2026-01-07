
export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: " * \n***"
    },
    {
      input: 3,
      output: "  *  \n *** \n*****"
    },
    {
      input: 5,
      output: "    *    \n   ***   \n  *****  \n ******* \n*********"
    }
  ],
  meta: {
    p7_1: {
      type: "function",
      name: "p7_1",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 2,
          max: 20,
        }
      }]
    },
    p7_2: {
      type: "function",
      name: "p7_2",
      params: [{
        name: "n",
        type: "number",
        defaultValue: 5,
        constraints: {
          min: 2,
          max: 20,
        }
      }]
    },
  }
}
