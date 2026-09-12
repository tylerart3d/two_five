# Research evidence viewer

Local proof implemented September 7, 2026. Public delivery is not deployed.

## Current proof

PDF pages now fit the available viewer width by default, including on mobile
and when changing citations. The Fit width control restores that view after
manual zoom. Width follows the viewport content box so padding is not counted
twice. Desktop and mobile checks confirm no horizontal overflow at default zoom.

The narrative now includes an expandable November exercise explanation. Its
sixth citation is page-only (no rectangle); the viewer shows the existing
transcription and explains that highlighting awaits alignment. Naming remains
unresolved. Brent's separate local model will perform future OCR/alignment.

Run `npm run dev` and select one of five underlined citations. The React viewer
uses PDF.js to render the unchanged three-page PDF and overlays normalized
passage rectangles. It supports page navigation, zoom, direct citation hashes,
keyboard operation, and mobile layouts. The same name on two pages has separate
anchors. Markdown in data/units/5th_marines/2nd_battalion/research/
1965_SOURCE_ANCHORS.md supplies citation metadata and exact UTF-8 OCR offsets.

Before rendering, the browser checks the complete PDF SHA-256. If bytes differ
from the anchored version, it refuses to apply the old highlights. Failure keeps
the source excerpt and original links available. The local Vite server exposes
only the allowlisted 1201048065 PDF; the rest of the raw corpus stays blocked.
PDF.js decoders and their licenses are prepared from the installed dependency
by predev/prebuild; no research PDFs enter the build output.

The September 7 remote test returned HTTP 200, application/pdf, and 147,973 bytes
at the original PDF URL. Its SHA-256 matched the local copy:
96b682a91c088a43e9964cb7a4e8e64440ea0e0c312d0162b06fd0a866f2c931.
The Access-Control-Allow-Origin response was `*.vietnam.ttu.edu`; that value
does not grant this site's origin browser access. A public deployment therefore
needs an approved, restricted delivery route; the present production build tries
the remote PDF and can fall back to the excerpt and external source links.

The verified item URL is https://vva.vietnam.ttu.edu/repositories/2/digital_objects/223454
(archive identifier 1201048065 is not the digital-object route ID).

Validation: six Playwright tests cover actual nonblank scan rendering, source
hashes/excerpts, all five citations, zoom alignment, page navigation, absent or
changed PDF bytes, retry, keyboard selection, and mobile width. Original pages
and desktop renderings were visually inspected. These are region highlights,
not a claim of automated word-level alignment across the corpus.

## Requested interaction

Clicking a sourced name, coordinate, or phrase in a research record opens the
supporting original PDF page, zoomed to and highlighted around its source text.
If a claim has multiple supporting sources, allow choosing among them. A name
elsewhere in a profile must not inherit a citation that does not support that
particular occurrence or claim.

Keep original PDFs locally for preservation and processing. Link to verified
Texas Tech item records and PDFs as the public source of record. Do not put the
raw corpus in public Git or automatically deploy it with the frontend.

## Required source anchor

- Immutable document identity and SHA-256 of the version used for alignment.
- Verified original item URL and PDF URL.
- Physical PDF page index plus printed page label where present.
- One or more normalized page rectangles for the supporting text.
- Coordinate convention: top-left origin, page orientation/rotation recorded,
  rectangles expressed as fractions of the rendered page width and height.
- Original OCR excerpt, UTF-8 byte offsets, and OCR version/hash.
- Exact original spelling and normalized display value kept separately.
- Alignment method and reviewed/approximate/unmapped status.

Plain-text Vision OCR offsets locate text in the transcription; they do not
establish a rectangle on the original scan. Add alignment without replacing
the existing transcription. Use embedded PDF text positions where usable,
otherwise layout-aware OCR or manually verified passage rectangles. Never
pretend a word-level highlight is exact when only a paragraph has been located.

## Delivery investigation

A PDF viewer under our control can render the page and overlay the saved
rectangles even for a scanned page without searchable embedded text. PDF.js is
a candidate. A plain original-PDF link may open a page in a compatible viewer,
but does not provide consistent control over an exact highlight.

Loading Texas Tech PDFs directly in our viewer depends on the actual endpoint's
CORS configuration, redirects, and availability. This has not yet been tested.
Mozilla documents the cross-origin restriction and the alternatives of CORS or
a server-side proxy in its [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions).
Its [viewer options](https://github.com/mozilla/pdf.js/wiki/Viewer-options)
describe page/zoom navigation.

Test one verified 1965 source through the intended deployment before choosing
delivery. Prefer direct loading when supported. If unavailable, evaluate a
restricted document-ID-based proxy/cache under applicable source terms. That
would serve source bytes through our infrastructure, even without maintaining
a separately published PDF collection; do not describe it as direct linking.
Retain an external original-source link and a clear fallback when viewing fails.

## First acceptance check

For archive 1201048065, choose one name, date, and passage from the original PDF.
Validate page alignment, highlight placement at several zoom levels, source
attribution, a repeated-name occurrence, and behavior when the remote source is
unavailable. Approximate or absent anchors should visibly fall back to the
correct page or excerpt rather than a misleading highlight.
