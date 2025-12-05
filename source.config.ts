import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config'
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'
import { z } from 'zod'

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
  },
})

export const docs = defineDocs({
  dir: 'src/content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      showTitleDesc: z.boolean().optional().default(true),
      isProbStateDesc: z.boolean().optional().default(false),
    }),
  }
})