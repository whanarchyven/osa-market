import { buildUrlset, getPromoEntries, xmlResponse } from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(buildUrlset(await getPromoEntries()))
}
