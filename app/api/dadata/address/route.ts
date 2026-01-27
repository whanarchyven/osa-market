import { NextResponse } from 'next/server'

const DADATA_URL =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

export async function POST(request: Request) {
  const apiKey = process.env.DADATA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { message: 'DADATA_API_KEY is not configured' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => null)
  const query =
    typeof body?.query === 'string' ? body.query.trim() : undefined

  if (!query) {
    return NextResponse.json({ message: 'Query is required' }, { status: 400 })
  }

  const response = await fetch(DADATA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({ query }),
  })

  const contentType = response.headers.get('content-type') ?? 'application/json'
  const data = await response.text()

  return new NextResponse(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  })
}
