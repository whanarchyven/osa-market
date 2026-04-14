import { buildUrlset, getNewsEntries, xmlResponse } from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(buildUrlset(await getNewsEntries()))
}
