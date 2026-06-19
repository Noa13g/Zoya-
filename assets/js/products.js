/* ============================================================
   RIVA STUDIO — products.js
   Single source of truth for the catalogue.

   HOW TO ADD A PRODUCT
   --------------------
   Copy one object in the PRODUCTS array below and edit the fields.
   Only filled-in fields are rendered, so partial data is safe:
     - price: null            -> the card shows "Coming soon"
     - status: "soon"         -> the buy button is disabled ("Notify me")
     - status: "available"    -> the buy button is active
     - images.back: null      -> the hover flip is skipped
     - checkoutUrl: "https://..."  -> wire a Shopify / Stripe link here later;
                                       nothing else needs to change.

   Images live in assets/img/. If a file is missing, the card shows a
   labelled placeholder automatically (no broken image icon).
   ============================================================ */

window.RIVA_PRODUCTS = [
  {
    id: "riva-tee-blue",
    name: "RIVA T-Shirt — Blue Print",
    category: "tshirts",
    colorName: "Blue print",
    colorHex: "#0057ff",
    badge: "First release",
    status: "soon",            // "available" once the drop opens
    price: null,               // e.g. "€45" — leave null for "Coming soon"
    checkoutUrl: null,         // e.g. "https://shop.rivastudio.fr/..." for a real checkout
    images: {
      front: "assets/img/product-front-blue.jpg",
      back: "assets/img/product-back-blue.jpg"
    },
    description:
      "Oversized white tee with a small blue chest emblem and a blurred RIVA back print.",
    tags: ["Oversized fit", "Drop 01", "Blue print"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: "riva-tee-pink",
    name: "RIVA T-Shirt — Pink Print",
    category: "tshirts",
    colorName: "Pink print",
    colorHex: "#ee7cab",
    badge: "Color variation",
    status: "soon",
    price: null,
    checkoutUrl: null,
    images: {
      front: "assets/img/product-front-pink.jpg",
      back: "assets/img/product-back-pink.jpg"
    },
    description:
      "Oversized white tee with a pink variation of the RIVA graphic identity.",
    tags: ["Oversized fit", "Drop 01", "Pink print"],
    availableSizes: ["S", "M", "L", "XL"]
  }
];
