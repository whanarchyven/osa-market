import { CatalogFilters, CatalogGrid } from '@/widgets/catalog'
import type { Metadata } from 'next'
import { getCatalogData } from '@/shared/api'
import { getCatalogCategoryBySlug } from '@/shared/api/pages/catalog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CategoriesBlock } from '@/widgets/categories/ui/CategoriesBlock'
import { getCatalogPageData } from '@/shared/api/pages/catalog/getCatalogPageData'
import { getCategory } from '@/shared/api/products/categories/getCategory'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { parseRichTextBlock } from '@/shared/utils/richText'

export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getCatalogCanonicalPath = (
  slug: string,
  searchParams: { [key: string]: string | string[] | undefined }
) => {
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page
  const page = Math.max(1, Number(pageParam) || 1)
  const extraParams = Object.entries(searchParams).filter(
    ([key, value]) => key !== 'page' && Boolean(value)
  )

  if (extraParams.length > 0 || page <= 1) {
    return `/catalog/${slug}`
  }

  return `/catalog/${slug}?page=${page}`
}

export async function generateMetadata(
  { params, searchParams }: CatalogPageProps
): Promise<Metadata> {
  const { slug } = await params
  const search = await searchParams
  const category = await getCatalogCategoryBySlug(slug)
  const categoryName = category?.name ?? slug
  const categoryDescription = stripHtml(category?.description ?? '')
  const canonicalPath = getCatalogCanonicalPath(slug, search)
  const url = `${SITE_URL}${canonicalPath}`
  const title = `${categoryName} — купить в OSA-MARKET`
  const description =
    categoryDescription || stripHtml(`Категория ${categoryName} в OSA-MARKET.`)

  const fallback: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  }

  const yoast = category?.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  const metadata = buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath,
  })

  if (canonicalPath !== `/catalog/${slug}`) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical: url,
    }
    metadata.openGraph = {
      ...metadata.openGraph,
      url,
    }
  }

  return metadata
}

interface CatalogPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const { slug } = await params
  const search = await searchParams

  const [catalogData, catalogPageData] = await Promise.all([
    getCatalogData(slug, search),
    getCatalogPageData(),
  ])

  const managedCategories =
    catalogPageData[0]?.acf?.otobrazhaemye_kategorii
      ?.map((item) => item.upravlyaemaya_kategoriya)
      .filter((item): item is NonNullable<typeof item> => item != null) ?? []

  const categoryIds = managedCategories
    .map((item) => item.kategoriya)
    .filter((id): id is number => id != null)

  const categories =
    categoryIds.length > 0
      ? await Promise.all(categoryIds.map((id) => getCategory(id)))
      : []

  const showProductsById = new Map(
    managedCategories
      .filter((item): item is Required<Pick<typeof item, 'kategoriya'>> & {
        show_products?: boolean
      } => item.kategoriya != null)
      .map((item) => [item.kategoriya, item.show_products === true])
  )

  const categoriesWithFlags = categories.map((category) => ({
    ...category,
    showProducts: showProductsById.get(category.id) ?? false,
  }))

  const activeCategoryId = categoriesWithFlags.find((c) => c.slug === slug)?.id

  return (
      <main className="min-h-screen bg-background pt-4 pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Главная',
                  item: `${SITE_URL}/`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: catalogData.categoryName,
                  item: `${SITE_URL}/catalog/${slug}`,
                },
              ],
            }),
          }}
        />
        <div className="container mx-auto px-4">
          {/* Хлебные крошки */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{catalogData.categoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <CategoriesBlock
            title="Категории"
            categories={categoriesWithFlags}
            activeCategoryId={activeCategoryId}
          />

          {/* Заголовок */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {catalogData.categoryName}
          </h1>

          

          {/* Контент */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Фильтры - сайдбар */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                <CatalogFilters 
                  attributes={catalogData.attributes} 
                  categorySlug={slug}
                />
              </div>
            </aside>

            {/* Сетка товаров */}
          <CatalogGrid 
            products={catalogData.products} 
            totalCount={catalogData.totalCount}
            totalPages={catalogData.totalPages}
            currentPage={catalogData.currentPage}
          />
          </div>
          <div className="my-8 max-w-none prose prose-invert prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary text-justify">
          {catalogData.categoryDescription &&
            parseRichTextBlock(
              catalogData.categoryDescription,
            )}
            </div>
        </div>
      </main>
  )
}
