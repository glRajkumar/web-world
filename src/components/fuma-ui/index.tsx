import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { ProblemWrapper } from '@/components/ui/problem-wrapper'
import { Mermaid } from './mermaid'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    ProblemWrapper,
    ...components,
  };
}