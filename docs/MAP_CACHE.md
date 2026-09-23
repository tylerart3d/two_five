# Local map cache

The workstation's Vite server caches OpenStreetMap tiles requested by readers in
`data/local/map-tiles/osm/` (gitignored). Tailscale readers share this disk cache.
Fresh tiles are reused across server restarts; expired tiles are conditionally
revalidated using the provider's ETag or Last-Modified value. HTTP cache lifetimes
are respected, with a seven-day fallback when no expiry is supplied. Failed
requests and provider error images are not stored. Simultaneous requests for the
same tile share one upstream request.

Only viewed tiles are fetched: there is no area downloader or prefetch job.
This is a reuse cache, not a complete offline map. Unvisited areas still require
internet access. Cache files may be deleted with the server stopped to reclaim
space; they will be fetched again on demand.

The default Relief + Streets layer blends Esri hillshade with OpenStreetMap.
Esri relief and satellite requests remain direct, using ordinary browser HTTP
caching. Stadia's account-limited layer has been removed; its terms prohibit
server-side caching. The appearance differs from the former Stamen terrain map.

The disk endpoint is currently provided by the local development server. Static
production builds use OpenStreetMap directly with browser caching. A future
hosted deployment needs its own policy-compliant cache service if shared disk
caching is desired.

Policies: [OpenStreetMap tile usage](https://operations.osmfoundation.org/policies/tiles/),
[Stadia terms](https://stadiamaps.com/terms-of-service/).

Verification: `node --test scripts/map-tile-cache.test.mjs` uses fake upstream
responses and temporary directories; it does not fetch public map tiles.
