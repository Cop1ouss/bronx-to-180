// Bronx to 180 — service worker.
// Lives in /public so it is served as-is (NOT processed by Vite); the base
// path is hardcoded to match vite.config.js `base` and the manifest scope.
const BASE = '/bronx-to-180/'
const VERSION = 'v2'
const CACHE = `b180-${VERSION}`

// App-shell files known at install time. Hashed JS/CSS bundles are picked up
// at runtime by the stale-while-revalidate handler below.
const SHELL = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icon.svg`,
  `${BASE}pwa-192.png`,
  `${BASE}pwa-512.png`,
  `${BASE}apple-touch-icon.png`,
]

// The built JS/CSS bundles have hashed names we can't list ahead of time, so
// at install we fetch index.html and pull the asset URLs out of it. This makes
// the app work offline from the very first visit (before the SW controls the
// page and the runtime cache would otherwise kick in).
async function precache() {
  const cache = await caches.open(CACHE)
  await cache.addAll(SHELL)
  try {
    const res = await fetch(`${BASE}index.html`, { cache: 'no-cache' })
    const html = await res.text()
    const assets = new Set()
    const re = /\/bronx-to-180\/assets\/[^"')\s]+\.(?:js|css)/g
    let m
    while ((m = re.exec(html))) assets.add(m[0])
    await Promise.all(
      [...assets].map((url) => cache.add(url).catch(() => {}))
    )
  } catch {
    // Offline at install (rare) — runtime caching will fill in later.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // SPA navigations: network-first, falling back to the cached app shell so
  // the app still opens offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(`${BASE}index.html`, copy))
          return res
        })
        .catch(() => caches.match(`${BASE}index.html`).then((r) => r || caches.match(BASE)))
    )
    return
  }

  // Everything else (hashed assets, icons): stale-while-revalidate.
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request)
          .then((res) => {
            if (res && res.status === 200) cache.put(request, res.clone())
            return res
          })
          .catch(() => cached)
        return cached || network
      })
    )
  )
})
