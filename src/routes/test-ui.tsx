import { createFileRoute } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'

import type { paramT } from "@/utils/code-executer/schema"
import { ParamField } from '@/components/ui/code-executer/params'
import { Button } from '@/components/shadcn-ui/button'
import { Card, CardContent } from '@/components/shadcn-ui/card'

export const Route = createFileRoute('/test-ui')({
  component: RouteComponent,
})

const paramsData: paramT[] = [
  {
    name: "name",
    type: "string",
    description: "somedescription",
    constraints: {
      minLength: 1,
      maxLength: 10,
      defaultValue: "somevalue",
    },
  },
  {
    name: "age",
    type: "number",
    description: "somedescription",
    constraints: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
    },
  },
  {
    name: "isMarried",
    type: "boolean",
    description: "somedescription",
    constraints: {
      defaultValue: false,
    },
  },
  {
    name: "objString",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "string",
      constraint: {
        minLength: 1,
        maxLength: 10,
        defaultValue: "somevalue",
      },
      defaultValue: {
        x: "jfhh",
        y: "hjhjjk",
      }
    },
  },
  {
    name: "objNumber",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "number",
      constraint: {
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      defaultValue: {
        x: 6,
        y: 5,
      }
    },
  },
  {
    name: "objBoolean",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "boolean",
      constraint: {
        defaultValue: true,
      },
      defaultValue: {
        x: true,
        y: false,
      }
    },
  },
  {
    name: "objObject",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "object",
      constraint: {
        inner1: {
          type: "string",
          constraint: {
            minLength: 1,
            maxLength: 10,
            defaultValue: "somevalue",
          },
        },
        inner2: {
          type: "number",
          constraint: {
            min: 1,
            max: 10,
            step: 1,
            defaultValue: 5,
          },
        },
        inner3: {
          type: "boolean",
          constraint: {
            defaultValue: true,
          },
        },
        inner4: {
          type: "object",
          constraint: {
            i4i1: {
              type: "string",
              constraint: {
                minLength: 1,
                maxLength: 10,
                defaultValue: "somevalue",
              },
            },
            i4i2: {
              type: "number",
              constraint: {
                min: 1,
                max: 10,
                defaultValue: 5,
              },
            },
            i4i3: {
              type: "boolean",
              constraint: {
                defaultValue: false,
              },
            },
            i4i4: {
              type: "object",
              constraint: {
                i4i4i1: {
                  type: "string",
                  defaultValue: {
                    x: "jkj"
                  }
                }
              },
            },
          },
        },
      },
      defaultValue: {
        inner1: "ghk",
        inner2: 3,
        inner3: true,
        inner4: {
          i4i1: "gjhk",
          i4i2: 2,
          i4i3: false,
          i4i4: {
            x: "yhtg",
            y: "nidh",
            z: "iksh"
          }
        }
      }
    },
  },
  {
    name: "objNoConstraint",
    type: "object",
    description: "somedescription",
    constraints: {
      type: "object",
      defaultValue: {
        x: "somevalue",
        y: true,
        z: 6,
      }
    }
  },



  {
    name: "arrString",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "string",
      constraint: {
        minLength: 1,
        maxLength: 10,
        defaultValue: "somevalue",
      },
      defaultValue: ["jfhh", "hjhjjk"]
    },
  },
  {
    name: "arrNumber",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "number",
      constraint: {
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      defaultValue: [6, 5]
    },
  },
  {
    name: "arrBoolean",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "boolean",
      constraint: {
        defaultValue: true,
      },
      defaultValue: [true, false]
    },
  },
  {
    name: "arrObject",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "object",
      constraint: {
        inner1: {
          type: "string",
          constraint: {
            minLength: 1,
            maxLength: 10,
            defaultValue: "somevalue",
          },
        },
        inner2: {
          type: "number",
          constraint: {
            min: 1,
            max: 10,
            step: 1,
            defaultValue: 5,
          },
        },
        inner3: {
          type: "boolean",
          constraint: {
            defaultValue: true,
          },
        },
        inner4: {
          type: "object",
          constraint: {
            i4i1: {
              type: "string",
              constraint: {
                minLength: 1,
                maxLength: 10,
                defaultValue: "somevalue",
              },
            },
            i4i2: {
              type: "number",
              constraint: {
                min: 1,
                max: 10,
                defaultValue: 5,
              },
            },
            i4i3: {
              type: "boolean",
              constraint: {
                defaultValue: false,
              },
            },
            i4i4: {
              type: "object",
              constraint: {
                i4i4i1: {
                  type: "string",
                  defaultValue: {
                    x: "jkj"
                  }
                }
              },
            },
          },
        },
      },
      defaultValue: [{
        inner1: "ghk",
        inner2: 3,
        inner3: true,
        inner4: {
          i4i1: "gjhk",
          i4i2: 2,
          i4i3: false,
          i4i4: {
            x: "yhtg",
            y: "nidh",
            z: "iksh"
          }
        }
      }]
    },
  },
  {
    name: "arrNoConstraint",
    type: "array",
    description: "somedescription",
    constraints: {
      type: "array",
      defaultValue: [1, "db", true]
    }
  },
]

function RouteComponent() {
  const methods = useForm()

  function handleSubmit(data: any) {
    console.log(data)
  }

  return (
    <div className='p-8'>
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
    </div>
  )
}
