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


## Sector editions (RICE v2, in progress)
- `sectors.html` — hub page selling the shared architecture across editions
- `healthcare/` — RICE-HC, Healthcare Edition. P1 (Governance) drafted and benchmarked; P2–P9 shown as "benchmarking" stubs pending real-world validation
- Citation prefix is edition-aware: set via `data-edition` on `<body>` (defaults to `RICE-FSI` if absent — every existing FSI page needs no change)
- Government and Manufacturing editions: not yet started, placeholder cards only on the hub
- Control-ID numbering is independent per sector — RICE-FSI P5.03 and RICE-HC P5.03 are different objectives by design (see hub page for the citation-format explanation)


## Phased sector roadmap (v2)
Grounded in Malaysia's Cyber Security Act 2024 (Act 854) — 11 statutory NCII sectors.
- **Phase 1 (shipped):** FSI — covers Banking & Finance NCII sector
- **Phase 2 (in progress):** Healthcare (= Healthcare Services NCII, P1 drafted), Government, Manufacturing
- **Phase 3 (roadmap):** Media & Digital (= Information/Communication & Digital NCII), Education (deliberate gap-fill, not an NCII sector), remaining 6 NCII sectors

Sector switcher is a dropdown (`#sectorSwitch` / `.sector-switch-menu`) on every interior page's nav, and a matching `.vmenu-sector` list inside the homepage's glass menu popover — chosen over pills specifically because the list will keep growing.


## Live gap-fix: Cybersecurity Act 2024 (Act 854)
RICE-FSI now carries two new objectives closing the Act 854 gap identified during the v2 roadmap review:
- **P1.09** — Act 854 NCII obligations (incident notification, annual risk assessment, biennial audit) layered on top of BNM RMiT
- **P6.09** — NACSA cybersecurity service provider licensing verification for vendors

Objective count is now 82 (was 80) — updated everywhere it's referenced: homepage stats strip, framework hero, meta descriptions, sectors hub. Framework name kept spelled out as "Cybersecurity Act 2024 (Act 854)" throughout, since the Act 854 shorthand isn't yet widely recognized.


## Phase 2 expansion: Government and Manufacturing live
- `government/` — RICE-GOV. P1 benchmarked against Cybersecurity Act 2024 (Act 854) and the structural gap where PDPA 2010 doesn't bind federal government. Cites confirmed Auditor-General findings (MySejahtera "Super Admin" incident) — explicitly does NOT cite the debunked "17M MyKad leak" claim, which NRD/NACSA investigated and refuted.
- `manufacturing/` — RICE-MFG. P1 benchmarked against IEC 62443, deliberately calibrated to a realistic L1-L2 starting maturity reflecting real Malaysian adoption patterns (ROI/downtime/fine-gated investment, not risk-gated).
- All three Phase 2 sectors (Healthcare, Government, Manufacturing) are now unlocked in the sector switcher dropdown and the hub page.
- Objective counts: Government P1 = 9 objectives, Manufacturing P1 = 8 objectives.


## Full pillar drafts: Healthcare, Government, Manufacturing (all P2-P9 added)
All three Phase 2 sectors now have all 9 pillars drafted (previously P1 only):
- Healthcare: 48 objectives total (P1=8, P2-P9=40)
- Government: 49 objectives total (P1=9, P2-P9=40)
- Manufacturing: 48 objectives total (P1=8, P2-P9=40)

Every pillar carries a `.draft-badge` ("DRAFT", amber, dot indicator) next to its ID — visible even when the accordion is collapsed — so status is unambiguous. None of this content is validated against real-world engagement yet; that happens progressively as the user's H3C exposure grows per sector. Status text updated everywhere: dropdown menus, hub cards, sector landing pages all say "9/9 drafted · 0/9 validated" instead of "P1 drafted."

P2-P9 content was adapted from RICE-FSI's proven pillar structure (same 8 pillar names/scopes) rather than invented from scratch, re-benchmarked per sector:
- Healthcare: HIPAA, HITRUST CSF, IEC 80001-1/81001-5-1, FDA SPDF
- Government: Cybersecurity Act 2024 (Act 854), PDPA-gap framing, Auditor-General precedent
- Manufacturing: IEC 62443, ROI/downtime-gated adoption reality baked directly into objective language


## Layout fix + Manufacturing: Smart/lights-out coverage
- Fixed a real layout bug: sector landing pages' "benchmark set" cards were misusing `.mat` (a strict 3-column grid built for the FSI maturity table), forcing 2-child label+paragraph content into a 3-column template and causing text collision. New dedicated `.bench` component fixes this across Healthcare, Government, and Manufacturing.
- Manufacturing now explicitly covers smart manufacturing / lights-out (near-fully-autonomous) production:
  - P7.02-P7.04: Purdue Model **Level 3.5 (Industrial DMZ)** — the formal OT/IT boundary — plus new objectives assigning explicit named ownership of that boundary (P7.03) and requiring bidirectional traffic monitoring at the boundary itself (P7.04), addressing the IT/OT responsibility ambiguity directly.
  - P9.06-P9.08: telemetry scaled to production autonomy, automated contingency/fail-safe procedures for unmanned lines, and cascading-failure risk assessment for machine-speed events.
  - Manufacturing objective count: 48 → 53.


## Self-Assessment tool (`assess.html`)
Interactive 3-step self-read against the RICE maturity model — sector select, role select, then a role-filtered question set:
- 27 questions total (3 per pillar x 9 pillars), each tagged by role
- Executive & Board: 9 questions (~6 min) — strategic/governance angle only
- Manager & Department Lead: 18 questions (~13 min) — governance + operational
- IT & Security Officer: 18 questions (~13 min) — operational + technical
- Scored against RICE's existing L1-L5 ladder (Aware/Developing/Defined/Managed/Optimising) — same scale used in framework.html and roadmap.html, not a new one
- Results: hand-drawn canvas radar chart (9 axes), weakest-pillar "where to start" callout, full pillar breakdown, CTA linking to the relevant sector's framework page
- State persists via localStorage (resume mid-assessment on reload) — no backend, nothing sent anywhere, stated explicitly in the footer
- Sector selection is generic/reusable — one universal question bank, sector choice mainly routes the results CTA to the right framework page

## Bug fixes this round
- `.nav-in .nav-links` had an unguarded display:flex rule sitting outside its media query (introduced during the V7 sector-switch work) — this silently broke the mobile burger-menu collapse on every page since then. Fixed by scoping it to `min-width:901px`.
- Assessment shell (`.asm-shell`) wasn't tagged with the site's content z-index rule, so the fixed background `.veil` intercepted clicks after scrolling. Fixed with explicit `position:relative; z-index:1`.


## Self-Assessment v2: domain-specific + navigation fixes
- **Domain-specific question banks per sector** — no longer one universal bank. FSI questions reference BNM RMiT, core banking, fraud, fintech partners. Healthcare references PHI, EHR, break-glass access, HIPAA, IoMT. Government references citizen databases, PDPA's government exemption, cross-agency coordination, Act 854. Manufacturing references OT/IT convergence, Level 3.5 Industrial DMZ, ransomware-line-stoppage framing. 108 questions total (27 per sector), same 9-pillar/3-role structure throughout so results stay comparable.
- **Back button made prominent and available from question 1** — previously text-only and only visible from Q2 onward. Now a styled pill button visible on every question; on Q1 it reads "Back to role selection" instead of being hidden.
- **Sector development status shown up front** — each sector card on Step 1 now carries a status tag (LIVE — V1.0 for FSI, 9/9 PILLARS DRAFTED for the other three), plus an explanatory note that draft-sector results are a conversation starter, not a finished benchmark. The results page CTA for draft sectors also carries this caveat.
- **"Don't see your sector?" contact block** added to Step 1 — links to LinkedIn for feedback/future development requests, for anyone whose sector (Education, Media, Transport, Energy, etc.) isn't covered yet.


## Nav bar fix
- `.nav-links a` was missing `white-space:nowrap`, so "Self-Assessment" wrapped onto two lines while every other link stayed on one — inconsistent and visually broken.
- Root cause of the underlying squeeze: the burger-menu breakpoint was still set at 880px from when the nav carried 6 links; with Sectors + Self-Assessment added it now needs ~1034px to lay out comfortably. Raised the breakpoint to 1080px (and synced the matching min-width rule and the sector-switch mobile-stacking breakpoint) so the full nav never overflows its container at any width — verified zero overflow from 1081px up, clean burger collapse at 1080px and below, across all 14 pages.
