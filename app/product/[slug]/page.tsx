import { ProductGallery, ProductInfo, ProductReviewForm } from '@/widgets/product'
import { getProductById } from '@/shared/api/products/getProductById'
import { getProductReviews } from '@/shared/api/products/reviews/getProductReviews'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

export const revalidate = 60

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  const productId = Number(slug)
  const product = await getProductById(productId)
  const reviews = await getProductReviews(productId)

  const category = product.categories[0]

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
              {category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/catalog/${category.slug}`}>
                      {category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[300px] truncate">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Основной контент товара */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Галерея */}
            <div>
              <ProductGallery 
                images={product.images} 
                productName={product.name} 
              />
            </div>

            {/* Информация о товаре */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Табы с описанием и характеристиками */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-card border border-border">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specs">Все характеристики</TabsTrigger>
              <TabsTrigger value="reviews">
                Отзывы ({product.rating_count})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div 
                className="prose whitespace-pre-wrap prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>
            
            <TabsContent value="specs" className="mt-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {product.attributes.map((attr, index) => (
                  <div 
                    key={attr.id || attr.name}
                    className={cn(
                      "flex items-start py-3 px-4",
                      index % 2 === 0 ? "bg-secondary/20" : ""
                    )}
                  >
                    <span className="text-muted-foreground w-1/2 shrink-0">
                      {attr.name}
                    </span>
                    <span className="text-foreground">
                      {attr.options.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.length ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {review.reviewer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date_created).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${review.id}-star-${index}`}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? 'text-primary fill-primary'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div
                          className="mt-3 prose prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: review.review }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Пока нет отзывов</p>
                  </div>
                )}
                <ProductReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
      </div>
    </main>
  )
}
