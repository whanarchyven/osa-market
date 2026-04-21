import { unstable_cache } from 'next/cache';
import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { HeaderPageData } from './types';

export const getHeaderData = unstable_cache(
  async (): Promise<HeaderPageData[]> => {
    try {
      const result = await axiosInstance.get<HeaderPageData[]>(API.getHeaderPage);
      console.log(result.data, 'HEADER PAGE DATA');
      return result.data;
    } catch (e: any) {
      console.log(e, 'ERROR FETCHING HEADER PAGE');
      throw e;
    }
  },
  ['wp-header-page'],
  /** Согласовано с редким ISR страниц «О нас» / юр. документов; иначе кэш 60 с режет s-maxage всего дерева. */
  { revalidate: 86400 },
);
