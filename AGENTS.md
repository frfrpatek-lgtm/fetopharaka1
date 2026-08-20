# AGENTS.md

## Project

Static marketing website for Fetop Haraka Limited (branded garments/corporate
wear supplier, Nairobi, Kenya). Plain HTML/CSS/JS — deliberately no framework
and no build step, so the CMS-editable content and the deployed site are the
same files.

## Architecture

- Four pages: `index.html`, `about.html`, `products.html`, `contact.html`.
  Each page repeats the same nav/footer/WhatsApp-popup markup inline (no
  templating layer exists) — when editing shared chrome (nav links, footer
  columns, WhatsApp popup copy), update it in all four files.
- `css/styles.css` is the single stylesheet for the whole site, organized in
  commented sections (nav, hero, cards, footer, WhatsApp popup, etc.).
- `js/main.js` handles all interactive behavior: navbar shrink-on-scroll,
  mobile hamburger menu, scroll-reveal via IntersectionObserver, animated stat
  counters, product category filter, WhatsApp popup session logic, and
  contact form validation/AJAX submit.
- `js/render.js` fetches `content/products.json` and `content/testimonials.json`
  at runtime and renders product/testimonial cards into `#home-products-grid`,
  `#products-grid` and `#testimonials-grid`. After rendering the full products
  grid it calls `window.__reinitProductFilter()` (exposed by `main.js`) so the
  category filter buttons work on freshly-injected cards.
- `content/products.json` and `content/testimonials.json` are the CMS-managed
  data files (edited via Decap CMS "files" collections in `admin/config.yml`,
  each holding a single `list` field). This avoids needing a folder-collection
  file listing, which would require a build step or a serverless function to
  enumerate — deliberately avoided to keep the site buildless.
- `admin/config.yml` also has a `site_media` files-collection used purely to
  document/upload the logo, hero and about images. Because those images are
  referenced by fixed paths in HTML (`/images/logo/logo.png`,
  `/images/hero/hero.jpg`, `/images/about/about.jpg`), editors must rename the
  uploaded file to match before uploading — there's no server-side rename step.
- Image fallbacks: any `<img data-fallback>` paired with a sibling
  `[data-fallback-target]` element is wired up by `initImageFallbacks()` in
  `main.js` to swap to a text/icon fallback on load error. Product card images
  (rendered dynamically) use inline `onload`/`onerror` handlers instead, since
  they're generated as HTML strings in `render.js`.

## Conventions

- No build tooling — do not introduce a bundler, npm scripts, or a static
  site generator. Any new page must copy the existing nav/footer/popup
  markup pattern rather than introducing a templating dependency.
- Keep price fields blank by default in `content/products.json` — pricing is
  filled in manually by the client via the CMS.
- Netlify Forms: `contact.html`'s form has `data-netlify="true"` and a
  `bot-field` honeypot; it's detected at Netlify's build time directly from
  the static HTML (no JS-only form skeleton needed, since this isn't an SPA).
- Netlify Identity + Git Gateway must remain enabled for `/admin` to
  authenticate (`.netlify/features/netlify-identity` marker + this repo's use
  of `backend: git-gateway` in `admin/config.yml`).
