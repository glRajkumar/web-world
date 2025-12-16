import { createFileRoute } from '@tanstack/react-router'

import TestUI from '@/components/test-ui'

export const Route = createFileRoute('/test-ui')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TestUI />
}
