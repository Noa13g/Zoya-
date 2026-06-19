# Zoya Studio — Drop 01

A static, premium landing page / mini-shop for the **Zoya Studio** clothing brand.
Built with plain **HTML + CSS + JavaScript** — no build step, no framework, no backend —
so it runs directly on **GitHub Pages** and is easy to migrate later to Shopify, Webflow or Squarespace.

The interface uses a **liquid-glass / glassmorphism** design language with floating navigation,
a desktop section rail, scroll-reveal animations and a product modal.

---

## Project structure

```
.
├── index.html              # The whole page (one file, sections clearly commented)
├── assets/
│   ├── css/styles.css      # Design system + all styles (variables at the top)
│   ├── js/products.js      # The catalogue — edit products here
│   ├── js/main.js          # Interactions: menu, reveals, modal, filters
│   └── img/                # Your photos go here (see naming below)
│       └── source/         # Optional: drop raw/unedited files here first
└── README.md
```

---

## Run it locally

Either just **double-click `index.html`**, or serve it (recommended, so paths resolve cleanly):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the **`main`** branch and the **`/ (root)`** folder, then **Save**.
5. Wait ~1 minute. Your site is live at `https://<user>.github.io/<repo>/`.

A `.nojekyll` file is included so GitHub serves the files as-is.

---

## Adding your images

Drop photos into `assets/img/` using these names. **Missing files don't break the page** —
each one falls back to an elegant labelled placeholder, so you can publish first and add photos later.

| File name | Used for |
| --- | --- |
| `zoya-hero-01.jpg` | Hero background (model, front or back) |
| `zoya-model-front-blue.jpg` | Lookbook — model, front, blue tee |
| `zoya-model-back-blue.jpg` | Lookbook — model, back, blue tee |
| `zoya-flat-back-blue.jpg` | Lookbook — flat lay, back |
| `product-front-blue.jpg` | Blue tee card — front |
| `product-back-blue.jpg` | Blue tee card — back (hover flip) |
| `product-front-pink.jpg` | Pink tee card — front |
| `product-back-pink.jpg` | Pink tee card — back (hover flip) |
| `zoya-logo-blue.svg` | Brand logo (a vector placeholder is already included) |

**Tip:** export images as optimised **WebP or JPG** (long edge ~1600–2000px) to keep the page fast on mobile.
Keep originals in `assets/img/source/` if you like; only the names above are referenced by the site.

---

## Editing content

- **Brand text** (hero, drop, manifesto, footer): edit directly in `index.html` — sections are labelled with comments.
- **Products**: edit `assets/js/products.js`. To add a product, copy one object in the `PRODUCTS` array.
  - `price: null` → the card shows **"Coming soon"**.
  - `status: "soon"` → the buy button is disabled (**"Notify me"**).
  - `status: "available"` + `checkoutUrl: "https://..."` → wires a real checkout link. Nothing else changes.
- **Categories**: edit the `category-card` blocks in `index.html` (`Shop by category` section).
- **Colours / spacing / motion**: edit the CSS variables in `:root` at the top of `assets/css/styles.css`.

---

## Animations and liquid-glass system

- **Glass classes** — reusable in `styles.css`:
  - `.glass-panel` — the core translucent panel (blur + reflection highlight). Falls back to a more
    opaque background when `backdrop-filter` isn't supported, so text stays readable.
  - `.glass-overlay` — dimmed glass behind the product modal.
  - `.liquid-nav`, `.side-rail`, `.bottom-glass-nav`, `.floating-card` — the navigation + floating pieces.
- **Scroll reveals** — any element with `data-reveal` fades/slides in via `IntersectionObserver`
  (`main.js`, section 7). Add `data-reveal-delay="1..4"` to stagger.
- **Section nav** — the desktop side rail and mobile bottom nav highlight the section in view.
- **Product hover** — cards flip front → back image on hover (desktop) when a back image exists.

### Reducing or disabling animations

The site fully respects **`prefers-reduced-motion`**: when a visitor has that OS setting on,
all large movements are switched off and content shows immediately. To force a calmer site for
everyone, you can lower the `--duration-*` variables in `:root` or remove the `data-reveal`
attributes in `index.html`.

---

## Connecting a newsletter / drop alert later

The **Drop alert** form currently falls back to a `mailto:` action (`hello@zoyastudio.fr` — change it
in `index.html`). To connect a real provider (**Mailchimp, Brevo, Klaviyo, Tally, Formspree**, …),
see `handleDropAlert` notes in `assets/js/main.js` (section 9): replace the handler body with a
`fetch()` POST to your endpoint and keep the success message.

---

## Roadmap-friendly by design

Content is separated (text in HTML, catalogue in `products.js`, styling in `styles.css`) so the site
can grow into individual product pages, a full lookbook, an email integration and an external checkout
without rebuilding the visual layer.

© Zoya Studio. Designed in France.
