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

  /* -------------------- 0. Internationalisation -------------------- */
  var T = {
    fr: {
      'nav.shop': 'Boutique', 'nav.about': 'À propos', 'nav.alert': 'Alerte drop',
      'nav.alert.mobile': "Recevoir l'alerte drop",
      'rail.hero': 'Accueil', 'rail.drop': 'Drop', 'rail.products': 'Produits',
      'rail.lookbook': 'Lookbook', 'rail.story': 'Histoire',
      'hero.lead': "Basics oversize, énergie graphique affirmée, construits autour d'un petit emblème poitrine et une identité dos floue.",
      'hero.cta.shop': 'Voir le Drop 01', 'hero.cta.lookbook': 'Voir le Lookbook',
      'float.line': 'T-shirt oversize', 'float.muted': 'Print bleu & rose · Première édition limitée',
      'drop.title': 'Une première capsule, construite avec intention.',
      'drop.lead': "Une première collection d'essentiels oversize conçus avec intention, proportion et contraste graphique.",
      'drop.fit.title': 'Coupe oversize', 'drop.fit.desc': 'Coton doux, épaules tombantes, liberté de mouvement.',
      'drop.chest.title': 'Emblème poitrine', 'drop.chest.desc': 'Un discret marquage bleu sur le côté gauche de la poitrine.',
      'drop.back.title': 'Print dos flou', 'drop.back.desc': 'Le grand graphique ZOYA, adouci et aérographié.',
      'cat.title': 'Voir par catégorie', 'cat.lead': 'Le studio commence avec des tees. La structure est faite pour grandir.',
      'cat.available': 'Disponible maintenant', 'cat.tshirt.desc': 'Le premier essentiel Zoya Studio.',
      'cat.soon': 'Bientôt disponible', 'cat.hoodies.desc': 'Prochaines pièces plus lourdes.',
      'cat.acc.desc': 'Petits objets graphiques à venir.', 'cat.future.desc': 'Nouvelles pièces, même intention.',
      'products.title': 'La boutique', 'products.lead': 'Deux pièces. Une identité. Survolez une carte pour voir le dos.',
      'filter.all': 'Tout',
      'lookbook.lead': 'Un devant discret. Un dos flou. Un premier uniforme pour maintenant.',
      'look.blue.front': '<strong>Print bleu</strong> — face.', 'look.blue.back': '<strong>Print bleu</strong> — dos.',
      'look.pink.front': '<strong>Print rose</strong> — face.', 'look.pink.back': '<strong>Print rose</strong> — dos.',
      'story.title': 'Construit au-delà du cadre',
      'story.body': "La forme suit l'intention pure. Chaque détail appartient à une structure plus grande. Zoya Studio commence avec des essentiels conçus pour exister au-delà du cadre.",
      'alert.title': 'Sois le premier à savoir quand le Drop 01 ouvre.',
      'alert.lead': "Pas de spam. Juste l'alerte, au moment où ça tombe.",
      'alert.btn': 'Alerte drop', 'alert.success': 'Merci — tu es sur la liste pour le Drop 01.',
      'footer.legal': 'Mentions légales', 'footer.shipping': 'Livraison', 'footer.returns': 'Retours',
      'modal.note': 'Drop 01 — première édition limitée.',
      'modal.add': 'Ajouter au panier', 'modal.notify': "M'alerter",
      'card.soon': 'Bientôt', 'card.view': 'Voir le produit', 'card.notify': "M'alerter"
    },
    en: {
      'nav.shop': 'Shop', 'nav.about': 'About', 'nav.alert': 'Drop alert',
      'nav.alert.mobile': 'Get the drop alert',
      'rail.hero': 'Hero', 'rail.drop': 'Drop', 'rail.products': 'Products',
      'rail.lookbook': 'Lookbook', 'rail.story': 'Story',
      'hero.lead': 'Soft basics, bold graphic energy, built around a quiet chest mark and a blurred back identity.',
      'hero.cta.shop': 'Shop Drop 01', 'hero.cta.lookbook': 'View Lookbook',
      'float.line': 'Oversized tee', 'float.muted': 'Blue & Pink print · Limited first release',
      'drop.title': 'A first capsule, built with intention.',
      'drop.lead': 'A first release of oversized essentials designed with intention, proportion and graphic contrast.',
      'drop.fit.title': 'Oversized fit', 'drop.fit.desc': 'Soft cotton, dropped shoulders, room to move.',
      'drop.chest.title': 'Chest emblem', 'drop.chest.desc': 'A quiet blue mark on the left chest.',
      'drop.back.title': 'Blurred back print', 'drop.back.desc': 'The large ZOYA graphic, softened and airbrushed.',
      'cat.title': 'Shop by category', 'cat.lead': 'The studio starts with tees. The structure is built to grow.',
      'cat.available': 'Available now', 'cat.tshirt.desc': 'The first Zoya Studio essential.',
      'cat.soon': 'Coming soon', 'cat.hoodies.desc': 'Future heavier shapes.',
      'cat.acc.desc': 'Small graphic objects coming later.', 'cat.future.desc': 'New pieces, same intention.',
      'products.title': 'Shop the drop', 'products.lead': 'Two pieces. One identity. Hover a card to flip front and back.',
      'filter.all': 'All',
      'lookbook.lead': 'A quiet front. A blurred back. A first uniform for now.',
      'look.blue.front': '<strong>Blue print</strong> — front.', 'look.blue.back': '<strong>Blue print</strong> — back.',
      'look.pink.front': '<strong>Pink print</strong> — front.', 'look.pink.back': '<strong>Pink print</strong> — back.',
      'story.title': 'Built beyond the frame',
      'story.body': 'Form follows pure intention. Every single detail belongs to a larger structure. Zoya Studio begins with essentials made to exist beyond the frame.',
      'alert.title': 'Be first to know when Drop 01 opens.',
      'alert.lead': 'No spam. Just the drop, the moment it goes live.',
      'alert.btn': 'Drop alert', 'alert.success': "Thanks — you're on the list for Drop 01.",
      'footer.legal': 'Legal', 'footer.shipping': 'Shipping', 'footer.returns': 'Returns',
      'modal.note': 'Drop 01 — limited first release.',
      'modal.add': 'Add to cart', 'modal.notify': 'Notify me',
      'card.soon': 'Coming soon', 'card.view': 'View product', 'card.notify': 'Notify me'
    }
  };
  var currentLang = 'fr';
  var currentFilter = 'all';

  /* -------------------- 2. Product rendering -------------------- */
  var products = window.ZOYA_PRODUCTS || [];
  var grid = $("[data-product-grid]");

  function priceLabel(p) {
    return p.price ? p.price : T[currentLang]['card.soon'];
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
          (soldSoon ? T[currentLang]['card.notify'] : T[currentLang]['card.view']) +
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
    currentFilter = filter || 'all';
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

    // Build image gallery (front + back if available).
    var galleryImgs = [{ src: p.images.front, label: frontFile(p), alt: p.name + " — face" }];
    if (p.images && p.images.back) {
      galleryImgs.push({ src: p.images.back, label: backFile(p), alt: p.name + " — dos" });
    }
    var galleryIdx = 0;
    var mediaWrap = $("[data-modal-media]", modal);
    var img = $("[data-modal-img]", modal);
    var dotsWrap = $("[data-gallery-dots]", modal);
    var prevBtn = $("[data-gallery-prev]", modal);
    var nextBtn = $("[data-gallery-next]", modal);

    function showGalleryImg(idx) {
      galleryIdx = idx;
      var entry = galleryImgs[idx];
      mediaWrap.classList.remove("is-missing");
      mediaWrap.setAttribute("data-label", entry.label);
      img.onerror = function () { mediaWrap.classList.add("is-missing"); };
      img.src = entry.src;
      img.alt = entry.alt;
      $$("[data-gallery-dot]", modal).forEach(function (d, i) {
        d.classList.toggle("is-active", i === idx);
      });
    }

    var hasMultiple = galleryImgs.length > 1;
    dotsWrap.innerHTML = galleryImgs.map(function (_, i) {
      return '<button class="modal__dot' + (i === 0 ? " is-active" : "") + '" data-gallery-dot aria-label="Photo ' + (i + 1) + '"></button>';
    }).join("");
    dotsWrap.hidden = !hasMultiple;
    if (prevBtn) prevBtn.hidden = !hasMultiple;
    if (nextBtn) nextBtn.hidden = !hasMultiple;

    $$("[data-gallery-dot]", modal).forEach(function (dot, i) {
      dot.onclick = function () { showGalleryImg(i); };
    });
    if (prevBtn) prevBtn.onclick = function () { showGalleryImg((galleryIdx - 1 + galleryImgs.length) % galleryImgs.length); };
    if (nextBtn) nextBtn.onclick = function () { showGalleryImg((galleryIdx + 1) % galleryImgs.length); };

    showGalleryImg(0);

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
      cta.textContent = T[currentLang]['modal.add'];
      cta.setAttribute("href", p.checkoutUrl);
    } else {
      cta.textContent = T[currentLang]['modal.notify'];
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
      if (status) status.textContent = T[currentLang]['alert.success'];
      // The native mailto action still fires; remove it once a backend is wired.
    });
  }

  /* -------------------- 10. Misc -------------------- */
  // Hero entrance: flag the section so the CSS can settle the image scale.
  var hero = $(".hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("is-ready"); });

  var yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------- 11. Language switcher -------------------- */
  function switchLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem('zoya-lang', lang); } catch (e) {}
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (T[lang][key] !== undefined) el.textContent = T[lang][key];
    });
    $$('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (T[lang][key] !== undefined) el.innerHTML = T[lang][key];
    });
    $$('[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
    renderProducts(currentFilter);
  }
  $$('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { switchLang(btn.getAttribute('data-lang')); });
  });

  /* -------------------- Boot -------------------- */
  observeReveals($$("[data-reveal]"));
  onScroll();
  var _initLang = null;
  try { _initLang = localStorage.getItem('zoya-lang'); } catch (e) {}
  switchLang(_initLang === 'en' ? 'en' : 'fr');
})();
