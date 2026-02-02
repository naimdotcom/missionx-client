import { createFileRoute } from '@tanstack/react-router'
import { ChannelsPage } from '@/features/channels'

export const Route = createFileRoute('/_private/channels')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChannelsPage />
}
