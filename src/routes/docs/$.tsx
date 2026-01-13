import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import browserCollections from 'fumadocs-mdx:collections/browser'
import { createServerFn } from '@tanstack/react-start'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

import { getMDXComponents } from '@/components/fuma-ui'
import { Settings } from '@/components/viz-ui/settings'

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()

    return {
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage
        toc={toc}
        tableOfContent={{ style: 'clerk' }}
      >
        {
          frontmatter.showTitleDesc &&
          <>
            <DocsTitle>{frontmatter.title}</DocsTitle>
            <DocsDescription>
              {frontmatter.isProbStateDesc ? <strong className='font-medium'>Problem Statement: </strong> : ""}
              {frontmatter.description}
            </DocsDescription>
          </>
        }

        <DocsBody>
          <MDX
            components={getMDXComponents()}
          />
          <Settings />
        </DocsBody>
      </DocsPage>
    )
  },
})

function Page() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)
  const { pageTree } = useFumadocsLoader(data)

  return (
    <DocsLayout {...baseOptions()} tree={pageTree}>
      <Content />
    </DocsLayout>
  )
}
