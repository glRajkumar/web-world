import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { CodePreview } from './code-preview'
import { TestCase } from './test-case'
import { Mermaid } from './mermaid'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    TestCase,
    CodePreview,
    ...components,
  };
}