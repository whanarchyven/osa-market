import {
  buildUrlset,
  getProductEntries,
  xmlResponse,
} from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(buildUrlset(await getProductEntries()))
}
