import { unstable_cache } from 'next/cache';
import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { KompyuterItem, NoutbukItem, PageData } from './types';
import type { ProductApi, ProductListItem } from '@/shared/types/product';

const mapProductToListItem = (product: ProductApi): ProductListItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  short_description: product.short_description,
  price: product.price,
  regular_price: product.regular_price,
  sale_price: product.sale_price,
  on_sale: product.on_sale,
  average_rating: product.average_rating,
  rating_count: product.rating_count,
  stock_status: product.stock_status,
  categories: product.categories,
  brands: product.brands,
  images: product.images.slice(0, 1).map((image) => ({
    src: image.src,
    alt: image.alt,
  })),
  attributes: product.attributes.slice(0, 4),
});

const getMainPageImpl = async (): Promise<PageData[]> => {
  try {
    const result = await axiosInstance.get<PageData[]>(API.getMainPage);
    const pagesWithProducts = await Promise.all(
      result.data.map(async (page) => {
        const noutbuki = page.acf?.blok_noutbuki?.noutbuki ?? [];
        const kompyutery = page.acf?.blok_kompyutery?.kompyutery ?? [];
        const noutbukiWithProducts: NoutbukItem[] = await Promise.all(
          noutbuki.map(async (item) => {
            try {
              const productResult = await axiosInstance.get<ProductApi>(
                API.getProductById(item.noutbuk)
              );
              return { ...item, product: mapProductToListItem(productResult.data) };
            } catch (e) {
              console.error(e, 'ERROR FETCHING LAPTOP PRODUCT BY ID');
              return { ...item, product: null };
            }
          })
        );
        const kompyuteryWithProducts: KompyuterItem[] = await Promise.all(
          kompyutery.map(async (item) => {
            try {
              const productResult = await axiosInstance.get<ProductApi>(
                API.getProductById(item.kompyuter)
              );
              return { ...item, product: mapProductToListItem(productResult.data) };
            } catch (e) {
              console.error(e, 'ERROR FETCHING PC PRODUCT BY ID');
              return { ...item, product: null };
            }
          })
        );

        return {
          ...page,
          acf: {
            ...page.acf,
            zaglavnyj_blok: {
              ...page.acf.zaglavnyj_blok,
              tovary: page.acf.zaglavnyj_blok?.tovary ?? [],
            },
            blok_noutbuki: page.acf.blok_noutbuki
              ? {
                  ...page.acf.blok_noutbuki,
                  noutbuki: noutbukiWithProducts,
                }
              : page.acf.blok_noutbuki,
            blok_kompyutery: page.acf.blok_kompyutery
              ? {
                  ...page.acf.blok_kompyutery,
                  kompyutery: kompyuteryWithProducts,
                }
              : page.acf.blok_kompyutery,
          },
        };
      })
    );

    return pagesWithProducts;
  } catch (e) {
    console.error(e, 'ERROR FETCHING MAIN PAGE');
    throw e;
  }
};

export const getMainPage = unstable_cache(getMainPageImpl, ['wp-main-page'], {
  revalidate: 60,
});
