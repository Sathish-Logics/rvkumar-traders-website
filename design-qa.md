# Design QA — Terracotta Studio redesign

## Evidence

- Source visual truth: `/home/travelin-soldier/Pictures/Screenshots/Screenshot From 2026-10-29 11-21-39.png`
- Primary photographic asset: `/home/travelin-soldier/Downloads/Golden Hour Construction Skyline.png`
- Desktop implementation: `docs/redesign-qa/2026-10-29/home-desktop.png`
- Tablet implementation: `docs/redesign-qa/2026-10-29/home-tablet.png`
- Mobile implementation: `docs/redesign-qa/2026-10-29/home-mobile.png`
- Catalogue evidence: `docs/redesign-qa/2026-10-29/products-desktop.png`, `docs/redesign-qa/2026-10-29/products-mobile.png`
- Enquiry evidence: `docs/redesign-qa/2026-10-29/enquiry-desktop.png`, `docs/redesign-qa/2026-10-29/enquiry-mobile.png`
- Combined comparison: `docs/redesign-qa/2026-10-29/source-vs-desktop.png`

## Capture details

- Desktop viewport and implementation pixels: 1440 × 1000 CSS px, device scale factor 1, 1440 × 1000 PNG.
- Tablet viewport and implementation pixels: 768 × 1024 CSS px, device scale factor 1, 768 × 1024 PNG.
- Mobile viewport and implementation pixels: 375 × 812 CSS px, device scale factor 1, 375 × 812 PNG.
- Source pixels: 1115 × 828. For the combined comparison it was proportionally resized and centered on a 1440 × 1000 ivory canvas; no density-based fidelity findings were filed.
- State: public pages, default navigation state, local development data.

## Full-view comparison

The implementation preserves the source reference's restrained navigation, generous surrounding canvas, dark framed hero, oversized white display type, concise CTA hierarchy and dominant construction imagery. The supplied golden-hour image replaces the reference image intentionally and is sharper, locally optimized and appropriately cropped. The implementation adds a secondary materials action and operational trust content required by the live product rather than copying unsupported project statistics from the reference.

## Focused-region comparison

Focused review covered the navigation/brand lockup, hero heading and CTA group, hero-image crop, product card imagery and the multi-material form controls. These details are readable in the desktop and mobile evidence; no additional crop was required.

## Required fidelity surfaces

- Fonts and typography: Manrope provides the editorial display weight and Inter preserves readable body/form text. Hierarchy, wrapping and mobile line lengths are consistent across all requested widths.
- Spacing and layout rhythm: desktop uses the framed reference composition; tablet and mobile reduce padding without collapsing hierarchy. Cards and form rows retain stable gaps and touch sizes.
- Colors and visual tokens: charcoal `#292724`, terracotta `#E48C62` and ivory `#FAF1E6` are used consistently with accessible high-contrast hero text and restrained borders.
- Image quality and asset fidelity: the supplied 1672 × 941 source was converted locally to a 282 KB WebP and rendered with `next/image`, explicit responsive sizes, reserved aspect ratio and purposeful object positioning.
- Copy and content: the required headline is exact. Existing business, service-area and enquiry-first language is preserved; unsupported phone numbers, prices, reviews and project statistics were not introduced.

## Findings

- No actionable P0, P1 or P2 visual mismatch remains.
- P3: final production review should replace any remaining placeholder contact wording once verified business contact details are supplied.

## Comparison history

### Pass 1

- Earlier finding: none at P0/P1/P2 after the first browser-rendered comparison.
- Evidence reviewed: source-versus-desktop composite plus independent tablet and mobile captures.
- Post-comparison verification: catalogue and enquiry pages captured at desktop and mobile sizes; all public routes returned HTTP 200.

## Interaction and runtime checks

- Verified homepage, catalogue, enquiry, about, contact, privacy and terms routes in the browser/runtime.
- Verified responsive navigation controls render at tablet and mobile widths.
- Verified the live database-backed product list and multi-product form render without changing the submission handler.
- Chrome emitted only its external GCM registration warning; no application console error was observed in the capture output. A Next.js image-quality configuration warning found during the pass was corrected by using the configured quality value.

## Follow-up polish

- Re-check social/contact affordances after verified phone, WhatsApp and email details are configured.

final result: passed
