/**
 * Media caching utilities for offline support in Signage display.
 *
 * Uses the browser's Cache API (via the service worker) to explicitly
 * pre-cache images and sounds so they are available when the TV goes offline.
 */

const MEDIA_CACHE_NAME = "ptm-media-v2"

/**
 * Register the service worker that handles offline caching.
 * Should be called once when the Signage component mounts.
 */
export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      // Scope must cover the API routes we want to intercept
      scope: "/",
    })
    console.log("[SW] Registered, scope:", registration.scope)
  } catch (error) {
    console.warn("[SW] Registration failed:", error)
  }
}

/**
 * Explicitly pre-cache an array of URLs so they are available offline.
 * Skips URLs that are already cached and silently ignores individual failures.
 * Safe to call with duplicate URLs across multiple invocations.
 */
export const preCacheUrls = async (urls: string[]): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return
  }

  const validUrls = urls.filter(Boolean)
  if (validUrls.length === 0) return

  try {
    const cache = await caches.open(MEDIA_CACHE_NAME)

    await Promise.allSettled(
      validUrls.map(async (url) => {
        try {
          const existing = await cache.match(url)
          if (!existing) {
            const response = await fetch(url)
            if (response.ok) {
              await cache.put(url, response)
              console.log("[Cache] Pre-cached:", url)
            }
          }
        } catch {
          // Non-fatal: individual URL may be unavailable (e.g. 404)
        }
      })
    )
  } catch (error) {
    console.warn("[Cache] Failed to open media cache:", error)
  }
}
