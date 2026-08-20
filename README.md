# Fetop Haraka Limited — Website

A premium, fully responsive marketing website for **Fetop Haraka Limited**, a
branded garments and corporate wear supplier based in Nairobi, Kenya. The site
is built as static HTML/CSS/JS (no framework, no build step) so every page,
style and script can be edited directly, and all day-to-day content (products,
testimonials, logo, hero image, about photo) is managed through a Netlify CMS
(Decap CMS) dashboard at `/admin`.

## Key technologies

- **Plain HTML5, CSS3 and vanilla JavaScript** — no bundler or framework, so
  the deployed files are exactly the files in this repo.
- **Decap CMS** (`admin/index.html` + `admin/config.yml`) for content editing,
  authenticated with **Netlify Identity** + **Git Gateway**.
- **Netlify Forms** for the contact form (`contact.html`), with client-side
  validation in `js/main.js`.
- **Google Fonts** (Montserrat + Lato) and **Font Awesome** for icons.
- Content that editors manage lives in JSON files under `content/` and is
  fetched client-side by `js/render.js` — editing it via `/admin` and
  publishing updates the live site with no code changes.

## Project structure

```
index.html, about.html, products.html, contact.html   Pages
css/styles.css                                          All styles
js/main.js                                              Nav, menus, reveal animations, counters, filters, WhatsApp popup, form validation
js/render.js                                             Renders products/testimonials from content/*.json
content/products.json                                    Editable product list (CMS-managed)
content/testimonials.json                                Editable testimonials (CMS-managed)
images/logo, images/hero, images/about, images/products  Upload targets for the CMS media library
admin/index.html, admin/config.yml                       Decap CMS dashboard
netlify.toml                                              Netlify config
```

## Running locally

No build step is required. From the project root:

```bash
netlify dev --port 8889
```

This serves the static files and emulates Netlify Identity, Git Gateway and
Forms locally. Visiting `/admin` locally will prompt for Netlify Identity
login once Identity/Git Gateway are enabled on the linked site.

## Managing content

Log in at `https://www.fetop.co.ke/admin` with an email/password Netlify
Identity account (invited from the Netlify dashboard under
**Project configuration → Identity**, with **Git Gateway** enabled).

From the dashboard you can:

- Edit product names, descriptions and prices, and upload product photos.
- Add, edit or delete client testimonials.
- Replace the logo, homepage hero image and About page photo (rename the file
  to `logo.png`, `hero.jpg` or `about.jpg` respectively before uploading, so it
  matches the fixed path referenced in the site's HTML).

Every save publishes directly to the live site — no code changes needed.
