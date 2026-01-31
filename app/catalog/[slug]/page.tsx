import { CatalogFilters, CatalogGrid } from '@/widgets/catalog'
import { getCatalogData } from '@/shared/api'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const revalidate = 60

interface CatalogPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const { slug } = await params
  const search = await searchParams
  
  const catalogData = await getCatalogData(slug, search)

  return (
      <main className="min-h-screen bg-background pt-4 pb-12">
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
            />
          </div>
        </div>
      </main>
  )
}
