import { createFileRoute } from '@tanstack/react-router'
import { Conversation2Page } from '@/pages/conversation-2'

export const Route = createFileRoute('/conversation-2')({
  component: Conversation2Page,
})
