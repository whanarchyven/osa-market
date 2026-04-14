import {
  buildUrlset,
  getCategoryEntries,
  xmlResponse,
} from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(buildUrlset(await getCategoryEntries()))
}
