/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        // Prevent the browser from caching the service worker script itself,
        // so updates are picked up immediately.
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            // Allow the SW (placed at root /sw.js) to control the full origin
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ]
  },
}

export default nextConfig
