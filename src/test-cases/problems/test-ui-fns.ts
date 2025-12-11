import type { jsonMetaDataT } from "@/utils/code-executer/schema"

export const metadata: jsonMetaDataT = {
  testCases: [],
  meta: {
    calculateSum: {
      type: "function",
      name: "calculateSum",
      description: "Calculate the sum of two numbers.",
      params: [
        {
          name: "firstNumber",
          type: "number",
          defaultValue: 1,
          constraints: { min: 0, max: 100 },
        },
        {
          name: "secondNumber",
          type: "number",
          defaultValue: 2,
          constraints: { min: 0, max: 100 },
        },
      ],
    },
    createUser: {
      type: "function",
      name: "createUser",
      description: "Create a new user with configuration",
      params: [
        {
          name: "username",
          type: "string",
          description: "User's username",
          defaultValue: "john_doe",
          constraints: { minLength: 3, maxLength: 20 },
        },
        {
          name: "isActive",
          type: "boolean",
          description: "Whether the user is active",
          defaultValue: true,
        },
        {
          name: "tags",
          type: "array",
          description: "Array of user tags",
          defaultValue: ["admin", "user"],
          constraints: {
            min: 1,
            max: 5,
            template: { type: "string" }
          }
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
      description: "Process an order and calculate totals.",
      params: [
        {
          name: "orderId",
          type: "string",
          description: "Unique order identifier",
          defaultValue: "ORDER123",
        },
        {
          name: "items",
          type: "array",
          description: "Array of order items",
          constraints: {
            template: {
              type: "object",
              constraints: {
                name: { type: "string" },
                qty: { type: "number" },
                price: { type: "number" },
              },
            }
          },
          defaultValue: [
            { name: "Laptop", qty: 1, price: 50000 },
            { name: "Mouse", qty: 2, price: 1500 },
          ],
        },
        {
          name: "shipping",
          type: "object",
          description: "Shipping details",
          constraints: {
            address: { type: "string" },
            city: { type: "string" },
            express: { type: "boolean" },
          },
          defaultValue: {
            address: "221B Baker Street",
            city: "London",
            express: true,
          },
        },
      ],
    },
    parseValue: {
      type: "function",
      name: "parseValue",
      description: "Parse a string value as number or return as string.",
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
      description: "Filter numbers above a threshold.",
      params: [
        {
          name: "numbers",
          type: "array",
          description: "Array of numbers to filter",
          defaultValue: [1, 5, 10, 20],
          constraints: {
            template: { type: "number" },
            min: 1,
            max: 10,
          }
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
      description: "Format a log message with severity and optional timestamp.",
      params: [
        {
          name: "message",
          type: "string",
          description: "Message to log",
          defaultValue: "Hello World",
        },
        {
          name: "severity",
          type: "string",
          description: "Log severity level",
          defaultValue: "info",
          // constraints: {
          //   ["info", "warn", "error"]  
          // },
        },
        {
          name: "timestamp",
          type: "boolean",
          description: "Whether to include timestamp",
          defaultValue: false,
        },
      ],
    },
    mixedParamsFunction: {
      type: "function",
      name: "mixedParamsFunction",
      description: "Function demonstrating complex nested and mixed parameter types.",
      params: [
        { name: "name", type: "string", defaultValue: "John Doe" },
        { name: "age", type: "number", defaultValue: 30 },
        { name: "isActive", type: "boolean", defaultValue: true },
        {
          name: "address",
          type: "object",
          constraints: {
            street: { type: "string" },
            city: { type: "string" },
            coordinates: {
              type: "object",
              constraints: {
                lat: { type: "number" },
                lng: { type: "number" },
              },
            },
          },
          defaultValue: {
            street: "Main Street",
            city: "Delhi",
            coordinates: { lat: 12.34, lng: 56.78 },
          },
        },
        {
          name: "skills",
          type: "array",
          defaultValue: ["TS", "JS"],
          constraints: {
            template: { type: "string" }
          }
        },
        {
          name: "scores",
          type: "array",
          defaultValue: [10, 20, 30],
          constraints: {
            template: { type: "number" }
          }
        },
        {
          name: "items",
          type: "array",
          constraints: {
            template: {
              type: "object",
              constraints: {
                id: { type: "number" },
                label: { type: "string" },
              },
            }
          },
          defaultValue: [{ id: 1, label: "Item1" }],
        },
        {
          name: "settings",
          type: "object",
          constraints: {
            theme: { type: "string" },
            shortcuts: { type: "array" },
            permissions: {
              type: "array",
              constraints: { template: { type: "boolean" } }
            },
          },
          defaultValue: {
            theme: "light",
            shortcuts: ["ctrl+s"],
            permissions: [true, false],
          },
        },
        { name: "meta", type: "object", defaultValue: { version: 1 } },
        { name: "flags", type: "array", defaultValue: [true, false], constraints: { template: { type: "boolean" } } },
        {
          name: "tupleExample",
          type: "array",
          defaultValue: ["A", 1, true],
          constraints: {
            // tuple: ["string", "number", "boolean"],
            byIndex: {
              0: { type: "string" },
              1: { type: "number" },
              2: { type: "boolean" },
            }
          }
        },
        {
          name: "idOrName",
          // type: "union",
          // unionTypes: ["number", "string"],
          defaultValue: "user_1",
        },

        {
          name: "mixedArray",
          type: "array",
          defaultValue: ["a", 1, true],
          constraints: {
            // tuple: ["string", "number", "boolean"],
            byIndex: {
              0: { type: "string" },
              1: { type: "number" },
              2: { type: "boolean" },
            }
          }
        },

        {
          name: "preferences",
          type: "object",
          constraints: {
            ui: {
              type: "object",
              constraints: {
                mode: {
                  type: "string",
                  // enum: ["light", "dark"]
                },
                scale: { type: "number" },
              },
            },
            notifications: {
              type: "object",
              constraints: {
                email: { type: "boolean" },
                sms: { type: "boolean" },
              },
            },
            categories: {
              type: "array",
              constraints: { template: { type: "string" } }
            },
          },
          defaultValue: {
            ui: { mode: "light", scale: 1 },
            notifications: { email: true, sms: false },
            categories: ["general"],
          },
        },

        {
          name: "status",
          type: "string",
          // enum: ["pending", "active", "disabled"] 
          defaultValue: "active",
        },
      ],
    },
  }
}
