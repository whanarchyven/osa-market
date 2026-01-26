import { NextResponse } from 'next/server'
import { prepareHeaders } from '@/shared/api/prepareHeaders'

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL

const buildTargetUrl = (request: Request, pathParts: string[]) => {
  const url = new URL(request.url)
  const path = pathParts.join('/')
  return `${API_URL}/${path}${url.search}`
}

const forwardRequest = async (request: Request, pathParts: string[]) => {
  if (!API_URL) {
    return NextResponse.json(
      { message: 'API_URL is not configured' },
      { status: 500 }
    )
  }

  const headers = prepareHeaders(new Headers())
  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.text() : undefined

  const response = await fetch(buildTargetUrl(request, pathParts), {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  })

  const contentType = response.headers.get('content-type') ?? 'application/json'
  const data = await response.text()

  return new NextResponse(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  return forwardRequest(request, resolvedParams.path ?? [])
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  return forwardRequest(request, resolvedParams.path ?? [])
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  return forwardRequest(request, resolvedParams.path ?? [])
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  return forwardRequest(request, resolvedParams.path ?? [])
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  return forwardRequest(request, resolvedParams.path ?? [])
}
