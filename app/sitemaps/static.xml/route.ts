import { buildUrlset, getStaticEntries, xmlResponse } from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(buildUrlset(getStaticEntries()))
}
