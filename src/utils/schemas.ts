import { z } from 'zod'

export const expectedZ = z.object({
  input: z.any(),
  output: z.any(),
})

export const testCaseZ = z.object({
  expected: z.array(expectedZ)
})

export type expectedT = z.infer<typeof expectedZ>
export type testCaseT = z.infer<typeof testCaseZ>
