/**
 * Service Worker for Mosque TV Signage - Offline Support
 *
 * Strategy:
 *  - Static assets (sounds, mode images): cached on SW install, served cache-first
 *  - Dynamic media (carousel images, logo, azan images): stale-while-revalidate
 *    so the screen never goes blank, and fresh content is loaded in the background
 *    when online.
 */

const STATIC_CACHE = "ptm-static-v2"
const MEDIA_CACHE = "ptm-media-v2"

/** Static assets to pre-cache on install */
const STATIC_ASSETS = [
  "/sounds/azan1.wav",
  "/sounds/beep1.wav",
  "/sounds/notif1.wav",
  "/mode solat.png",
  "/mode azan.jpg",
]

/**
 * URL path patterns for media served from API routes.
 * These use stale-while-revalidate so cached content is served instantly
 * and updated silently in the background when connectivity is available.
 */
const MEDIA_PATTERNS = [
  /^\/api\/masjid\/[^/]+\/carousel\/.+/,
  /^\/api\/masjid\/[^/]+\/logo\/.+/,
  /^\/api\/masjid\/[^/]+\/azan-images\/.+/,
]

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) =>
        console.warn("[SW] Failed to pre-cache static assets:", err)
      )
  )
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  const CURRENT_CACHES = [STATIC_CACHE, MEDIA_CACHE]
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !CURRENT_CACHES.includes(key))
          .map((key) => {
            console.log("[SW] Deleting old cache:", key)
            return caches.delete(key)
          })
      )
    )
  )
  return self.clients.claim()
})

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Only intercept GET requests
  if (request.method !== "GET") return

  let url
  try {
    url = new URL(request.url)
  } catch {
    return
  }

  // Decode the pathname so "/mode%20solat.png" matches "/mode solat.png"
  const decodedPathname = decodeURIComponent(url.pathname)

  const isStaticAsset = STATIC_ASSETS.some((asset) => decodedPathname === asset)
  const isMediaAsset = MEDIA_PATTERNS.some((pattern) =>
    pattern.test(decodedPathname)
  )

  if (!isStaticAsset && !isMediaAsset) return

  const cacheName = isStaticAsset ? STATIC_CACHE : MEDIA_CACHE

  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      // For audio/video range requests the browser adds a Range header.
      // cache.match() may miss those requests, so we always also try matching
      // by URL alone (no headers) to find the full cached response.
      const cached =
        (await cache.match(request)) ||
        (await cache.match(new Request(url.href)))

      if (cached) {
        // If the browser sent a range request but we only have the full response,
        // just return the full response — browsers accept 200 in place of 206.
        const isRangeRequest = request.headers.has("range")
        if (isRangeRequest && cached.status !== 206) {
          // Clone and strip cache-only headers so the browser won't reject it
          const headers = new Headers(cached.headers)
          headers.delete("content-range")
          const fullResponse = new Response(cached.body, {
            status: 200,
            statusText: "OK",
            headers,
          })
          // Refresh in background
          fetch(request.clone())
            .then((r) => { if (r && r.ok) cache.put(new Request(url.href), r.clone()) })
            .catch(() => {})
          return fullResponse
        }

        // Stale-while-revalidate: serve from cache immediately, refresh in background
        fetch(new Request(url.href))
          .then((response) => {
            if (response && response.ok) {
              cache.put(new Request(url.href), response.clone())
            }
          })
          .catch(() => {
            // Silently ignore background refresh failures (device is offline)
          })
        return cached
      }

      // Not in cache yet — fetch from network and store
      try {
        const response = await fetch(new Request(url.href))
        if (response && response.ok) {
          cache.put(new Request(url.href), response.clone())
        }
        return response
      } catch {
        // Truly offline and no cache available
        console.warn("[SW] Offline and no cache for:", decodedPathname)
        return new Response("Resource unavailable offline", {
          status: 503,
          statusText: "Service Unavailable",
        })
      }
    })
  )
})
