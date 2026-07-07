# PDC Builders — Website

A fast, responsive marketing site for **PDC Builders** — custom home builder, Manahawkin / Long Beach Island, NJ. Slogan: *"Committed to custom design with superior quality."*

**Design:** luxury-minimalist, modeled on [arhomes.com](https://www.arhomes.com/) (airy white, elegant serif, hairline detailing, full-bleed imagery), styled with PDC's real brand — the **phoenix logo** and its **charcoal `#404041` / gold `#EABE2B` / red `#EF382F`** palette. Type: **Cormorant Garamond** (display serif) + **Montserrat** (sans).

## Run locally
```bash
cd pdc-builders
python3 -m http.server 8481
# open http://localhost:8481
```
Static site — any host (Netlify, Vercel, GitHub Pages, S3) works with no build step.

## Structure
```
pdc-builders/
├── index.html          # single-page site
├── assets/
│   ├── style.css       # brand system: charcoal + gold + red; Cormorant Garamond + Montserrat
│   ├── main.js         # sticky nav (logo swap on scroll), mobile menu, hero slideshow, reveal, residence scroller, lightbox, demo form
│   ├── img/            # 22 project photos (web + -sm) + logo-light/logo-dark/favicon (from PDC's Wix CDN)
│   └── brand/          # original hi-res PDC logo downloads (color crest + white/transparent phoenix)
```

## Sections
Hero (full-screen slider: dots + arrows + synced caption, autoplay) · mission statement · "What We Build" quick-links · featured residence (horizontal scroller + lightbox) · editorial parallax pull-quote · services (4 alternating rows) · process · about (phoenix story) · testimonial (dark) · CTA band · contact form · footer.

**Webflow mapping for the extras:** hero slider → Webflow **Slider** component (or Tabs) with autoplay; editorial pull-quote → two images with different *While-scrolling-in-view → Move* speeds around a text block (AR's masonry-quote pattern); the icon-free contact/about lists are just styled text (gold label + serif value, gold dash bullets).

## Scroll behavior (modeled on AR Homes) — all reproducible in Webflow natively
- **Parallax** — images drift as you scroll (`data-parallax="0.12–0.18"` on hero, service, about, and CTA images; images are sized 118% with 9% headroom so drift never exposes an edge). AR Homes does this with Rellax.js. **Webflow equivalent:** Interactions → *While scrolling in view → Move* (Y axis). No code.
- **Reveal on scroll** — headings/text/CTAs fade + rise into view (IntersectionObserver `.reveal`/`.stagger`). **Webflow equivalent:** *Scroll into view* interaction.
- **Color-shifting sections** — the page moves through white → cream → stone `#e4ddd0` → charcoal `#2b2b2d` as you scroll (residence, testimonial, CTA, footer are dark; text swaps light/dark). **Webflow equivalent:** colored section blocks (optionally animate background color while scrolling). No code.

Note: parallax uses `requestAnimationFrame`, which browsers pause for a backgrounded tab — it animates for a real visitor with the tab in focus.

## Logo
PDC's real phoenix logo, pulled from their Wix CDN: **`logo-light.png`** (gold/red phoenix + white wordmark, transparent — used over the hero and in the footer) and **`logo-dark.png`** (charcoal crest — used in the header once scrolled onto white). The header swaps between them on scroll.

## Content sources
- **Brand facts, slogan, services, phone, email, testimonial** — pulled from pdcbuilders.com and public listings.
  - Owner: **Joe Mellone**. Phone **(609) 709-7836**. Email **Joem@pdcbuilders.com**.
  - Services: New Home Construction, Renovations/Additions, House Raising, Custom Modular Homes (Westchester Modular).
  - Service area: Manahawkin, Long Beach Island, Long Beach Township, Ocean County.
  - Testimonial: Marion Onello Romano.
- **Photography** — real PDC build at **227 3rd Street, Beach Haven, NJ** (Google Drive), pulled at ~1600px via Drive's public thumbnail endpoint and optimized for web. Photo credit: Oak Leaf Media.

## To finish before launch
1. **Confirm phone number.** Site uses **(609) 709-7836** (from pdcbuilders.com). A data-broker listing also shows **(609) 212-4544** — verify which is current for the button/`tel:` links (appears in `index.html` header nav CTA is text-only; live numbers are in the Contact section and footer, plus the JSON-LD schema).
2. **Confirm mailing address.** Site shows city-level **Manahawkin, NJ 08050** only. A listing shows **18 Indian Rd, Ste 2** — add the exact street address (Contact section + footer + JSON-LD) if you want it public for local SEO.
3. **Wire the contact form.** It's a front-end demo (`#quote-form` in `main.js`). Connect to Formspree, Netlify Forms, or a mailto/CRM before go-live.
4. **License #.** NJ Home Improvement Contractor / builder registration number isn't shown — add it to the footer if available (often required on NJ contractor materials).
5. Optional: add social links, more project galleries (the Drive folder holds the full 227 3rd St set + a walkthrough video), and a real logo if PDC has one (currently a lightweight SVG roofline mark).
