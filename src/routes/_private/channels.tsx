import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/channels')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/channels"!</div>
}
