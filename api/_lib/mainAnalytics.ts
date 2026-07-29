import { get, put } from '@vercel/blob'

export type MainAnalyticsStore = {
  pageviews: number
  visitorIds: string[]
}

export const BLOB_PATHNAME = 'main-analytics.json'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

export function optionsResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders })
}

function emptyStore(): MainAnalyticsStore {
  return { pageviews: 0, visitorIds: [] }
}

export async function loadMainAnalytics(): Promise<MainAnalyticsStore> {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: 'private',
      useCache: false,
    })

    if (!result || result.statusCode !== 200 || !result.stream) {
      return emptyStore()
    }

    const text = await new Response(result.stream).text()
    if (!text) return emptyStore()

    const data = JSON.parse(text) as Partial<MainAnalyticsStore>
    return {
      pageviews: typeof data.pageviews === 'number' ? data.pageviews : 0,
      visitorIds: Array.isArray(data.visitorIds)
        ? data.visitorIds.filter((id): id is string => typeof id === 'string')
        : [],
    }
  } catch (error) {
    // Missing blob / first run — start empty rather than failing the request
    const message = error instanceof Error ? error.message : String(error)
    if (/not found|404|BlobNotFound/i.test(message)) {
      return emptyStore()
    }
    throw error
  }
}

export async function saveMainAnalytics(store: MainAnalyticsStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
