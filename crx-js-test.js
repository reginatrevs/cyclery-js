document.addEventListener("DOMContentLoaded", function () {
  crxInitRequestModal();
  crxInitHomeBikes();
  crxInitHomeBikeAltA();
  crxInitHomeBikeAltB();
});

/* ───────────────────────────────────────────────────
   1. REQUEST-A-BIKE MODAL  (unchanged)
   Mount: <div class="crx-rqnl-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitRequestModal() {
  const mount = document.querySelector(".crx-rqnl-mount");
  if (!mount) return;

  const NETLIFY_SITE_URL = "https://cyclery-request-form.netlify.app";

  const productTitle = (document.querySelector("h1")?.textContent || "").trim();
  const pageUrl = window.location.href;

  mount.innerHTML = `
    <section class="crx-rqnl">
      <button type="button" class="crx-rqnl__open">Request this bike</button>

      <div class="crx-rqnl__modal" aria-hidden="true">
        <div class="crx-rqnl__backdrop" data-crx-close></div>
        <div class="crx-rqnl__panel" role="dialog" aria-modal="true" aria-label="Request a bike">
          <div class="crx-rqnl__head">
            <div>
              <div class="crx-rqnl__kicker">Custom build request</div>
              <h2 class="crx-rqnl__title">Request a bike</h2>
            </div>
            <button type="button" class="crx-rqnl__x" data-crx-close aria-label="Close">×</button>
          </div>

          <iframe class="crx-rqnl__frame" name="crx-rqnl-target" title="hidden submit" aria-hidden="true"></iframe>

          <form class="crx-rqnl__form"
                method="POST"
                action="${NETLIFY_SITE_URL}/"
                target="crx-rqnl-target">
            <input type="hidden" name="form-name" value="crx-bike-request">
            <input type="hidden" name="page_url" value="${escapeHtml(pageUrl)}">
            <input type="hidden" name="product" value="${escapeHtml(productTitle)}">

            <p class="crx-rqnl__hp">
              <label>Don't fill this out: <input name="bot-field"></label>
            </p>

            <label class="crx-rqnl__field">
              <span>Name</span>
              <input name="name" type="text" required>
            </label>

            <label class="crx-rqnl__field">
              <span>Email</span>
              <input name="email" type="email" required>
            </label>

            <label class="crx-rqnl__field">
              <span>Phone (optional)</span>
              <input name="phone" type="tel">
            </label>

            <label class="crx-rqnl__field">
              <span>Brand</span>
              <select name="brand" required>
                <option value="">Select…</option>
                <option>Factor</option>
                <option>ENVE</option>
                <option>TIME</option>
                <option>Look</option>
                <option>Bianchi</option>
                <option>Specialized</option>
                <option>Colnago</option>
                <option>De Rosa</option>
                <option>Scott</option>
                <option>Merckx</option>
                <option>Ridley</option>
              </select>
            </label>

            <label class="crx-rqnl__field">
              <span>Interested in</span>
              <select name="interest" required>
                <option value="">Select…</option>
                <option>Frameset</option>
                <option>Full custom build</option>
                <option>Not sure yet</option>
              </select>
            </label>

            <label class="crx-rqnl__field">
              <span>Notes</span>
              <textarea name="notes" rows="4" placeholder="Size, groupset preference, budget range, timeline…"></textarea>
            </label>

            <button class="crx-rqnl__submit" type="submit">Send request</button>
            <p class="crx-rqnl__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .crx-rqnl{margin:18px 0}
    .crx-rqnl__open{border:1px solid rgba(0,0,0,.18);border-radius:999px;padding:10px 14px;font-weight:800;background:transparent;cursor:pointer}
    .crx-rqnl__modal{position:fixed;inset:0;display:none;z-index:9999}
    .crx-rqnl__modal.crx-rqnl__modal--open{display:block}
    .crx-rqnl__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.45)}
    .crx-rqnl__panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(520px,92vw);
      background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.12);padding:16px}
    .crx-rqnl__head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}
    .crx-rqnl__kicker{font-size:12px;opacity:.7;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
    .crx-rqnl__title{margin:4px 0 0;font-size:18px;line-height:1.2}
    .crx-rqnl__x{border:0;background:transparent;font-size:22px;cursor:pointer;line-height:1}
    .crx-rqnl__form{display:grid;gap:10px}
    .crx-rqnl__field span{display:block;font-weight:800;margin-bottom:6px}
    .crx-rqnl__field input,.crx-rqnl__field textarea,.crx-rqnl__field select{
      width:100%;border:1px solid rgba(0,0,0,.18);border-radius:12px;padding:10px 12px
    }
    .crx-rqnl__submit{border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer;border:1px solid rgba(0,0,0,.18);background:#111;color:#fff}
    .crx-rqnl__status{margin:0;font-weight:800;min-height:1.2em}
    .crx-rqnl__frame{width:0;height:0;border:0;position:absolute;opacity:0}
    .crx-rqnl__hp{display:none}
  `;
  document.head.appendChild(style);

  const openBtn = mount.querySelector(".crx-rqnl__open");
  const modal = mount.querySelector(".crx-rqnl__modal");
  const form = mount.querySelector(".crx-rqnl__form");
  const status = mount.querySelector(".crx-rqnl__status");
  const iframe = mount.querySelector(".crx-rqnl__frame");

  let hasSubmitted = false;
  let ignoreNextIframeLoad = true;

  function open() {
    status.textContent = "";
    ignoreNextIframeLoad = true;
    modal.classList.add("crx-rqnl__modal--open");
    modal.setAttribute("aria-hidden", "false");
  }

  function close() {
    modal.classList.remove("crx-rqnl__modal--open");
    modal.setAttribute("aria-hidden", "true");
  }

  openBtn.addEventListener("click", open);
  mount.addEventListener("click", (e) => { if (e.target.closest("[data-crx-close]")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  form.addEventListener("submit", () => {
    hasSubmitted = true;
    status.textContent = "Sending…";
    ignoreNextIframeLoad = false;
  });

  iframe.addEventListener("load", () => {
    if (ignoreNextIframeLoad) return;
    if (!hasSubmitted) return;

    status.textContent = "Sent ✔";
    form.reset();

    // Auto-close after a short delay, so they can read "Sent"
    setTimeout(() => {
      close();
      status.textContent = "";
    }, 1200);

    hasSubmitted = false;
    ignoreNextIframeLoad = true;
  });

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
}

/* ───────────────────────────────────────────────────
   2. HOMEPAGE BRANDS MARQUEE
   Mount: <div class="crx-homebike-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitHomeBikes() {
  const mount = document.querySelector(".crx-homebike-mount");
  if (!mount) return;

  const brands = [
    { name: "Factor",      slug: "factor" },
    { name: "ENVE",        slug: "enve" },
    { name: "TIME",        slug: "time" },
    { name: "Look",        slug: "look" },
    { name: "Bianchi",     slug: "bianchi" },
    { name: "Specialized", slug: "specialized" },
    { name: "Colnago",     slug: "colnago" },
    { name: "De Rosa",     slug: "de-rosa" },
    { name: "Scott",       slug: "scott" },
    { name: "Merckx",      slug: "merckx" },
    { name: "Ridley",      slug: "ridley" },
  ];

  // Build chip HTML — duplicate the list so the strip is 2x wide for seamless loop
  function chipHTML(brand) {
    return `<a href="/collections/${brand.slug}" class="crx-hb__chip">${brand.name}</a>`;
  }

  const row1Brands = brands;
  const row2Brands = [...brands].reverse();

  const chipsRow1 = row1Brands.map(chipHTML).join("") + row1Brands.map(chipHTML).join("");
  const chipsRow2 = row2Brands.map(chipHTML).join("") + row2Brands.map(chipHTML).join("");

  mount.innerHTML = `
    <section class="crx-hb">
      <div class="crx-hb__header">
        <p class="crx-hb__kicker">Premium brands</p>
        <h2 class="crx-hb__title">High-end bike builds</h2>
        <p class="crx-hb__sub">Hand-built frames from the world's finest manufacturers, fitted and assembled to your exact specification.</p>
      </div>
      <div class="crx-hb__marquee">
        <div class="crx-hb__track crx-hb__track--left">${chipsRow1}</div>
        <div class="crx-hb__track crx-hb__track--right">${chipsRow2}</div>
      </div>
      <div class="crx-hb__cta-wrap">
        <a href="/bike-builds" class="crx-hb__cta">View bike builds &rarr;</a>
      </div>
    </section>
  `;

  // Inject scoped styles
  const style = document.createElement("style");
  style.textContent = `
    /* ── container ── */
    .crx-hb{
      padding:48px 0;
      text-align:center;
      overflow:hidden;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    }

    /* ── header ── */
    .crx-hb__header{max-width:560px;margin:0 auto 32px;padding:0 20px}
    .crx-hb__kicker{
      font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;
      opacity:.55;margin:0 0 6px;
    }
    .crx-hb__title{
      font-size:clamp(22px,4vw,32px);font-weight:900;margin:0 0 10px;line-height:1.15;
    }
    .crx-hb__sub{
      font-size:15px;line-height:1.5;opacity:.7;margin:0;
    }

    /* ── marquee tracks ── */
    .crx-hb__marquee{
      display:flex;flex-direction:column;gap:12px;
      padding:0;
    }
    .crx-hb__track{
      display:flex;gap:10px;width:max-content;
      will-change:transform;
    }
    .crx-hb__track--left{
      animation:crx-hb-scroll-left 40s linear infinite;
    }
    .crx-hb__track--right{
      animation:crx-hb-scroll-right 40s linear infinite;
    }

    @keyframes crx-hb-scroll-left{
      0%{transform:translateX(0)}
      100%{transform:translateX(-50%)}
    }
    @keyframes crx-hb-scroll-right{
      0%{transform:translateX(-50%)}
      100%{transform:translateX(0)}
    }

    /* ── chips ── */
    .crx-hb__chip{
      display:inline-flex;align-items:center;justify-content:center;
      white-space:nowrap;
      padding:10px 22px;
      border:1px solid rgba(0,0,0,.12);
      border-radius:999px;
      font-size:14px;font-weight:700;letter-spacing:.02em;
      color:#111;background:#fff;
      text-decoration:none;
      transition:background .2s,color .2s,border-color .2s;
      cursor:pointer;
      flex-shrink:0;
    }
    .crx-hb__chip:hover{
      background:#111;color:#fff;border-color:#111;
    }

    /* ── CTA ── */
    .crx-hb__cta-wrap{margin-top:32px}
    .crx-hb__cta{
      display:inline-block;
      padding:12px 28px;
      border-radius:999px;
      font-size:14px;font-weight:800;letter-spacing:.02em;
      background:#111;color:#fff;
      text-decoration:none;
      transition:opacity .2s;
    }
    .crx-hb__cta:hover{opacity:.8}

    /* ── pause on hover ── */
    .crx-hb__marquee:hover .crx-hb__track{
      animation-play-state:paused;
    }

    /* ── reduced motion ── */
    @media(prefers-reduced-motion:reduce){
      .crx-hb__track--left,
      .crx-hb__track--right{
        animation:none;
      }
      .crx-hb__marquee{
        overflow-x:auto;
        -webkit-overflow-scrolling:touch;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ───────────────────────────────────────────────────
   3-A. HOMEPAGE BRANDS – ALT OPTION A
   Seamless infinite carousel: cards clone for endless
   loop, center card scales up, smooth rAF-driven
   crawl, click-to-focus, arrows step one at a time.
   Mount: <div class="crx-homebike-alt-a-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitHomeBikeAltA() {
  var mount = document.querySelector(".crx-homebike-alt-a-mount");
  if (!mount) return;

  var brands = [
    { name: "Factor",      slug: "factor" },
    { name: "ENVE",        slug: "enve" },
    { name: "TIME",        slug: "time" },
    { name: "Look",        slug: "look" },
    { name: "Bianchi",     slug: "bianchi" },
    { name: "Specialized", slug: "specialized" },
    { name: "Colnago",     slug: "colnago" },
    { name: "De Rosa",     slug: "de-rosa" },
    { name: "Scott",       slug: "scott" },
    { name: "Merckx",      slug: "merckx" },
    { name: "Ridley",      slug: "ridley" },
  ];

  function brandInitials(name) {
    return name.split(" ").map(function(w){ return w[0]; }).join("");
  }

  /* Build cards — we triple the set so there is always
     a full clone on each side for seamless wrapping. */
  function cardHTML(brand, setOffset) {
    return '<button class="crx-hba__card" data-crx-hba-brand="' + brand.slug + '" type="button" aria-label="' + brand.name + '">' +
      '<span class="crx-hba__card-initial">' + brandInitials(brand.name) + '</span>' +
      '<span class="crx-hba__card-name">' + brand.name + '</span>' +
    '</button>';
  }

  var tripled = brands.concat(brands).concat(brands);
  var cardsHTML = tripled.map(function(b) { return cardHTML(b); }).join("");

  mount.innerHTML =
    '<section class="crx-hba">' +
      '<div class="crx-hba__header">' +
        '<p class="crx-hba__kicker">Premium brands</p>' +
        '<h2 class="crx-hba__title">High-end bike builds</h2>' +
        '<p class="crx-hba__sub">Hand-built frames from the world\'s finest manufacturers, fitted and assembled to your exact specification.</p>' +
      '</div>' +
      '<div class="crx-hba__viewport">' +
        '<button class="crx-hba__arrow crx-hba__arrow--prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<div class="crx-hba__track">' + cardsHTML + '</div>' +
        '<button class="crx-hba__arrow crx-hba__arrow--next" type="button" aria-label="Next">&#8250;</button>' +
      '</div>' +
      '<div class="crx-hba__cta-wrap">' +
        '<a href="/bike-builds" class="crx-hba__cta">View bike builds &rarr;</a>' +
      '</div>' +
    '</section>';

  /* ── inject styles ── */
  var style = document.createElement("style");
  style.textContent =
    '.crx-hba{padding:56px 0;text-align:center;overflow:hidden;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:#fafafa}' +

    '.crx-hba__header{max-width:560px;margin:0 auto 36px;padding:0 20px}' +
    '.crx-hba__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin:0 0 8px}' +
    '.crx-hba__title{font-size:clamp(24px,4vw,34px);font-weight:900;margin:0 0 12px;line-height:1.1;color:#111}' +
    '.crx-hba__sub{font-size:15px;line-height:1.55;opacity:.65;margin:0;color:#333}' +

    /* viewport with edge fade */
    '.crx-hba__viewport{position:relative;width:100%;overflow:hidden;padding:28px 0;' +
      '-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 10%,#000 90%,transparent 100%);' +
      'mask-image:linear-gradient(90deg,transparent 0%,#000 10%,#000 90%,transparent 100%)}' +
    '.crx-hba__track{display:flex;align-items:center;gap:18px;will-change:transform}' +

    /* cards */
    '.crx-hba__card{' +
      'flex:0 0 auto;width:160px;height:200px;' +
      'background:#111;border:1px solid rgba(255,255,255,.06);border-radius:16px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
      'cursor:pointer;' +
      'transition:transform .7s cubic-bezier(.25,.1,.25,1),box-shadow .7s ease,opacity .7s ease;' +
      'color:#fff;opacity:.4;transform:scale(.85);' +
      'outline:none;-webkit-tap-highlight-color:transparent;padding:0;font-family:inherit}' +
    '.crx-hba__card:hover{opacity:.65}' +
    '.crx-hba__card.crx-hba__card--active{' +
      'transform:scale(1.05);opacity:1;' +
      'box-shadow:0 12px 48px rgba(0,0,0,.4)}' +
    '.crx-hba__card.crx-hba__card--near{transform:scale(.95);opacity:.7}' +
    '.crx-hba__card.crx-hba__card--far{transform:scale(.9);opacity:.5}' +

    '.crx-hba__card-initial{font-size:36px;font-weight:900;letter-spacing:.04em;line-height:1;color:rgba(255,255,255,.9)}' +
    '.crx-hba__card-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7)}' +

    /* navigation arrows – positioned on sides */
    '.crx-hba__arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:3;' +
      'width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,0,0,.12);' +
      'background:rgba(255,255,255,.92);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
      'font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .2s,color .2s,box-shadow .2s;color:#111;line-height:1;padding:0;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.1)}' +
    '.crx-hba__arrow:hover{background:#111;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.2)}' +
    '.crx-hba__arrow--prev{left:12px}' +
    '.crx-hba__arrow--next{right:12px}' +

    /* cta */
    '.crx-hba__cta-wrap{margin-top:32px}' +
    '.crx-hba__cta{display:inline-block;padding:12px 30px;border-radius:999px;font-size:14px;font-weight:800;' +
      'letter-spacing:.02em;background:#111;color:#fff;text-decoration:none;transition:opacity .2s}' +
    '.crx-hba__cta:hover{opacity:.78}' +

    /* reduced motion */
    '@media(prefers-reduced-motion:reduce){' +
      '.crx-hba__card{transition:none}' +
      '.crx-hba__track{transition:none}' +
    '}' +

    /* responsive */
    '@media(max-width:640px){' +
      '.crx-hba__card{width:130px;height:170px}' +
      '.crx-hba__card-initial{font-size:28px}' +
      '.crx-hba__arrow{width:34px;height:34px;font-size:18px}' +
      '.crx-hba__arrow--prev{left:6px}' +
      '.crx-hba__arrow--next{right:6px}' +
    '}';

  document.head.appendChild(style);

  /* ── carousel logic ── */
  var track = mount.querySelector(".crx-hba__track");
  var allCards = Array.prototype.slice.call(track.querySelectorAll(".crx-hba__card"));
  var n = brands.length;                 // 11 real brands
  var totalCards = allCards.length;       // 33 (tripled)
  var activeIdx = n;                     // start in the middle set
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var autoTimer = null;
  var paused = false;
  var isSnapping = false;

  /* Measure one card step (card width + gap) */
  function cardStep() {
    if (allCards.length < 2) return 178;
    return allCards[1].offsetLeft - allCards[0].offsetLeft;
  }

  /* Apply visual classes based on distance from active */
  function applyClasses() {
    allCards.forEach(function(card, i) {
      card.classList.remove("crx-hba__card--active", "crx-hba__card--near", "crx-hba__card--far");
      var dist = Math.abs(i - activeIdx);
      if (dist === 0)      card.classList.add("crx-hba__card--active");
      else if (dist === 1) card.classList.add("crx-hba__card--near");
      else if (dist === 2) card.classList.add("crx-hba__card--far");
    });
  }

  /* Centre activeIdx card in viewport (with optional CSS transition) */
  function centreOn(idx, animate) {
    var viewportW = mount.querySelector(".crx-hba__viewport").offsetWidth;
    var card = allCards[idx];
    var offset = -(card.offsetLeft - (viewportW / 2) + (card.offsetWidth / 2));
    if (animate) {
      track.style.transition = "transform .7s cubic-bezier(.25,.1,.25,1)";
    } else {
      track.style.transition = "none";
    }
    track.style.transform = "translateX(" + offset + "px)";
  }

  /* Silently jump to equivalent position in middle set
     (called after transition ends if we've drifted into a clone set) */
  function wrapIndex() {
    if (activeIdx < n) {
      activeIdx += n;
      centreOn(activeIdx, false);
    } else if (activeIdx >= 2 * n) {
      activeIdx -= n;
      centreOn(activeIdx, false);
    }
  }

  function goTo(idx, animate) {
    activeIdx = idx;
    applyClasses();
    centreOn(idx, animate);
    if (animate) {
      isSnapping = true;
      /* Wait for transition, then silently re-centre if needed */
      setTimeout(function() {
        wrapIndex();
        applyClasses();
        isSnapping = false;
      }, 720);
    }
  }

  function next() { goTo(activeIdx + 1, true); }
  function prev() { goTo(activeIdx - 1, true); }

  /* Arrow click handlers */
  mount.querySelector(".crx-hba__arrow--next").addEventListener("click", function() {
    if (isSnapping) return;
    next();
    resetAuto();
  });
  mount.querySelector(".crx-hba__arrow--prev").addEventListener("click", function() {
    if (isSnapping) return;
    prev();
    resetAuto();
  });

  /* Click any card to focus it */
  allCards.forEach(function(card, i) {
    card.addEventListener("click", function() {
      if (i === activeIdx || isSnapping) return;
      goTo(i, true);
      resetAuto();
    });
  });

  /* Auto-rotate: slow, one card at a time */
  function startAuto() {
    if (reducedMotion) return;
    stopAuto();
    autoTimer = setInterval(function() {
      if (!paused && !isSnapping) next();
    }, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  /* Pause on hover */
  var vp = mount.querySelector(".crx-hba__viewport");
  vp.addEventListener("mouseenter", function() { paused = true; });
  vp.addEventListener("mouseleave", function() { paused = false; });

  /* Init */
  goTo(activeIdx, false);
  startAuto();
}


/* ───────────────────────────────────────────────────
   3-B. HOMEPAGE BRANDS – ALT OPTION B
   Continuous single-row auto-scroll (dark card tiles)
   with left/right arrow navigation. rAF-driven scroll
   pauses on hover & arrow interaction, resumes after.
   Mount: <div class="crx-homebike-alt-b-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitHomeBikeAltB() {
  var mount = document.querySelector(".crx-homebike-alt-b-mount");
  if (!mount) return;

  var brands = [
    { name: "Factor",      slug: "factor" },
    { name: "ENVE",        slug: "enve" },
    { name: "TIME",        slug: "time" },
    { name: "Look",        slug: "look" },
    { name: "Bianchi",     slug: "bianchi" },
    { name: "Specialized", slug: "specialized" },
    { name: "Colnago",     slug: "colnago" },
    { name: "De Rosa",     slug: "de-rosa" },
    { name: "Scott",       slug: "scott" },
    { name: "Merckx",      slug: "merckx" },
    { name: "Ridley",      slug: "ridley" },
  ];

  function brandInitials(name) {
    return name.split(" ").map(function(w){ return w[0]; }).join("");
  }

  function cardHTML(brand) {
    return '<a href="/collections/' + brand.slug + '" class="crx-hbb__card">' +
      '<span class="crx-hbb__card-initial">' + brandInitials(brand.name) + '</span>' +
      '<span class="crx-hbb__card-name">' + brand.name + '</span>' +
    '</a>';
  }

  /* duplicate set for seamless loop */
  var singleSet = brands.map(cardHTML).join("");
  var doubledCards = singleSet + singleSet;

  mount.innerHTML =
    '<section class="crx-hbb">' +
      '<div class="crx-hbb__header">' +
        '<p class="crx-hbb__kicker">Premium brands</p>' +
        '<h2 class="crx-hbb__title">High-end bike builds</h2>' +
        '<p class="crx-hbb__sub">Hand-built frames from the world\'s finest manufacturers, fitted and assembled to your exact specification.</p>' +
      '</div>' +
      '<div class="crx-hbb__stage">' +
        '<button class="crx-hbb__arrow crx-hbb__arrow--prev" type="button" aria-label="Scroll left">&#8249;</button>' +
        '<div class="crx-hbb__marquee">' +
          '<div class="crx-hbb__track">' + doubledCards + '</div>' +
        '</div>' +
        '<button class="crx-hbb__arrow crx-hbb__arrow--next" type="button" aria-label="Scroll right">&#8250;</button>' +
      '</div>' +
      '<div class="crx-hbb__cta-wrap">' +
        '<a href="/bike-builds" class="crx-hbb__cta">View bike builds &rarr;</a>' +
      '</div>' +
    '</section>';

  /* ── inject styles ── */
  var style = document.createElement("style");
  style.textContent =
    '.crx-hbb{padding:56px 0;text-align:center;overflow:hidden;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:#fafafa}' +

    '.crx-hbb__header{max-width:560px;margin:0 auto 36px;padding:0 20px}' +
    '.crx-hbb__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin:0 0 8px}' +
    '.crx-hbb__title{font-size:clamp(24px,4vw,34px);font-weight:900;margin:0 0 12px;line-height:1.1;color:#111}' +
    '.crx-hbb__sub{font-size:15px;line-height:1.55;opacity:.65;margin:0;color:#333}' +

    /* stage = arrows + marquee row */
    '.crx-hbb__stage{position:relative;display:flex;align-items:center}' +

    /* navigation arrows */
    '.crx-hbb__arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:3;' +
      'width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,0,0,.12);' +
      'background:rgba(255,255,255,.92);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
      'font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .2s,color .2s,box-shadow .2s;color:#111;line-height:1;padding:0;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.1)}' +
    '.crx-hbb__arrow:hover{background:#111;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.2)}' +
    '.crx-hbb__arrow--prev{left:8px}' +
    '.crx-hbb__arrow--next{right:8px}' +

    /* marquee with edge fade */
    '.crx-hbb__marquee{flex:1;overflow:hidden;padding:22px 0;' +
      '-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 8%,#000 92%,transparent 100%);' +
      'mask-image:linear-gradient(90deg,transparent 0%,#000 8%,#000 92%,transparent 100%)}' +
    '.crx-hbb__track{display:flex;gap:16px;width:max-content;will-change:transform}' +

    /* cards */
    '.crx-hbb__card{' +
      'flex:0 0 auto;width:160px;height:200px;' +
      'background:#111;border:1px solid rgba(255,255,255,.06);border-radius:16px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
      'text-decoration:none;color:#fff;' +
      'transition:transform .3s ease,box-shadow .3s ease;' +
      'cursor:pointer}' +
    '.crx-hbb__card:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 10px 36px rgba(0,0,0,.35)}' +

    '.crx-hbb__card-initial{font-size:36px;font-weight:900;letter-spacing:.04em;line-height:1;color:rgba(255,255,255,.9)}' +
    '.crx-hbb__card-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7)}' +

    /* cta */
    '.crx-hbb__cta-wrap{margin-top:28px}' +
    '.crx-hbb__cta{display:inline-block;padding:12px 30px;border-radius:999px;font-size:14px;font-weight:800;' +
      'letter-spacing:.02em;background:#111;color:#fff;text-decoration:none;transition:opacity .2s}' +
    '.crx-hbb__cta:hover{opacity:.78}' +

    /* reduced motion */
    '@media(prefers-reduced-motion:reduce){' +
      '.crx-hbb__marquee{overflow-x:auto;-webkit-overflow-scrolling:touch}' +
      '.crx-hbb__card:hover{transform:none}' +
    '}' +

    /* responsive */
    '@media(max-width:640px){' +
      '.crx-hbb__card{width:130px;height:170px}' +
      '.crx-hbb__card-initial{font-size:28px}' +
      '.crx-hbb__arrow{width:34px;height:34px;font-size:18px}' +
      '.crx-hbb__arrow--prev{left:4px}' +
      '.crx-hbb__arrow--next{right:4px}' +
    '}';

  document.head.appendChild(style);

  /* ── rAF-driven continuous scroll with arrow override ── */
  var track = mount.querySelector(".crx-hbb__track");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return; /* graceful fallback: static scrollable row */

  var speed = 0.4;                       /* px per frame (~24 px/s at 60fps) */
  var pos = 0;
  var halfWidth = 0;
  var rafId = null;
  var paused = false;
  var arrowHoldId = null;
  var resumeTimer = null;

  function measureHalf() {
    halfWidth = track.scrollWidth / 2;
  }

  function tick() {
    if (!paused) {
      pos -= speed;
      /* seamless wrap: when we've scrolled past the first set, jump back */
      if (pos <= -halfWidth) pos += halfWidth;
      if (pos > 0) pos -= halfWidth;
      track.style.transform = "translateX(" + pos + "px)";
    }
    rafId = requestAnimationFrame(tick);
  }

  /* Arrow: jump one card-width smoothly using CSS transition,
     then sync pos and resume rAF scroll */
  function arrowStep(direction) {
    /* Measure one card step */
    var cards = track.querySelectorAll(".crx-hbb__card");
    var step = 176; /* fallback */
    if (cards.length >= 2) step = cards[1].offsetLeft - cards[0].offsetLeft;

    paused = true;
    clearTimeout(resumeTimer);

    var target = pos + (direction === "next" ? -step : step);

    track.style.transition = "transform .5s cubic-bezier(.25,.1,.25,1)";
    track.style.transform = "translateX(" + target + "px)";

    setTimeout(function() {
      track.style.transition = "none";
      pos = target;
      /* wrap */
      if (pos <= -halfWidth) pos += halfWidth;
      if (pos > 0) pos -= halfWidth;
      track.style.transform = "translateX(" + pos + "px)";

      /* resume auto-scroll after pause */
      resumeTimer = setTimeout(function() { paused = false; }, 2500);
    }, 520);
  }

  mount.querySelector(".crx-hbb__arrow--next").addEventListener("click", function() { arrowStep("next"); });
  mount.querySelector(".crx-hbb__arrow--prev").addEventListener("click", function() { arrowStep("prev"); });

  /* Pause on hover over marquee area */
  var marquee = mount.querySelector(".crx-hbb__marquee");
  marquee.addEventListener("mouseenter", function() { paused = true; clearTimeout(resumeTimer); });
  marquee.addEventListener("mouseleave", function() {
    resumeTimer = setTimeout(function() { paused = false; }, 400);
  });

  /* Init */
  measureHalf();
  window.addEventListener("resize", measureHalf);
  tick();
}