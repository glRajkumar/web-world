import type { jsonMetaDataT } from "@/utils/code-executer/schema"

export const metadata: jsonMetaDataT = {
  testCases: [
    {
      input: 2,
      output: "* *\n* *"
    },
    {
      input: 3,
      output: "* * *\n* * *\n* * *"
    },
    {
      input: 5,
      output: "* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *"
    }
  ],
  meta: {
    calculateSum: {
      type: "function",
      name: "calculateSum",
      description: "Calculate the sum of two numbers",
      isAsync: false,
      params: [
        {
          name: "firstNumber",
          type: "number",
          defaultValue: 10,
          description: "First number to add",
          constraints: {
            min: 0,
            max: 1000,
            step: 1,
          },
        },
        {
          name: "secondNumber",
          type: "number",
          description: "Second number to add",
          defaultValue: 20,
          constraints: {
            min: 0,
            max: 1000,
            step: 1,
          },
        },
      ],
    },
    createUser: {
      type: "function",
      name: "createUser",
      description: "Create a new user with configuration",
      isAsync: true,
      params: [
        {
          name: "username",
          type: "string",
          description: "User's username",
          defaultValue: "john_doe",
          constraints: {
            minLength: 3,
            maxLength: 20,
          },
        },
        {
          name: "isActive",
          type: "boolean",
          description: "Whether the user is active",
        },
        {
          name: "tags",
          type: "array",
          description: "Array of user tags",
          defaultValue: ["admin", "user"],
          constraints: {
            min: 1,
            max: 5,
            template: {
              type: "string",
            }
          },
        },
        {
          name: "metadata",
          type: "object",
          description: "User metadata as JSON object",
          defaultValue: {
            age: 25,
            country: "India",
            preferences: {
              theme: "dark",
              notifications: true,
            },
          },
        },
      ],
    },
    processOrder: {
      type: "function",
      name: "processOrder",
      description: "Process an order with items and shipping details",
      isAsync: true,
      params: [
        {
          name: "orderId",
          type: "string",
          description: "Unique order identifier",
        },
        {
          name: "items",
          type: "array",
          description: "Array of order items",
          defaultValue: [
            { name: "Laptop", qty: 1, price: 50000 },
            { name: "Mouse", qty: 2, price: 1500 },
          ],
        },
        {
          name: "shipping",
          type: "object",
          description: "Shipping details",
          defaultValue: {
            address: "221B Baker Street",
            city: "London",
            express: true,
          }
        },
      ],
    },
    parseValue: {
      type: "function",
      name: "parseValue",
      description: "Parses a string or number to a normalized result",
      isAsync: false,
      params: [
        {
          name: "value",
          type: "string",
          description: "Value to parse",
          defaultValue: "42",
        },
        {
          name: "parseAsNumber",
          type: "boolean",
          description: "If true, convert to number",
          defaultValue: true,
        },
      ],
    },
    filterNumbers: {
      type: "function",
      name: "filterNumbers",
      description: "Filters an array of numbers with threshold constraints",
      isAsync: false,
      params: [
        {
          name: "numbers",
          type: "array",
          description: "Array of numbers to filter",
          defaultValue: [5, 10, 20, 50],
          constraints: {
            template: { type: "number" },
            min: 1,
            max: 10,
          },
        },
        {
          name: "threshold",
          type: "number",
          description: "Minimum allowed value",
          defaultValue: 10,
          constraints: {
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          name: "includeEqual",
          type: "boolean",
          description: "Include items equal to threshold",
          defaultValue: true,
        },
      ],
    },
    logMessage: {
      type: "function",
      name: "logMessage",
      description: "Logs a message with optional severity and timestamp",
      isAsync: false,
      params: [
        {
          name: "message",
          type: "string",
          description: "Message to log",
        },
        {
          name: "severity",
          type: "string",
          description: "Log severity level",
          defaultValue: "info",
        },
        {
          name: "timestamp",
          type: "boolean",
          description: "Whether to include timestamp",
          defaultValue: false,
        },
      ],
    },
  }
}
