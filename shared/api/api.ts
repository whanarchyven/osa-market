export type Error = {
  message: string;
  code: number;
  customData: any;
};

export type TRequestStatuses = 'init' | 'pending' | 'fulfilled' | 'rejected';

export interface IResponse<D = any> {
  status: 'success' | 'error';
  data: D;
  errors: Error[];
}

// Базовый postfix для запроса ACF полей
// acf_format=standard - возвращает ACF поля в стандартном формате
// _embed - включает связанные объекты (embedded objects)
// _fields=acf - возвращает только ACF поля (можно убрать если нужны все поля)
const postfix = `&_embed&acf_format=standard`;

// ПРИМЕЧАНИЕ: Для получения ACF полей связанных объектов (service_types, doctors и т.д.)
// необходимо настроить фильтры на стороне WordPress в functions.php или плагине.
// Стандартный WordPress REST API не всегда автоматически включает ACF поля связанных объектов.
//
// Пример кода для WordPress (добавить в functions.php):
//
// add_filter('rest_prepare_service_types', 'add_acf_to_rest_response', 10, 3);
// add_filter('rest_prepare_doctor', 'add_acf_to_rest_response', 10, 3);
// function add_acf_to_rest_response($response, $post, $request) {
//   $response->data['acf'] = get_fields($post->ID);
//   return $response;
// }

const shopApiUrl="/wc/v3"
const wordpressApiUrl="/wp/v2"

export const API = {
  getMainPage: `${wordpressApiUrl}/pages?slug=main${postfix}`,
  getHeaderPage: `${wordpressApiUrl}/pages?slug=header${postfix}`,
  getFooterPage: `${wordpressApiUrl}/pages?slug=footer${postfix}`,
  getBuyoutPage: `${wordpressApiUrl}/pages?slug=buyout${postfix}`,
  getAboutPage: `${wordpressApiUrl}/pages?slug=about${postfix}`,

  //news
  getNewsList: (page = 1, perPage = 9, search?: string) =>
    `${wordpressApiUrl}/news?per_page=${perPage}&page=${page}${postfix}${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`,
  getNewsById: (id: number) =>
    `${wordpressApiUrl}/news/${id}?${postfix.replace('&', '')}`,
  getNewsBySlug: (slug: string) =>
    `${wordpressApiUrl}/news?slug=${slug}${postfix}`,

  //promo
  getPromoList: (page = 1, perPage = 9, search?: string) =>
    `${wordpressApiUrl}/promo?per_page=${perPage}&page=${page}${postfix}${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`,
  getPromoById: (id: number) =>
    `${wordpressApiUrl}/promo/${id}?${postfix.replace('&', '')}`,
  getPromoBySlug: (slug: string) =>
    `${wordpressApiUrl}/promo?slug=${slug}${postfix}`,


  //products
  getProducts: `${shopApiUrl}/products?per_page=100${postfix}`,
  getProductById: (id: number) => `${shopApiUrl}/products/${id}?${postfix.replace('&', '')}`,
  getProductBySlug: (slug: string) => `${shopApiUrl}/products?slug=${slug}${postfix}`,

  //attributes and terms
  getProductAttributes: `${shopApiUrl}/products/attributes?per_page=100`,
  getProductAttributeTerms: (id: number) =>
    `${shopApiUrl}/products/attributes/${id}/terms?per_page=100`,
  getProductBrands: `${shopApiUrl}/products/brands?per_page=100`,

  //reviews
  getReviews: `${shopApiUrl}/products/reviews?per_page=10`,
  getProductReviews: (id: number) =>
    `${shopApiUrl}/products/reviews?status=approved&product=${id}`,
  createReview: `${shopApiUrl}/products/reviews`,

  //categories
  getCategories:`${wordpressApiUrl}/product_cat?per_page=100${postfix}`,
  getCategoryById: (id: number) => `${wordpressApiUrl}/product_cat/${id}?${postfix.replace('&', '')}`,
  getCategoryBySlug: (slug: string) => `${wordpressApiUrl}/product_cat?slug=${slug}${postfix}`,


  //service_types
  //getServiceTypes: `/service_types?per_page=100&order=asc${postfix}`,
  //getServiceTypeById: (id: number) =>``,
};
