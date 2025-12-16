import { FormProvider, useForm } from 'react-hook-form'

import { getDefaultValues } from '@/utils/code-executer/get-default'

import { Card, CardContent } from '@/components/shadcn-ui/card'
import { ParamField } from '@/components/ui/code-executer/params'
import { Button } from '@/components/shadcn-ui/button'

function Params() {
  const paramsData: paramT[] = [
    {
      name: "noConstraints",
      description: "field without type or constraints",
    },
    {
      name: "name",
      type: "string",
      description: "simple string field",
      defaultValue: "somevalue",
      constraints: {
        minLength: 1,
        maxLength: 10,
      },
    },
    {
      name: "age",
      type: "number",
      description: "number with limits",
      defaultValue: 5,
      constraints: {
        min: 1,
        max: 10,
        step: 1,
      },
    },
    {
      name: "isMarried",
      type: "boolean",
      description: "simple boolean",
      defaultValue: false,
    },
    {
      name: "enum",
      type: "enum",
      description: "Enum with string, boolean, number",
      constraints: {
        values: ["Option 1", 2, true]
      }
    },
    {
      name: "objString",
      type: "object",
      description: "object whose values are strings",
      defaultValue: {
        first: "hello",
        second: "world",
      },
      constraints: {
        template: {
          type: "string",
          constraints: {
            minLength: 1,
            maxLength: 10,
          },
        }
      },
    },
    {
      name: "objNumber",
      type: "object",
      description: "object whose values are numbers",
      defaultValue: {
        x: 5,
        y: 7,
      },
      constraints: {
        template: {
          type: "number",
          constraints: {
            min: 1,
            max: 10,
            step: 1,
          },
        }
      },
    },
    {
      name: "objBoolean",
      type: "object",
      description: "object whose values are booleans",
      defaultValue: {
        a: true,
        b: false,
      },
      constraints: {
        template: {
          type: "boolean",
        }
      },
    },
    {
      name: "objObject",
      type: "object",
      description: "object nested up to 5 levels deep",
      defaultValue: {
        level1A: "string",
        level1B: 10,
        level1C: {
          level2A: "text",
          level2B: {
            level3A: 3,
            level3B: true,
            level3C: {
              level4A: "deep string",
              level4B: {
                level5A: "final 5th level",
                level5B: 42,
                level5C: false,
              },
            },
          },
        },
      },
      constraints: {
        by: {
          level1A: {
            type: "string",
            constraints: {
              minLength: 1,
              maxLength: 15,
            },
          },
          level1B: {
            type: "number",
            constraints: {
              min: 1,
              max: 100,
            },
          },
          level1C: {
            type: "object",
            constraints: {
              by: {
                level2A: {
                  type: "string",
                  constraints: {
                    minLength: 2,
                    maxLength: 20,
                  },
                },
                level2B: {
                  type: "object",
                  constraints: {
                    by: {
                      level3A: {
                        type: "number",
                        constraints: {
                          min: 0,
                          max: 10,
                        },
                      },
                      level3B: {
                        type: "boolean",
                      },
                      level3C: {
                        type: "object",
                        constraints: {
                          by: {
                            level4A: {
                              type: "string",
                              constraints: {
                                minLength: 3,
                                maxLength: 30,
                              },
                            },
                            level4B: {
                              type: "object",
                              constraints: {
                                by: {
                                  level5A: {
                                    type: "string",
                                    constraints: {
                                      minLength: 1,
                                      maxLength: 50,
                                    },
                                  },
                                  level5B: {
                                    type: "number",
                                    constraints: {
                                      min: 1,
                                      max: 999,
                                    },
                                  },
                                  level5C: {
                                    type: "boolean",
                                  },
                                }
                              },
                            },
                          }
                        },
                      },
                    }
                  },
                },
              }
            },
          },
        },
      },
    },
    {
      name: "objNoConstraint",
      type: "object",
      description: "object with no constraints",
      defaultValue: {
        x: "free text",
        y: true,
        z: 999,
      },
    },
    {
      name: "userStats",
      type: "object",
      description: "Mixed primitive stats",
      defaultValue: {
        score: 100,
        level: 4,
        title: "Warrior",
        isPremium: true,
      },
      constraints: {
        by: {
          score: { type: "number", constraints: { min: 0, max: 9999 } },
          level: { type: "number", constraints: { min: 1, max: 200 } },
          title: { type: "string", constraints: { minLength: 3, maxLength: 15 } },
          isPremium: { type: "boolean" },
        }
      },
    },
    {
      name: "companyProfile",
      type: "object",
      description: "Deep nested object",
      defaultValue: {
        name: "TechCorp",
        address: {
          country: "India",
          state: {
            name: "Tamil Nadu",
            city: {
              name: "Chennai",
              pincode: 600001,
            },
          },
        },
        founded: 1995,
      },
      constraints: {
        by: {
          name: {
            type: "string",
            constraints: { minLength: 2, maxLength: 20 },
          },
          address: {
            type: "object",
            constraints: {
              by: {
                country: { type: "string" },
                state: {
                  type: "object",
                  constraints: {
                    by: {
                      name: { type: "string" },
                      city: {
                        type: "object",
                        constraints: {
                          by: {
                            name: { type: "string" },
                            pincode: { type: "number", constraints: { min: 100000, max: 999999 } },
                          }
                        },
                      },
                    }
                  },
                },
              }
            },
          },
          founded: {
            type: "number",
            constraints: {
              min: 1800,
              max: 2025,
            },
          },
        }
      },
    },
    {
      name: "arrString",
      type: "array",
      description: "string array with by constraints",
      defaultValue: ["abc", "xyz"],
      constraints: {
        min: 3,
        template: {
          type: "string", constraints: { minLength: 2 }
        },
        by: {
          1: { type: "string", constraints: { maxLength: 10 } },
        },
      },
    },
    {
      name: "arrNumber",
      type: "array",
      description: "all numbers use same template",
      defaultValue: [2, 4, 6],
      constraints: {
        template: {
          type: "number",
          constraints: {
            min: 1,
            max: 50,
            step: 1,
          },
        },
      },
    },
    {
      name: "arrBoolean",
      type: "array",
      description: "boolean array",
      defaultValue: [true, false, true],
      constraints: {
        template: {
          type: "boolean",
        },
      },
    },
    {
      name: "arrObject",
      type: "array",
      description: "array of objects with deep nested constraints",
      defaultValue: [
        {
          inner1: "hello",
          inner2: 3,
          inner3: true,
          inner4: {
            level2A: "nested",
            level2B: {
              level3A: 5,
              level3B: false,
              level3C: {
                level4A: "branch",
              },
            },
          },
        },
      ],
      constraints: {
        template: {
          type: "object",
          constraints: {
            by: {
              inner1: {
                type: "string",
                constraints: {
                  minLength: 1,
                  maxLength: 10,
                },
              },
              inner2: {
                type: "number",
                constraints: {
                  min: 1,
                  max: 20,
                  step: 1,
                },
              },
              inner3: {
                type: "boolean",
              },
              inner4: {
                type: "object",
                constraints: {
                  by: {
                    level2A: {
                      type: "string",
                      constraints: {
                        minLength: 1,
                        maxLength: 20,
                      },
                    },
                    level2B: {
                      type: "object",
                      constraints: {
                        by: {
                          level3A: {
                            type: "number",
                            constraints: {
                              min: 1,
                              max: 100,
                            },
                          },
                          level3B: {
                            type: "boolean",
                          },
                          level3C: {
                            type: "object",
                            constraints: {
                              by: {
                                level4A: { type: "string" },
                              }
                            },
                          },
                        }
                      },
                    },
                  }
                },
              },
            }
          },
        },
      },
    },
    {
      name: "arrNoConstraint",
      type: "array",
      description: "array with mixed types and no constraints",
      defaultValue: [1, "text", "false", { x: 1 }], // problem in react hook form
    },
    {
      name: "skills",
      type: "array",
      description: "User skills",
      defaultValue: ["React", "Node", "TS"],
      constraints: {
        template: {
          type: "string",
          constraints: {
            minLength: 2,
            maxLength: 15,
          },
        },
      },
    },
    {
      name: "threeTypes",
      type: "array",
      description: "Each index different type",
      defaultValue: ["hello", 50, true],
      constraints: {
        by: {
          0: { type: "string", constraints: { minLength: 3 } },
          1: { type: "number", constraints: { min: 10, max: 100 } },
          2: { type: "boolean" },
        },
      },
    },
    {
      name: "array-template-byindex",
      type: "array",
      description: "Each index different type",
      defaultValue: ["hello", "word", 10, "i", "am", true, "raj kumar"],
      constraints: {
        template: {
          type: "string",
          constraints: {
            minLength: 1,
            maxLength: 12,
          }
        },
        by: {
          2: {
            type: "number",
            constraints: {
              min: 5,
              max: 20
            },
          },
          5: {
            type: "boolean"
          }
        },
      },
    },
    {
      name: "products",
      type: "array",
      description: "Array of product objects with nested constraints",
      defaultValue: [
        {
          name: "Laptop",
          price: 50000,
          details: {
            brand: "Dell",
            specs: {
              ram: 16,
              storage: 512,
            },
          },
        },
      ],
      constraints: {
        template: {
          type: "object",
          constraints: {
            by: {
              name: {
                type: "string",
                constraints: { minLength: 2, maxLength: 20 },
              },
              price: {
                type: "number",
                constraints: { min: 1000, max: 200000 },
              },
              details: {
                type: "object",
                constraints: {
                  by: {
                    brand: { type: "string" },
                    specs: {
                      type: "object",
                      constraints: {
                        by: {
                          ram: { type: "number", constraints: { min: 4, max: 64 } },
                          storage: { type: "number", constraints: { min: 128, max: 2000 } },
                        }
                      },
                    },
                  }
                },
              },
            }
          },
        },
      },
    },
    {
      name: "matrix",
      type: "array",
      description: "2D numeric matrix",
      defaultValue: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      constraints: {
        template: {
          type: "array",
          constraints: {
            template: {
              type: "number",
              constraints: { min: 0, max: 999 },
            },
          },
        },
      },
    },
    {
      name: "profileComplex",
      type: "object",
      description: "Object mixing arrays, primitives, nested objects",
      defaultValue: {
        personal: {
          name: "Raj",
          age: 22,
        },
        preferences: {
          likes: ["coding", "movies"],
          notifications: true,
        },
        history: [
          {
            year: 2022,
            actions: ["login", "update", "logout"],
          },
        ],
      },
      constraints: {
        by: {
          personal: {
            type: "object",
            constraints: {
              by: {
                name: { type: "string", constraints: { minLength: 2 } },
                age: { type: "number", constraints: { min: 10, max: 80 } },
              }
            },
          },
          preferences: {
            type: "object",
            constraints: {
              by: {
                likes: {
                  type: "array",
                  constraints: {
                    template: { type: "string", constraints: { minLength: 2 } },
                  },
                },
                notifications: { type: "boolean" },
              }
            },
          },
          history: {
            type: "array",
            constraints: {
              template: {
                type: "object",
                constraints: {
                  by: {
                    year: { type: "number", constraints: { min: 2000, max: 2030 } },
                    actions: {
                      type: "array",
                      constraints: {
                        template: { type: "string", constraints: { minLength: 3 } },
                      },
                    },
                  }
                },
              },
            },
          },
        }
      },
    },
  ]

  const methods = useForm({
    defaultValues: getDefaultValues(paramsData),
  })

  function handleSubmit(data: any) {
    console.log(data)
  }

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className='space-y-4 [&_[role="group"]]:gap-1'
          >
            {paramsData.map((param) => (
              <ParamField
                key={param.name}
                param={param}
                name={param.name}
              />
            ))}

            <Button type="submit">
              Get Data
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default Params
