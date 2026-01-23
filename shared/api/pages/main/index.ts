import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { NoutbukItem, PageData, TovarItem } from './types';
import type { ProductApi } from '@/shared/types/product';

export const getMainPage = async (): Promise<PageData[]> => {
  try {
    const result = await axiosInstance.get<PageData[]>(API.getMainPage);
    const pagesWithProducts = await Promise.all(
      result.data.map(async (page) => {
        const tovary = page.acf?.zaglavnyj_blok?.tovary ?? [];
        const noutbuki = page.acf?.blok_noutbuki?.noutbuki ?? [];
        const tovaryWithProducts: TovarItem[] = await Promise.all(
          tovary.map(async (item) => {
            try {
              const productResult = await axiosInstance.get<ProductApi>(
                API.getProductById(item.tovar.ID)
              );
              return { ...item, product: productResult.data };
            } catch (e: any) {
              console.log(e, 'ERROR FETCHING PRODUCT BY ID');
              return { ...item, product: null };
            }
          })
        );
        const noutbukiWithProducts: NoutbukItem[] = await Promise.all(
          noutbuki.map(async (item) => {
            try {
              const productResult = await axiosInstance.get<ProductApi>(
                API.getProductById(item.noutbuk)
              );
              return { ...item, product: productResult.data };
            } catch (e: any) {
              console.log(e, 'ERROR FETCHING LAPTOP PRODUCT BY ID');
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
              tovary: tovaryWithProducts,
            },
            blok_noutbuki: page.acf.blok_noutbuki
              ? {
                  ...page.acf.blok_noutbuki,
                  noutbuki: noutbukiWithProducts,
                }
              : page.acf.blok_noutbuki,
          },
        };
      })
    );

    console.log(pagesWithProducts, 'MAIN PAGE DATA');
    return pagesWithProducts;
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING MAIN PAGE');
    throw e;
  }
};
