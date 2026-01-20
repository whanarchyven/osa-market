import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { HeaderPageData } from './types';


export const getHeaderData = async (): Promise<HeaderPageData[]> => {
  try {
    const result = await axiosInstance.get<HeaderPageData[]>(API.getHeaderPage);
    console.log(result.data,"HEADER PAGE DATA");
    return result.data;

  } catch (e: any) {
    console.log(e,"ERROR FETCHING HEADER PAGE");
    throw e;
  }
};
