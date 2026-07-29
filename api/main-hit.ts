import {
  jsonResponse,
  loadMainAnalytics,
  optionsResponse,
  saveMainAnalytics,
} from './_lib/mainAnalytics'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') return optionsResponse()
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    let visitorId = ''
    try {
      const body = (await request.json()) as { visitorId?: unknown }
      if (typeof body.visitorId === 'string') {
        visitorId = body.visitorId.trim()
      }
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400)
    }

    if (!visitorId || visitorId.length > 128) {
      return jsonResponse({ error: 'visitorId required' }, 400)
    }

    const store = await loadMainAnalytics()
    store.pageviews += 1
    if (!store.visitorIds.includes(visitorId)) {
      store.visitorIds.push(visitorId)
    }
    await saveMainAnalytics(store)

    return jsonResponse({
      ok: true,
      pageviews: store.pageviews,
      uniqueVisitors: store.visitorIds.length,
      persistence: 'blob',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to record hit'
    console.error('[main-hit]', error)
    return jsonResponse({ error: message }, 500)
  }
}
