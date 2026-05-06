import { createFileRoute } from '@tanstack/react-router'
import { AppsPage } from '@/pages/apps'

export const Route = createFileRoute('/apps')({
  component: AppsPage,
})
