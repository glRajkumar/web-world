import type { jsonMetaDataT } from "@/utils/code-executer/schema"

export const metadata: jsonMetaDataT = {
  testCases: [],
  meta: {
    hashFn: {
      type: "function",
      name: "hashFn",
      description: "Generate a hash value for a string based on table size.",
      params: [
        {
          name: "str",
          type: "string",
          defaultValue: "",
          description: "Input string to hash.",
        },
        {
          name: "tableSize",
          type: "number",
          defaultValue: 7,
          description: "Size of the hash table.",
        },
      ],
    },
    HashTable: {
      type: "class",
      name: "HashTable",
      description: "A hash table implementation using separate chaining (Map).",
      construct: [
        {
          name: "size",
          type: "number",
          defaultValue: 7,
        },
      ],
      methods: [
        {
          type: "function",
          name: "add",
          description: "Add a key-value pair to the hash table.",
          params: [
            { name: "key", type: "string", defaultValue: "key" },
            { name: "data", type: "string", defaultValue: "value" },
          ],
        },
        {
          type: "function",
          name: "remove",
          description: "Remove a key from the table.",
          params: [{ name: "key", type: "string", defaultValue: "key1" }],
        },
        {
          type: "function",
          name: "find",
          description: "Find a value by key.",
          params: [{ name: "key", type: "string", defaultValue: "key1" }],
        },
        {
          type: "function",
          name: "isEmpty",
          description: "Check whether table is empty.",
        },
        {
          type: "function",
          name: "getData",
          description: "Return raw table structure (array of Maps).",
        },
        {
          type: "function",
          name: "getLength",
          description: "Return number of stored entries.",
        },
      ],
    },
    MathTools: {
      type: "class",
      name: "MathTools",
      description: "Utility class providing simple math operations.",
      methods: [
        {
          type: "function",
          name: "multiply",
          description: "Multiply two numbers.",
          params: [
            { name: "a", type: "number", defaultValue: 2 },
            { name: "b", type: "number", defaultValue: 3 },
          ],
        },
        {
          type: "function",
          name: "delayedMultiply",
          description: "Multiply two numbers but return result after delay.",
          params: [
            { name: "a", type: "number", defaultValue: 2 },
            { name: "b", type: "number", defaultValue: 3 },
          ],
        },
      ],
    },
    UserProfile: {
      type: "class",
      name: "UserProfile",
      description: "Represents a user profile with authentication logic.",
      construct: [
        {
          name: "name",
          type: "string",
          defaultValue: "John Doe",
          description: "User's display name.",
        },
        {
          name: "age",
          type: "number",
          defaultValue: 25,
          description: "User's age.",
        },
        {
          name: "id",
          type: "string",
          defaultValue: "UID123",
          description: "Unique identifier for user.",
        },
        {
          name: "password",
          type: "string",
          defaultValue: "password123",
          description: "Private login password.",
        },
      ],
      methods: [
        {
          type: "function",
          name: "updateAge",
          description: "Update user's age.",
          params: [{ name: "newAge", type: "number", defaultValue: 30 }],
        },
        {
          type: "function",
          name: "authenticate",
          description: "Validate the user's password and track login attempts.",
          params: [{ name: "pass", type: "string", defaultValue: "password123" }],
        },
        {
          type: "function",
          name: "getProfile",
          description: "Get public profile information.",
        },
      ],
    },
  }
}