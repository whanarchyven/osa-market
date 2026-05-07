import type { Metadata } from 'next'

import { mapPcAssemblyWpToViewModel } from '@/shared/api/pages/pcAssembly/mapWpToView'
import { getPcAssemblyPage } from '@/shared/api/pages/pcAssembly/getPcAssemblyPage'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { PcAssemblyBenefitsSection } from '@/widgets/pc-assembly/ui/PcAssemblyBenefitsSection'
import { PcAssemblyExamplesSection } from '@/widgets/pc-assembly/ui/PcAssemblyExamplesSection'
import { PcAssemblyHero } from '@/widgets/pc-assembly/ui/PcAssemblyHero'
import { PcAssemblyLeadForm } from '@/widgets/pc-assembly/ui/PcAssemblyLeadForm'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

export const revalidate = 60

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const fallbackMetadata: Metadata = {
  title: 'Сборка ПК — OSA-MARKET',
  description:
    'Подбор железа, сборка под ключ и тесты. Комплектующие в наличии, гарантия и поддержка.',
  alternates: {
    canonical: `${SITE_URL}/pc-build`,
  },
  openGraph: {
    title: 'Сборка ПК — OSA-MARKET',
    description:
      'Подбор железа, сборка под ключ и тесты. Комплектующие в наличии, гарантия и поддержка.',
    url: `${SITE_URL}/pc-build`,
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPcAssemblyPage()
    const yoast = page?.yoast_head_json
    const enriched: Metadata =
      page?.title.rendered.trim()
        ? {
            ...fallbackMetadata,
            title: `${stripHtml(page.title.rendered)} — OSA-MARKET`,
            openGraph: {
              ...fallbackMetadata.openGraph,
              title: `${stripHtml(page.title.rendered)} — OSA-MARKET`,
            },
          }
        : fallbackMetadata

    const { siteUrl, apiBaseUrl } = seoContextFromEnv()
    return buildMetadataWithYoast(enriched, yoast, {
      siteUrl,
      apiBaseUrl,
      canonicalPath: '/pc-build',
    })
  } catch {
    return fallbackMetadata
  }
}

export default async function PcBuildPage() {
  const wp = await getPcAssemblyPage()
  const vm = mapPcAssemblyWpToViewModel(wp)

  return (
    <main className="min-h-screen bg-background">
      <PcAssemblyHero {...vm.hero} />
      <PcAssemblyExamplesSection
        builds={vm.builds}
        heading={vm.examplesHeading}
        subtitle={vm.examplesSubtitle}
      />
      <PcAssemblyBenefitsSection
        benefits={vm.benefits}
        heading={vm.benefitsHeading}
        subtitle={vm.benefitsSubtitle}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <PcAssemblyLeadForm />
        </div>
      </section>
    </main>
  )
}
