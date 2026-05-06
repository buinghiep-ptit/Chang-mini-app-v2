import { createFileRoute, redirect } from '@tanstack/react-router'

// Legacy redirect → home
export const Route = createFileRoute('/conversation')({
  beforeLoad: () => { throw redirect({ to: '/' }) },
})
