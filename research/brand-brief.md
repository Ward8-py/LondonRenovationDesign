# London Renovation Design: source-grounded brand brief

Prepared 3 October 2026 for a landing-page-only redesign.

## Business and audience

London Renovation Design Ltd is a Harrow-based renovation and property-development business serving London and surrounding areas. Its two landing-page journeys are (1) property owners needing help after fire or flood and (2) people planning kitchens, bathrooms and wider home improvements. The source site describes coordinating design, planning and installation across multiple trades.

The first audience needs clarity, reassurance and a direct phone route. The second needs evidence of care, an understandable process and an easy project conversation. Both should reach the appropriate enquiry without reading the entire service catalogue.

## Verified source locations

| Subject | Source |
| --- | --- |
| Company positioning, London coverage, project coordination | https://www.londonrenovationdesign.co.uk/home/ |
| Company process, surveys and fees | https://www.londonrenovationdesign.co.uk/about-us/ |
| Telephone, direct line, email and address | https://www.londonrenovationdesign.co.uk/contact-us/ |
| Restoration scope and historical response claims | https://www.londonrenovationdesign.co.uk/flood-fire-restoration/ |
| Kitchen/bathroom planning, design, installation, supply or installation-only | https://www.londonrenovationdesign.co.uk/kitchens-bathrooms/ |
| Existing image collection | https://www.londonrenovationdesign.co.uk/gallery/ |

Main phone: 0333 988 0198. Direct line in source: 0770 101 8455. Email: info@londonrenovationdesign.co.uk. Address: 15A Station Road, Harrow, London HA1 2UF. The landing page uses the main number consistently.

## Archive and migration scope

`original-site/archive.json` records every discovered public page, its HTML file, extracted text, image references and source links. `original-site/content.md` is the readable text collection. Original page snapshots and media are under `original-site/html/` and `original-site/media/`. The crawl followed same-site navigation and sitemap discovery, including gallery originals linked from thumbnails. It excludes private content, login routes, query variants, external sites and unlinked/undiscoverable pages. This is a public content archive, not a WordPress database or server backup.

Completed crawl: 27 HTML pages and 773 image URLs downloaded, including size variants; zero recorded page or asset failures, no remaining crawl queue. Images may be stock, supplier or project material; being on the old site does not independently establish them as completed LRD projects.

The complete service inventory includes kitchens/bathrooms, design/supply/installation, installation-only, extensions, loft conversions, heating/plumbing, electrical work, plastering, quartz, marble, granite, acrylic surfaces, and restoration. Preserve this material for future pages. This build intentionally implements only the landing page and its enquiry interaction.

## Claims requiring clarification before reuse

- About page says 12 months workmanship guarantee; home/footer and kitchen pages say two years. No guarantee duration is advertised in this build.
- The old restoration page advertises a two-hour response and 24-hour call-outs. Current operational availability has not been reconfirmed; the landing page uses a direct restoration contact route without a response-time promise.
- The original-site accreditation artwork contains Gas Safe, NICEIC, CHAS and British Institute of KBB Installation badges. At the user's request, these archived badges are shown in the landing-page slider. Current membership or approval status has not been independently reconfirmed. No testimonial, rating or new affiliation is invented.
- The source describes an initial enquiry visit as obligation-free but also describes a chargeable survey credited against a final invoice. The new CTA does not promise a free survey.

## Visual direction

Updated 4 October 2026 following the user's design feedback.

**Idea:** Restore. Renovate. Reimagine. Make the restoration contact route and private-renovation journey immediately understandable.

White surfaces, dark ink and the brand's red action colour replace the earlier warm-paper direction. Locally hosted Archivo provides bold centred hero typography and practical body text. The user-supplied white-and-red monogram appears on the transparent hero header and dark footer. CSS remains the source of exact tokens.

Layout: full-screen photograph hero; transparent masthead; direct emergency call and expertise buttons; featured-service space ready for an approved promotion; continuously moving accreditation strip; two service panels; three-step approach; red contact section and practical footer. The badge label and visible pause button were removed at the user's request, and individual badge spacing increased.

Motion: existing GSAP arrival and section movement, one Lenis instance, and a CSS badge loop. Hover or keyboard focus pauses badge movement. Reduced motion stops the loop and exposes a static scrollable strip. No WebGL or additional animation dependency is used. Prerendered text, direct phone links and email fallbacks remain available without JavaScript.

## Assets and provenance

- `public/images/lrd-logo-original.png`: user-supplied two-variant logo, preserved unchanged (2070 × 760). The BrandLogo component frames the white-and-red variant. `public/images/logo.png` retains the previous live-site wordmark as an unused source asset.
- `public/images/{kitchen,bathroom,restoration}.webp` and smaller variants: optimised copies of the pre-existing project `assets/*-concept.png` images. These are illustrative concepts, explicitly captioned on the page, not presented as completed projects.
- Archivo: https://fonts.google.com/specimen/Archivo. Served locally as variable WOFF2, with its OFL licence in `public/fonts/archivo-OFL.txt`. The older Instrument Serif and Manrope files remain unused.
- `public/images/accreditations.png`: unchanged archive artwork from `research/original-site/media/11c1fa09-accreditations-1.png`. Individual logos are framed in SVG viewports, leaving the source image intact.
- Small UI arrows and checks are simple inline interface symbols. The letter favicon is navigation identification, not a replacement for the real wordmark.

## Conversion and release boundaries

The user can call or email directly, or open a service-specific enquiry dialog. The PHP endpoint validates requests and can hand mail to a configured PHP mail transport. Local preview deliberately leaves mail disabled; it reports failure honestly and offers a populated email draft. No test enquiry has been emailed to the business.

Before publishing: configure and verify the hosting mail transport, confirm the customer-facing form/data handling with the business, and complete rendered desktop/mobile and keyboard checks. Browser automation access was declined during this build, so those checks are not claimed as completed. No live site was changed or published.
