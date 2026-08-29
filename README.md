# RICE — Resilient Integrated Cybersecurity Ecosystem

Static site for the RICE Framework (v1.0, FSI Edition). No build step, no dependencies, no external services — plain HTML/CSS/JS with self-hosted IBM Plex fonts.

## Stack notes
- Background: HLS video stream (swap the STREAM_URL constant at the top of js/app.js — all 5 candidate streams are listed there). Falls back automatically to a three.js 3D constellation, then to a 2D canvas if WebGL is unavailable.
- hls.js loads from cdnjs at runtime for Chrome/Firefox HLS playback (Safari plays natively).
- Vendored libraries (self-hosted in assets/vendor/): GSAP + ScrollTrigger, Lenis, three.js.

## Deploy — GitHub Pages (recommended)

1. Create a new **public** repo (e.g. `rice-framework`).
2. Push the contents of this folder to the repo root (`index.html` at top level).
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Site goes live at `https://<username>.github.io/rice-framework/` within a minute or two.

`.nojekyll` is included so GitHub serves files as-is.

## Stack notes
- Background: HLS video stream (swap the STREAM_URL constant at the top of js/app.js — all 5 candidate streams are listed there). Falls back automatically to a three.js 3D constellation, then to a 2D canvas if WebGL is unavailable.
- hls.js loads from cdnjs at runtime for Chrome/Firefox HLS playback (Safari plays natively).
- Vendored libraries (self-hosted in assets/vendor/): GSAP + ScrollTrigger, Lenis, three.js.

## Deploy — Cloudflare Pages (alternative)

Dashboard → Workers & Pages → Create → Pages → connect the repo (or direct upload). Build command: none. Output directory: `/`. Everything works unchanged.

## Custom domain (optional)

Both hosts support custom domains free (domain itself ~USD 10–15/yr). On GitHub Pages: Settings → Pages → Custom domain, then add the CNAME/A records at your registrar. After that, update the `og:image` URL in each page's `<head>` to the absolute URL (social scrapers need absolute paths).

## Structure

```
index.html        Overview — liquid-glass hero over particle network, system schematic, pillar story
framework.html    The standard — 80 objectives, citable IDs, filters, maturity model
landscape.html    Threat evolution, incidents, framework analysis, 12-dim matrix
roadmap.html      3-phase implementation, maturity target, community
about.html        Author
404.html          Custom not-found page (GitHub Pages picks it up automatically)
css/styles.css    Full design system (edit tokens in :root)
js/app.js         Nav, filters, search, copy-ID, deep links — vanilla, no deps
assets/fonts/     IBM Plex Sans + Mono (self-hosted woff2, Latin subset)
assets/*.svg      RICE seal variants
```

## Editing

- Colors/typography: tokens at the top of `css/styles.css` (`:root`).
- Objectives: each is an `.obj` block in `framework.html`; `data-maps` drives the filter chips (`rice bnm nist cisa owasp iso`).
- New pillar/edition: copy a `<details class="pillar">` block and follow the ID pattern.

© MJ Lee 2025–2026 · Not vendor-affiliated.
