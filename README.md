# Steve's Towing Website

Marketing website for Steve's Towing, a family-owned towing and roadside assistance company serving Southwest Florida (Port Charlotte, Punta Gorda, North Port, and surrounding areas).

Static HTML/CSS/JS — no framework, no build step, no dependencies. Every page is a hand-written `.html` file that links a single shared stylesheet and script.

## Structure

```
index.html              Homepage (hero, awards, services overview, service areas, testimonials, CTA)
aboutus.html            Company story, history, awards
services.html           Services overview / hub page
contact.html            Contact form (currently a bare unstyled stub — see Known issues)

services/               One page per service, linked from the nav dropdown
  1towing.html
  2cashforjunk.html
  3lockouts.html
  4privatepropertytowing.html
  5shedandtoolbox.html
  6roadsideassistance.html

serviceareas/            One page per service area, linked from the nav dropdown
  1puntagorda.html
  2portcharlotte.html
  3northport.html

css/style.css            Single shared stylesheet (includes the CSS reset, merged and minified)
js/main.js               Sticky header, mobile nav, dropdown menus, badge lightbox modal

img/                      Photos used across the site
badges/                   Award/recognition badge images
payment-icons/            Card logos shown in the footer
icons/, src/              Currently empty — unused leftovers from scaffolding
```

Every page shares the same `<header>`/nav markup and `<footer>` markup, copy-pasted per file (there's no templating or includes system — edits to the header/footer/nav need to be repeated across every `.html` file).

## Running locally

No build step — open any `.html` file directly in a browser, or serve the folder with any static file server, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000/index.html`.

## Deployment

Hosted on GitHub Pages, served from `main`. Note: GitHub Pages sets its own `Cache-Control` headers and does not honor `.htaccess` or a `_headers` file — cache lifetimes can't be tuned from within this repo unless the site moves behind Cloudflare or to a host like Netlify/Vercel.

## Known issues

- **`contact.html`** has no styling, header, nav, or footer, and its `<form>` has no `action`/backend — it's an unfinished stub, not a live contact page.
- **`serviceareas/1puntagorda.html`, `2portcharlotte.html`, `3northport.html`** each reference a local photo (`punta-gorda.jpg`, `port-charlotte.jpg`, `north-port.jpg`) that was never added to `img/` — those images currently render broken.
- **`js/navigation.js`** is dead code from an earlier prototype (targets a `.hamburger` class that no longer exists) and isn't linked from any page; `js/main.js` is what actually runs.
- **`icons/`** and **`src/`** are empty directories left over from initial scaffolding.

## Images

Photographic assets are served as WebP (smaller than PNG/JPEG at equivalent quality). Decorative SVGs (logo, favicon, wave dividers) stay as SVG.
