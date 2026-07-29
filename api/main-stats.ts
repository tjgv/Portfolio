import { jsonResponse, loadMainAnalytics, optionsResponse } from './_lib/mainAnalytics'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') return optionsResponse()
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    const store = await loadMainAnalytics()
    return jsonResponse({
      pageviews: store.pageviews,
      uniqueVisitors: store.visitorIds.length,
      persistence: 'blob',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load stats'
    console.error('[main-stats]', error)
    return jsonResponse({ error: message }, 500)
  }
}
