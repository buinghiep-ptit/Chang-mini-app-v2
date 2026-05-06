import { createFileRoute } from '@tanstack/react-router'
import { MenuSettingPage } from '@/pages/menu-setting'

export const Route = createFileRoute('/menu')({
  component: MenuSettingPage,
})
