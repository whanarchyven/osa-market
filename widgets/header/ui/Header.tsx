import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { CatalogDropdown } from './CatalogDropdown'
import type { RazdelKataloga, SocialNetworkItem } from '@/shared/types/api'

interface HeaderProps {
  razdely_kataloga: RazdelKataloga[]
  nomer_telefona?: string
  soczialnye_seti?: SocialNetworkItem[]
}

export function Header({
  razdely_kataloga,
  nomer_telefona,
  soczialnye_seti,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[99999]">
      <TopBar nomer_telefona={nomer_telefona} soczialnye_seti={soczialnye_seti} />
      <BottomBar nomer_telefona={nomer_telefona} />
      <CatalogDropdown razdely_kataloga={razdely_kataloga} />
    </header>
  )
}
