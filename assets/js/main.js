/* ============================================================
   ZOYA STUDIO — main.js
   All interactions for the static site. No dependencies.

   Sections:
     1. Helpers
     2. Product rendering (from window.ZOYA_PRODUCTS)
     3. Product modal
     4. Category filter pills
     5. Header: scroll state + progress bar
     6. Mobile menu
     7. Scroll reveal (IntersectionObserver)
     8. Section nav: active state for side rail + bottom nav
     9. Cart placeholder + drop-alert form
    10. Misc (hero entrance, year)

   To tune animation feel, edit the CSS variables in styles.css
   (--duration-*, --ease-out). To slow / speed reveals, change the
   IntersectionObserver threshold in section 7.
   ============================================================ */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* -------------------- 2. Product rendering -------------------- */
  var products = window.ZOYA_PRODUCTS || [];
  var grid = $("[data-product-grid]");

  function priceLabel(p) {
    return p.price ? p.price : "Coming soon";
  }

  function buildCard(p) {
    var card = document.createElement("article");
    card.className = "product-card reveal";
    card.setAttribute("data-reveal", "");
    card.setAttribute("data-product-id", p.id);
    card.setAttribute("data-status", p.status);
    if (p.price) card.setAttribute("data-price", p.price);

    var hasBack = p.images && p.images.back;
    var soldSoon = p.status !== "available";

    // Media (front + optional back for the hover flip).
    var media =
      '<div class="product-card__media" data-open-product>' +
        (p.badge ? '<span class="product-card__badge product-card__badge--first">' + p.badge + "</span>" : "") +
        '<div class="media media--front" data-media data-label="' + frontFile(p) + '">' +
          '<img src="' + p.images.front + '" alt="' + p.name + ' — front" loading="lazy" onerror="this.closest(\'[data-media]\').classList.add(\'is-missing\')" />' +
        "</div>" +
        (hasBack
          ? '<div class="media media--back" data-media data-label="' + backFile(p) + '">' +
              '<img src="' + p.images.back + '" alt="' + p.name + ' — back" loading="lazy" onerror="this.closest(\'[data-media]\').classList.add(\'is-missing\')" />' +
            "</div>"
          : "") +
      "</div>";

    var body =
      '<div class="product-card__body">' +
        '<h3 class="product-card__name">' + p.name + "</h3>" +
        '<div class="product-card__meta">' +
          '<span class="product-card__color"><span class="product-card__swatch" style="background:' + (p.colorHex || "#ccc") + '"></span>' + (p.colorName || "") + "</span>" +
        "</div>" +
        '<p class="product-card__price ' + (p.price ? "" : "product-card__price--soon") + '">' + priceLabel(p) + "</p>" +
        '<button class="product-card__cta" type="button" data-open-product ' + (soldSoon ? 'data-soon="true"' : "") + ">" +
          (soldSoon ? "Notify me" : "View product") +
          ' <span class="arrow" aria-hidden="true">→</span>' +
        "</button>" +
      "</div>";

    card.innerHTML = media + body;
    return card;
  }

  // Derive a friendly placeholder label from the configured path.
  function frontFile(p) { return fileName(p.images.front); }
  function backFile(p) { return fileName(p.images.back); }
  function fileName(path) { return path ? path.split("/").pop() : "image"; }

  function renderProducts(filter) {
    if (!grid) return;
    grid.innerHTML = "";
    products
      .filter(function (p) { return !filter || filter === "all" || p.category === filter; })
      .forEach(function (p) { grid.appendChild(buildCard(p)); });
    // Newly injected cards need to be observed for the reveal animation.
    observeReveals($$("[data-reveal]", grid));
    bindProductOpeners();
  }

  /* -------------------- 3. Product modal -------------------- */
  var modal = $("[data-modal]");
  var lastFocused = null;

  function openProduct(id) {
    var p = products.filter(function (x) { return x.id === id; })[0];
    if (!p || !modal) return;
    lastFocused = document.activeElement;

    var mediaWrap = $("[data-modal-media]", modal);
    mediaWrap.classList.remove("is-missing");
    mediaWrap.setAttribute("data-label", frontFile(p));
    var img = $("[data-modal-img]", modal);
    img.onerror = function () { mediaWrap.classList.add("is-missing"); };
    img.src = p.images.front;
    img.alt = p.name;

    $("[data-modal-badge]", modal).textContent = p.badge || "Drop 01";
    $("[data-modal-name]", modal).textContent = p.name;
    $("[data-modal-price]", modal).textContent = priceLabel(p);
    $("[data-modal-desc]", modal).textContent = p.description || "";

    $("[data-modal-tags]", modal).innerHTML = (p.tags || [])
      .map(function (t) { return "<li>" + t + "</li>"; }).join("");
    $("[data-modal-sizes]", modal).innerHTML = (p.availableSizes || [])
      .map(function (s) { return '<span class="modal__size">' + s + "</span>"; }).join("");

    var cta = $("[data-modal-cta]", modal);
    if (p.status === "available" && p.checkoutUrl) {
      cta.textContent = "Add to cart";
      cta.setAttribute("href", p.checkoutUrl);
    } else {
      cta.textContent = "Notify me";
      cta.setAttribute("href", "#drop-alert");
    }

    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    $("[data-modal-close]", modal).focus();
  }

  function closeProduct() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    var done = function () {
      modal.hidden = true;
      modal.removeEventListener("transitionend", done);
      if (lastFocused) lastFocused.focus();
    };
    if (prefersReducedMotion) { done(); }
    else { modal.addEventListener("transitionend", done); }
  }

  function bindProductOpeners() {
    $$("[data-open-product]").forEach(function (el) {
      if (el.__bound) return;
      el.__bound = true;
      el.addEventListener("click", function () {
        var card = el.closest("[data-product-id]");
        if (card) openProduct(card.getAttribute("data-product-id"));
      });
    });
  }

  if (modal) {
    $$("[data-modal-close]", modal).forEach(function (el) {
      el.addEventListener("click", closeProduct);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeProduct();
    });
  }

  /* -------------------- 4. Category filter pills -------------------- */
  $$("[data-filter]").forEach(function (pill) {
    pill.addEventListener("click", function () {
      $$("[data-filter]").forEach(function (p) {
        p.classList.remove("is-active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("is-active");
      pill.setAttribute("aria-selected", "true");

      var filter = pill.getAttribute("data-filter");
      if (prefersReducedMotion) { renderProducts(filter); return; }
      // Soft fade-out, swap, fade-in.
      grid.classList.add("is-switching");
      window.setTimeout(function () {
        renderProducts(filter);
        grid.classList.remove("is-switching");
      }, 220);
    });
  });

  /* -------------------- 5. Header scroll state + progress -------------------- */
  var header = $("[data-header]");
  var progress = $("[data-scroll-progress]");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -------------------- 6. Mobile menu -------------------- */
  var menu = $("[data-menu]");
  var menuToggle = $("[data-menu-toggle]");

  function setMenu(open) {
    if (!menu || !menuToggle) return;
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("is-open"); });
    } else {
      menu.classList.remove("is-open");
      window.setTimeout(function () { menu.hidden = true; }, prefersReducedMotion ? 0 : 300);
    }
    menuToggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("is-menu-open", open);
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
  }
  $$("[data-menu-link]").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  /* -------------------- 7. Scroll reveal -------------------- */
  var revealObserver = null;
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  }
  function observeReveals(nodes) {
    nodes.forEach(function (n) {
      if (revealObserver) revealObserver.observe(n);
      else n.classList.add("is-visible"); // reduced motion / no IO: show immediately
    });
  }

  /* -------------------- 8. Section nav active state -------------------- */
  var railLinks = $$("[data-rail-link]");
  var sectionIds = railLinks.map(function (l) { return l.getAttribute("href"); });
  var sections = sectionIds
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = "#" + entry.target.id;
          railLinks.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === id);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* -------------------- 9. Cart placeholder + drop alert -------------------- */
  var cartBtn = $("[data-cart]");
  if (cartBtn) {
    cartBtn.addEventListener("click", function () {
      // No real cart in V1 — nudge people to the drop alert.
      var target = document.querySelector("#drop-alert");
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /*
   * Drop-alert form.
   * Right now this falls back to the mailto action set in the HTML.
   * To connect a real provider later (Mailchimp / Brevo / Klaviyo / Formspree),
   * replace the body of this handler with a fetch() POST to your endpoint
   * and keep the success message below.
   */
  var alertForm = $("[data-drop-alert]");
  if (alertForm) {
    alertForm.addEventListener("submit", function () {
      var status = $("[data-alert-status]", alertForm);
      if (status) status.textContent = "Thanks — you're on the list for Drop 01.";
      // The native mailto action still fires; remove it once a backend is wired.
    });
  }

  /* -------------------- 10. Misc -------------------- */
  // Hero entrance: flag the section so the CSS can settle the image scale.
  var hero = $(".hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("is-ready"); });

  var yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------- Boot -------------------- */
  renderProducts("all");
  observeReveals($$("[data-reveal]"));
  onScroll();
})();
