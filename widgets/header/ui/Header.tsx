import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { CatalogDropdown } from './CatalogDropdown'
import type { RazdelKataloga } from '@/shared/types/api'

interface HeaderProps {
  razdely_kataloga: RazdelKataloga[]
}

export function Header({ razdely_kataloga }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <BottomBar />
      <CatalogDropdown razdely_kataloga={razdely_kataloga} />
    </header>
  )
}
