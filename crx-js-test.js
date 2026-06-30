document.addEventListener("DOMContentLoaded", function () {
  crxInitRequestModal();
  crxInitHomeBikes();
  // crxInitHomeBikeAltA(); /* Option A disabled — code kept below for reference */
  crxInitHomeBikeAltB();
  crxInitContactBikeRequest();
  crxInitDonateA();
  crxInitDonateB();
  crxInitDonateC();
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
    { name: "Factor",      url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547498&min=0&max=20000" },
    { name: "ENVE",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=2818995&min=0&max=20000" },
    { name: "TIME",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547339&min=0&max=20000" },
    { name: "Look",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547338&min=0&max=20000" },
    { name: "Bianchi",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547502&min=0&max=20000" },
    { name: "Specialized", url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547244&min=0&max=20000" },
    { name: "Colnago",     url: "https://www.thecyclery.ca/service/store-hours/" },
    { name: "De Rosa",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547503&min=0&max=20000" },
    { name: "Scott",       url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1611752&min=0&max=20000" },
    { name: "Merckx",      url: "https://www.thecyclery.ca/service/store-hours/" },
    { name: "Ridley",      url: "https://www.thecyclery.ca/service/store-hours/" },
  ];

  // Build chip HTML — duplicate the list so the strip is 2x wide for seamless loop
  function chipHTML(brand) {
    return `<a href="${brand.url}" class="crx-hb__chip">${brand.name}</a>`;
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
   Truly endless rAF-driven carousel. Center card
   scales up fluidly. Click any card to scroll it to
   center. Arrows step one card. Silky smooth motion.
   Mount: <div class="crx-homebike-alt-a-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitHomeBikeAltA() {
  var mount = document.querySelector(".crx-homebike-alt-a-mount");
  if (!mount) return;

  var CDN = "https://cdn.shoplightspeed.com/shops/635245/files/";
  var brands = [
    { name: "Factor",      url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547498&min=0&max=20000", img: CDN + "75058063/factor.png" },
    { name: "ENVE",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=2818995&min=0&max=20000", img: CDN + "75058062/enve.png" },
    { name: "TIME",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547339&min=0&max=20000", img: CDN + "75058071/time.png" },
    { name: "Look",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547338&min=0&max=20000", img: CDN + "75058064/look.png" },
    { name: "Bianchi",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547502&min=0&max=20000", img: CDN + "75058058/bianchi.png" },
    { name: "Specialized", url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547244&min=0&max=20000", img: CDN + "75058070/specialized.png" },
    { name: "Colnago",     url: "https://www.thecyclery.ca/service/store-hours/",                              img: CDN + "75058059/colnago.png" },
    { name: "De Rosa",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547503&min=0&max=20000", img: CDN + "75058060/derosa.png" },
    { name: "Scott",       url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1611752&min=0&max=20000", img: CDN + "75058069/scott.png" },
    { name: "Merckx",      url: "https://www.thecyclery.ca/service/store-hours/",                                                        img: CDN + "75058065/merckx.png" },
    { name: "Ridley",      url: "https://www.thecyclery.ca/service/store-hours/",                                                        img: CDN + "75058067/ridley.png" },
  ];

  function cardHTML(brand) {
    return '<button class="crx-hba__card" data-crx-hba-url="' + brand.url + '" type="button" aria-label="' + brand.name + '">' +
      '<img class="crx-hba__card-logo" src="' + brand.img + '" alt="' + brand.name + '" loading="lazy">' +
      '<span class="crx-hba__card-name">' + brand.name + '</span>' +
    '</button>';
  }

  /* Triple the set for seamless infinite wrapping */
  var tripled = brands.concat(brands).concat(brands);
  var cardsHTML = tripled.map(function(b) { return cardHTML(b); }).join("");

  mount.innerHTML =
    '<section class="crx-hba">' +
      '<div class="crx-hba__header">' +
        '<p class="crx-hba__kicker">Premium Brands</p>' +
        '<h2 class="crx-hba__title">Built around the brands you ride</h2>' +
        '<p class="crx-hba__sub">We carry the world\'s most elite cycling brands and build every bike to your exact specification.</p>' +
      '</div>' +
      '<div class="crx-hba__viewport">' +
        '<div class="crx-hba__track">' + cardsHTML + '</div>' +
        '<button class="crx-hba__arrow crx-hba__arrow--prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<button class="crx-hba__arrow crx-hba__arrow--next" type="button" aria-label="Next">&#8250;</button>' +
      '</div>' +
      '<div class="crx-hba__cta-wrap">' +
        '<a href="/bike-builds" class="crx-hba__cta">Explore our brands &rarr;</a>' +
      '</div>' +
    '</section>';

  /* ── inject styles ── */
  var style = document.createElement("style");
  style.textContent =
    '.crx-hba{padding:44px 0;text-align:center;overflow:hidden;width:100%;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:#fff;box-sizing:border-box}' +

    '.crx-hba__header{max-width:960px;margin:0 auto 32px;padding:0 20px}' +
    '.crx-hba__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin:0 0 8px}' +
    '.crx-hba__title{font-size:clamp(22px,3.6vw,34px);font-weight:900;margin:0 0 12px;line-height:1.1;color:#111;white-space:nowrap}' +
    '.crx-hba__sub{font-size:15px;line-height:1.55;opacity:.65;margin:0;color:#333}' +

    /* viewport with edge fade */
    '.crx-hba__viewport{position:relative;width:100%;overflow:hidden;padding:28px 0;' +
      '-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 2%,#000 98%,transparent 100%);' +
      'mask-image:linear-gradient(90deg,transparent 0%,#000 2%,#000 98%,transparent 100%)}' +
    '.crx-hba__track{display:flex;align-items:center;gap:18px;will-change:transform}' +

    /* cards — scale/opacity driven by JS via inline styles for fluid transitions */
    '.crx-hba__card{' +
      'flex:0 0 auto;width:160px;height:200px;' +
      'background:#111;border:1px solid rgba(255,255,255,.06);border-radius:16px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
      'cursor:pointer;color:#fff;' +
      'transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;' +
      'outline:none;-webkit-tap-highlight-color:transparent;padding:0;font-family:inherit}' +

    '.crx-hba__card-logo{width:80px;height:80px;object-fit:contain;pointer-events:none;transition:opacity .3s ease}' +
    '.crx-hba__card-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fff;transition:opacity .3s ease}' +

    /* navigation arrows – overlaid inside the viewport */
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
      '.crx-hba__viewport{overflow-x:auto;-webkit-overflow-scrolling:touch}' +
    '}' +

    /* responsive */
    '@media(max-width:640px){' +
      '.crx-hba__card{width:130px;height:170px}' +
      '.crx-hba__card-logo{width:60px;height:60px}' +
      '.crx-hba__arrow{width:34px;height:34px;font-size:18px}' +
      '.crx-hba__arrow--prev{left:6px}' +
      '.crx-hba__arrow--next{right:6px}' +
    '}';

  document.head.appendChild(style);

  /* ── rAF-driven continuous scroll with center-card emphasis ── */
  var track = mount.querySelector(".crx-hba__track");
  var viewport = mount.querySelector(".crx-hba__viewport");
  var allCards = Array.prototype.slice.call(track.querySelectorAll(".crx-hba__card"));
  var n = brands.length;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  var activeIdx = n;            /* start at first card of middle set */
  var animating = false;
  var autoTimer = null;
  var hovered = false;

  /* Easing */
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* Centre a card in the viewport (no animation) */
  function centreOn(idx) {
    var vpW = viewport.offsetWidth;
    var card = allCards[idx];
    var offset = -(card.offsetLeft - (vpW / 2) + (card.offsetWidth / 2));
    track.style.transform = "translateX(" + offset + "px)";
  }

  /* Apply scale + glow — all cards stay fully opaque (black bg images) */
  function applyProximity() {
    allCards.forEach(function(card, i) {
      var dist = Math.abs(i - activeIdx);
      if (dist === 0) {
        card.style.transform = "scale(1.12)";
        card.style.boxShadow = "0 8px 40px rgba(255,255,255,.12), 0 0 0 2px rgba(255,255,255,.15)";
        card.style.borderColor = "rgba(255,255,255,.18)";
        card.querySelector(".crx-hba__card-logo").style.opacity = "1";
        card.querySelector(".crx-hba__card-name").style.opacity = "1";
      } else if (dist === 1) {
        card.style.transform = "scale(0.88)";
        card.style.boxShadow = "none";
        card.style.borderColor = "rgba(255,255,255,.06)";
        card.querySelector(".crx-hba__card-logo").style.opacity = ".45";
        card.querySelector(".crx-hba__card-name").style.opacity = ".45";
      } else {
        card.style.transform = "scale(0.8)";
        card.style.boxShadow = "none";
        card.style.borderColor = "rgba(255,255,255,.03)";
        card.querySelector(".crx-hba__card-logo").style.opacity = ".25";
        card.querySelector(".crx-hba__card-name").style.opacity = ".25";
      }
    });
  }

  /* Silently wrap index back to middle set if we've drifted into a clone */
  function wrapIndex() {
    if (activeIdx < n) {
      activeIdx += n;
      centreOn(activeIdx);
    } else if (activeIdx >= 2 * n) {
      activeIdx -= n;
      centreOn(activeIdx);
    }
  }

  /* Animate from current card to a new index */
  function goTo(idx, callback) {
    if (animating) return;
    animating = true;

    var vpW = viewport.offsetWidth;
    var startCard = allCards[activeIdx];
    var endCard = allCards[idx];
    var startX = -(startCard.offsetLeft - (vpW / 2) + (startCard.offsetWidth / 2));
    var endX = -(endCard.offsetLeft - (vpW / 2) + (endCard.offsetWidth / 2));

    activeIdx = idx;
    applyProximity();

    var startTime = null;
    var duration = 300;

    function step(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var x = startX + (endX - startX) * ease(progress);
      track.style.transform = "translateX(" + x + "px)";
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        wrapIndex();
        applyProximity();
        if (callback) callback();
      }
    }
    requestAnimationFrame(step);
  }

  function next() { goTo(activeIdx + 1); }
  function prev() { goTo(activeIdx - 1); }

  /* Auto-rotate: advance one card every 2 seconds */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function() {
      if (!hovered && !animating) next();
    }, 2000);
  }
  function stopAuto() { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  /* Arrow click handlers */
  mount.querySelector(".crx-hba__arrow--next").addEventListener("click", function() {
    if (animating) return;
    next();
    resetAuto();
  });
  mount.querySelector(".crx-hba__arrow--prev").addEventListener("click", function() {
    if (animating) return;
    prev();
    resetAuto();
  });

  /* Click: non-active card → focus it; active card → navigate to brand URL */
  allCards.forEach(function(card, i) {
    card.addEventListener("click", function() {
      if (animating) return;
      if (i === activeIdx) {
        var url = card.getAttribute("data-crx-hba-url");
        if (url) window.location.href = url;
        return;
      }
      goTo(i);
      resetAuto();
    });
  });

  /* Pause on hover */
  viewport.addEventListener("mouseenter", function() { hovered = true; });
  viewport.addEventListener("mouseleave", function() { hovered = false; });

  /* Init */
  centreOn(activeIdx);
  applyProximity();
  startAuto();
  window.addEventListener("resize", function() { centreOn(activeIdx); });
}


/* ───────────────────────────────────────────────────
   3-B. HOMEPAGE BRANDS – ALT OPTION B
   Continuous single-row auto-scroll (dark card tiles)
   with visible left/right arrow navigation outside the
   masked area. rAF-driven, pauses on hover & arrows.
   Mount: <div class="crx-homebike-alt-b-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitHomeBikeAltB() {
  var mount = document.querySelector(".crx-homebike-alt-b-mount");
  if (!mount) return;

  var CDN = "https://cdn.shoplightspeed.com/shops/635245/files/";
  var brands = [
    { name: "Factor",      url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547498&min=0&max=20000", img: CDN + "75058063/factor.png" },
    { name: "ENVE",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=2818995&min=0&max=20000", img: CDN + "75058062/enve.png" },
    { name: "TIME",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547339&min=0&max=20000", img: CDN + "75058071/time.png" },
    { name: "Look",        url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547338&min=0&max=20000", img: CDN + "75058064/look.png" },
    { name: "Bianchi",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547502&min=0&max=20000", img: CDN + "75058058/bianchi.png" },
    { name: "Specialized", url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547244&min=0&max=20000", img: CDN + "75058070/specialized.png" },
    { name: "Colnago",     url: "https://www.thecyclery.ca/service/store-hours/",                              img: CDN + "75058059/colnago.png" },
    { name: "De Rosa",     url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1547503&min=0&max=20000", img: CDN + "75058060/derosa.png" },
    { name: "Scott",       url: "https://www.thecyclery.ca/bike/bicycles/?mode=grid&limit=12&sort=popular&brand=1611752&min=0&max=20000", img: CDN + "75058069/scott.png" },
    { name: "Merckx",      url: "https://www.thecyclery.ca/service/store-hours/",                                                        img: CDN + "75058065/merckx.png" },
    { name: "Ridley",      url: "https://www.thecyclery.ca/service/store-hours/",                                                        img: CDN + "75058067/ridley.png" },
  ];

  function cardHTML(brand) {
    return '<a href="' + brand.url + '" class="crx-hbb__card">' +
      '<img class="crx-hbb__card-logo" src="' + brand.img + '" alt="' + brand.name + '" loading="lazy">' +
      '<span class="crx-hbb__card-name">' + brand.name + '</span>' +
    '</a>';
  }

  /* duplicate set for seamless loop */
  var singleSet = brands.map(cardHTML).join("");
  var doubledCards = singleSet + singleSet;

  mount.innerHTML =
    '<section class="crx-hbb">' +
      '<div class="crx-hbb__header">' +
        '<p class="crx-hbb__kicker">Premium Brands</p>' +
        '<h2 class="crx-hbb__title">Built around the brands you ride</h2>' +
        '<p class="crx-hbb__sub">We carry the world\'s most elite cycling brands and build every bike to your exact specification. Don\'t see a model in our catalog? We can source and order it for you — <a href="https://www.thecyclery.ca/service/store-hours/" class="crx-hbb__sub-link">contact us</a> to inquire.</p>' +
      '</div>' +
      '<div class="crx-hbb__stage">' +
        '<button class="crx-hbb__arrow crx-hbb__arrow--prev" type="button" aria-label="Scroll left">&#8249;</button>' +
        '<div class="crx-hbb__marquee">' +
          '<div class="crx-hbb__track">' + doubledCards + '</div>' +
        '</div>' +
        '<button class="crx-hbb__arrow crx-hbb__arrow--next" type="button" aria-label="Scroll right">&#8250;</button>' +
      '</div>' +
      '<div class="crx-hbb__cta-wrap">' +
        '<a href="https://www.thecyclery.ca/bike/bicycles/" class="crx-hbb__cta">Explore our brands &rarr;</a>' +
      '</div>' +
    '</section>';

  /* ── inject styles ── */
  var style = document.createElement("style");
  style.textContent =
    '.crx-hbb{padding:24px 0;text-align:center;overflow:hidden;width:100%;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:#fff;box-sizing:border-box}' +

    '.crx-hbb__header{max-width:960px;margin:0 auto 20px;padding:0 20px}' +
    '.crx-hbb__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin:0 0 8px}' +
    '.crx-hbb__title{font-size:clamp(22px,3.6vw,34px);font-weight:900;margin:0 0 12px;line-height:1.1;color:#111;white-space:nowrap}' +
    '.crx-hbb__sub{font-size:15px;line-height:1.55;opacity:.65;margin:0;color:#333}' +
    '.crx-hbb__sub-link{color:#111;font-weight:700;text-decoration:underline;text-underline-offset:2px;transition:opacity .2s}' +
    '.crx-hbb__sub-link:hover{opacity:.6}' +

    /* stage: flex row with arrows flanking the marquee */
    '.crx-hbb__stage{position:relative;display:flex;align-items:center;gap:0;padding:0 56px;max-width:100%;margin:0 auto}' +

    /* navigation arrows — positioned outside the fade mask */
    '.crx-hbb__arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;' +
      'width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,0,0,.12);' +
      'background:rgba(255,255,255,.95);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
      'font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:background .2s,color .2s,box-shadow .2s,transform .2s;color:#111;line-height:1;padding:0;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.12)}' +
    '.crx-hbb__arrow:hover{background:#111;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.25);transform:translateY(-50%) scale(1.08)}' +
    '.crx-hbb__arrow:active{transform:translateY(-50%) scale(.96)}' +
    '.crx-hbb__arrow--prev{left:4px}' +
    '.crx-hbb__arrow--next{right:4px}' +

    /* marquee with edge fade */
    '.crx-hbb__marquee{flex:1;overflow:hidden;padding:14px 0;' +
      '-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 2%,#000 98%,transparent 100%);' +
      'mask-image:linear-gradient(90deg,transparent 0%,#000 2%,#000 98%,transparent 100%)}' +
    '.crx-hbb__track{display:flex;gap:14px;width:max-content;will-change:transform}' +

    /* cards */
    '.crx-hbb__card{' +
      'flex:0 0 auto;width:160px;height:200px;' +
      'background:#000;border:1px solid rgba(255,255,255,.06);border-radius:4px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
      'text-decoration:none;color:#fff;' +
      'transition:transform .3s ease,box-shadow .3s ease;' +
      'cursor:pointer}' +
    '.crx-hbb__card:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 10px 36px rgba(0,0,0,.35)}' +

    '.crx-hbb__card-logo{width:80px;height:80px;object-fit:contain;pointer-events:none;opacity:.9}' +
    '.crx-hbb__card-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7)}' +

    /* cta */
    '.crx-hbb__cta-wrap{margin-top:20px}' +
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
      '.crx-hbb__card-logo{width:60px;height:60px}' +
      '.crx-hbb__stage{padding:0 12px}' +
      '.crx-hbb__arrow{display:none}' +
    '}';

  document.head.appendChild(style);

  /* ── rAF-driven continuous scroll with arrow override ── */
  var track = mount.querySelector(".crx-hbb__track");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  var speed = 0.4;                       /* px per frame (~24 px/s at 60fps) */
  var pos = 0;
  var halfWidth = 0;
  var paused = false;
  var arrowBusy = false;
  var resumeTimer = null;

  function measureHalf() {
    halfWidth = track.scrollWidth / 2;
  }

  function tick() {
    if (!paused && !arrowBusy) {
      pos -= speed;
      /* seamless wrap */
      if (pos <= -halfWidth) pos += halfWidth;
      if (pos > 0) pos -= halfWidth;
      track.style.transform = "translateX(" + pos + "px)";
    }
    requestAnimationFrame(tick);
  }

  /* Arrow: smoothly animate one card-width, then resume */
  function arrowStep(direction) {
    var cards = track.querySelectorAll(".crx-hbb__card");
    var step = 176;
    if (cards.length >= 2) step = cards[1].offsetLeft - cards[0].offsetLeft;

    arrowBusy = true;
    paused = true;
    clearTimeout(resumeTimer);

    var startPos = pos;
    var target = pos + (direction === "next" ? -step : step);
    var startTime = null;
    var duration = 500;

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      pos = startPos + (target - startPos) * ease(progress);

      if (pos <= -halfWidth) pos += halfWidth;
      if (pos > 0) pos -= halfWidth;
      track.style.transform = "translateX(" + pos + "px)";

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        arrowBusy = false;
        resumeTimer = setTimeout(function() { paused = false; }, 2500);
      }
    }
    requestAnimationFrame(animate);
  }

  mount.querySelector(".crx-hbb__arrow--next").addEventListener("click", function() {
    if (arrowBusy) return;
    arrowStep("next");
  });
  mount.querySelector(".crx-hbb__arrow--prev").addEventListener("click", function() {
    if (arrowBusy) return;
    arrowStep("prev");
  });

  /* Pause on hover over marquee area */
  var marquee = mount.querySelector(".crx-hbb__marquee");
  marquee.addEventListener("mouseenter", function() { paused = true; clearTimeout(resumeTimer); });
  marquee.addEventListener("mouseleave", function() {
    if (!arrowBusy) {
      resumeTimer = setTimeout(function() { paused = false; }, 400);
    }
  });

  /* Touch swipe support for mobile — drag to scroll, pause then resume */
  var touchStartX = 0;
  var touchLastX = 0;
  var isTouching = false;

  marquee.addEventListener("touchstart", function(e) {
    isTouching = true;
    paused = true;
    clearTimeout(resumeTimer);
    touchStartX = e.touches[0].clientX;
    touchLastX = touchStartX;
  }, { passive: true });

  marquee.addEventListener("touchmove", function(e) {
    if (!isTouching) return;
    var currentX = e.touches[0].clientX;
    var delta = currentX - touchLastX;
    touchLastX = currentX;
    pos += delta;
    /* seamless wrap */
    if (pos <= -halfWidth) pos += halfWidth;
    if (pos > 0) pos -= halfWidth;
    track.style.transform = "translateX(" + pos + "px)";
  }, { passive: true });

  marquee.addEventListener("touchend", function() {
    isTouching = false;
    /* pause 3s so user can tap a card, then resume */
    resumeTimer = setTimeout(function() { paused = false; }, 3000);
  });

  /* Init */
  measureHalf();
  window.addEventListener("resize", measureHalf);
  tick();
}


/* ───────────────────────────────────────────────────
   4. CONTACT PAGE – BIKE REQUEST CTA
   Renders a styled section with a button that opens
   the existing request modal (Section 1).
   Requires BOTH mounts on the contact page:
     <div class="crx-rqnl-mount"></div>
     <div class="crx-contact-bikereq-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitContactBikeRequest() {
  var mount = document.querySelector(".crx-contact-bikereq-mount");
  if (!mount) return;

  mount.innerHTML =
    '<section class="crx-cbr">' +
      '<div class="crx-cbr__inner">' +
        '<p class="crx-cbr__kicker">Custom Bike Inquiry</p>' +
        '<h2 class="crx-cbr__title">Looking for a specific build?</h2>' +
        '<p class="crx-cbr__sub">We work with the world\'s top cycling brands and can source models that may not appear in our online catalog. Tell us what you\'re looking for and we\'ll take it from there.</p>' +
        '<button type="button" class="crx-cbr__btn">Get a custom quote</button>' +
      '</div>' +
    '</section>';

  /* ── inject styles ── */
  var style = document.createElement("style");
  style.textContent =
    '.crx-cbr{padding:0 0 32px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'box-sizing:border-box}' +
    '.crx-cbr__inner{background:#dddddd;border:1px solid rgba(0,0,0,.08);border-radius:12px;' +
      'padding:32px 28px;text-align:left}' +
    '.crx-cbr__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin:0 0 8px}' +
    '.crx-cbr__title{font-size:clamp(20px,3vw,26px);font-weight:900;margin:0 0 10px;line-height:1.15;color:#111}' +
    '.crx-cbr__sub{font-size:14px;line-height:1.6;opacity:.65;margin:0 0 20px;color:#333}' +
    '.crx-cbr__btn{display:inline-block;padding:11px 26px;border-radius:999px;font-size:14px;font-weight:800;' +
      'letter-spacing:.02em;background:#111;color:#fff;border:none;cursor:pointer;' +
      'font-family:inherit;transition:opacity .2s}' +
    '.crx-cbr__btn:hover{opacity:.78}';

  /* hide the modal's own trigger button — our CTA replaces it */
  var modalBtn = document.querySelector(".crx-rqnl__open");
  if (modalBtn) modalBtn.style.display = "none";

  document.head.appendChild(style);

  /* ── open the existing request modal when button is clicked ── */
  mount.querySelector(".crx-cbr__btn").addEventListener("click", function() {
    var modal = document.querySelector(".crx-rqnl__modal");
    if (modal) {
      modal.classList.add("crx-rqnl__modal--open");
      modal.setAttribute("aria-hidden", "false");
    }
  });
}


/* ───────────────────────────────────────────────────
   5-A. DONATION SECTION – BOLD STATEMENT
   Dark full-width banner, large type, strong presence.
   Feels like a team announcement / race-day energy.
   Mount: <div class="crx-donate-a-mount"></div>
   ─────────────────────────────────────────────────── */
function crxDonateHTML(prefix) {
  return '<section class="' + prefix + '">' +
    '<div class="' + prefix + '__inner">' +
      '<div class="' + prefix + '__watermark" aria-hidden="true">' +
        '<span class="' + prefix + '__wm-line1">Cyclery Racing -</span>' +
        '<span class="' + prefix + '__wm-line2">Abacus Data</span>' +
      '</div>' +
      '<div class="' + prefix + '__content">' +
        '<h3 class="' + prefix + '__tagline">BEHIND EVERY FINISH LINE IS A TEAM THAT BELIEVED.</h3>' +
        '<p class="' + prefix + '__sub">The Cyclery Racing is one of Canada\u2019s oldest women\u2019s road programs. Your support keeps Cyclery Racing on the start line at prestigious events like the Tour de Gatineau UCI races, and gives ambitious riders the resources to chase their potential.</p>' +
        '<div class="' + prefix + '__actions">' +
          '<a href="https://www.zeffy.com/en-CA/donation-form/the-cyclery-racing" target="_blank" rel="noopener" class="' + prefix + '__btn">Donate</a>' +
          '<a href="https://www.cycleryracing.ca" target="_blank" rel="noopener" class="' + prefix + '__link">VISIT CYCLERYRACING.CA</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}

/* ── shared base CSS (layout only, no colors) ── */
function crxDonateBaseCSS(p) {
  return '.' + p + '{display:block;padding:0 20px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;box-sizing:border-box;width:100%}' +
    '.' + p + '__inner{border-radius:6px;padding:48px 56px 40px;position:relative;overflow:hidden;max-width:1200px;margin:0 auto;text-align:center}' +
    '.' + p + '__watermark{pointer-events:none;margin:0 0 12px}' +
    '.' + p + '__wm-line1,.' + p + '__wm-line2{display:block;font-weight:900;line-height:.9;letter-spacing:-.03em}' +
    '.' + p + '__wm-line1{font-size:120px}' +
    '.' + p + '__wm-line2{font-size:120px}' +
    '.' + p + '__content{position:relative;z-index:2}' +
    '.' + p + '__tagline{font-size:14px;font-weight:800;letter-spacing:.06em;margin:0 0 8px;text-transform:uppercase}' +
    '.' + p + '__sub{font-size:15px;line-height:1.55;margin:0 auto 56px;max-width:660px}' +
    '.' + p + '__actions{display:flex;flex-direction:column;align-items:center;gap:12px}' +
    '.' + p + '__btn{display:inline-block;padding:20px 88px;font-size:32px;font-weight:700;border-radius:6px;text-decoration:none;transition:opacity .2s,transform .2s;letter-spacing:.01em}' +
    '.' + p + '__btn:hover{opacity:.85;transform:scale(1.03)}' +
    '.' + p + '__link{font-size:12px;font-weight:700;text-decoration:underline;text-underline-offset:3px;letter-spacing:.08em;transition:opacity .2s}' +
    '.' + p + '__link:hover{opacity:.6}' +
    '@media(max-width:900px){' +
      '.' + p + '__wm-line1,.' + p + '__wm-line2{font-size:80px}' +
    '}' +
    '@media(max-width:640px){' +
      '.' + p + '__inner{padding:28px 20px 24px}' +
      '.' + p + '__wm-line1,.' + p + '__wm-line2{font-size:48px}' +
      '.' + p + '__tagline{font-size:11px}' +
      '.' + p + '__sub{font-size:13px;margin-bottom:32px}' +
      '.' + p + '__btn{padding:14px 52px;font-size:22px}' +
    '}' +
    '@media(max-width:400px){' +
      '.' + p + '__wm-line1,.' + p + '__wm-line2{font-size:36px}' +
    '}';
}

/* 5-A  PINK version — only #f07ded bg + #bd48ba text, nothing else */
function crxInitDonateA() {
  var mount = document.querySelector(".crx-donate-a-mount");
  if (!mount) return;
  mount.innerHTML = crxDonateHTML("crx-dna");
  var style = document.createElement("style");
  style.textContent =
    '.crx-donate-a-mount{display:block!important;width:100%!important;overflow:visible!important}' +
    crxDonateBaseCSS("crx-dna") +
    '.crx-dna__inner{background:#f07ded}' +
    '.crx-dna__wm-line1,.crx-dna__wm-line2{color:#bd48ba}' +
    '.crx-dna__tagline{color:#bd48ba}' +
    '.crx-dna__sub{color:#bd48ba}' +
    '.crx-dna__btn{background:#bd48ba;color:#f07ded}' +
    '.crx-dna__link{color:#bd48ba}';
  document.head.appendChild(style);
}


/* ───────────────────────────────────────────────────
   5-B. DONATION SECTION – BLACK + WHITE
   Same layout as Option A but #111 bg, white headings,
   grey body text.
   Mount: <div class="crx-donate-b-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitDonateB() {
  var mount = document.querySelector(".crx-donate-b-mount");
  if (!mount) return;
  mount.innerHTML = crxDonateHTML("crx-dnb");
  var style = document.createElement("style");
  style.textContent =
    '.crx-donate-b-mount{display:block!important;width:100%!important;overflow:visible!important}' +
    crxDonateBaseCSS("crx-dnb") +
    '.crx-dnb__inner{background:#111}' +
    '.crx-dnb__wm-line1,.crx-dnb__wm-line2{color:rgba(255,255,255,.12)}' +
    '.crx-dnb__tagline{color:#fff}' +
    '.crx-dnb__sub{color:rgba(255,255,255,.55)}' +
    '.crx-dnb__btn{background:#fff;color:#111}' +
    '.crx-dnb__link{color:rgba(255,255,255,.5)}';
  document.head.appendChild(style);
}


/* ───────────────────────────────────────────────────
   5-C. DONATION SECTION – SPLIT / ABSTRACT
   Two-column layout with text left and a geometric
   accent block on the right. Personality without photos.
   Mount: <div class="crx-donate-c-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitDonateC() {
  var mount = document.querySelector(".crx-donate-c-mount");
  if (!mount) return;

  mount.innerHTML =
    '<section class="crx-dnc">' +
      '<div class="crx-dnc__inner">' +
        '<div class="crx-dnc__text">' +
          '<p class="crx-dnc__kicker">Cyclery Racing</p>' +
          '<h2 class="crx-dnc__title">Behind every finish line is a team that believed.</h2>' +
          '<p class="crx-dnc__sub">The Cyclery Racing &mdash; Abacus Data team competes across Canada\'s top cycling events. Your support keeps us on the start line.</p>' +
          '<div class="crx-dnc__actions">' +
            '<a href="https://www.zeffy.com/en-CA/donation-form/the-cyclery-racing" target="_blank" rel="noopener" class="crx-dnc__btn">Donate &rarr;</a>' +
            '<a href="https://www.thecyclery.ca" class="crx-dnc__link">The Cyclery</a>' +
          '</div>' +
        '</div>' +
        '<div class="crx-dnc__visual" aria-hidden="true">' +
          '<div class="crx-dnc__block crx-dnc__block--1"></div>' +
          '<div class="crx-dnc__block crx-dnc__block--2"></div>' +
          '<div class="crx-dnc__block crx-dnc__block--3"></div>' +
          '<span class="crx-dnc__visual-label">EST. 2024</span>' +
        '</div>' +
      '</div>' +
    '</section>';

  var style = document.createElement("style");
  style.textContent =
    '.crx-donate-c-mount{display:block!important;width:100%!important;overflow:visible!important}' +
    '.crx-dnc{display:block;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;box-sizing:border-box;width:100%}' +
    '.crx-dnc__inner{display:flex;align-items:center;gap:48px;max-width:1000px;margin:0 auto;' +
      'background:#fafafa;border:1px solid rgba(0,0,0,.07);border-radius:6px;padding:44px 40px;overflow:hidden}' +

    '.crx-dnc__text{flex:1;min-width:0}' +
    '.crx-dnc__kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;opacity:.4;margin:0 0 10px}' +
    '.crx-dnc__title{font-size:clamp(20px,3vw,26px);font-weight:900;margin:0 0 12px;line-height:1.2;color:#111}' +
    '.crx-dnc__sub{font-size:14px;line-height:1.65;opacity:.55;margin:0 0 24px;color:#333}' +
    '.crx-dnc__actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}' +
    '.crx-dnc__btn{display:inline-block;padding:11px 26px;border-radius:999px;font-size:14px;font-weight:800;' +
      'letter-spacing:.02em;background:#111;color:#fff;text-decoration:none;transition:opacity .2s}' +
    '.crx-dnc__btn:hover{opacity:.78}' +
    '.crx-dnc__link{font-size:13px;font-weight:700;color:#111;text-decoration:underline;text-underline-offset:2px;transition:opacity .2s}' +
    '.crx-dnc__link:hover{opacity:.55}' +

    /* abstract geometric accent */
    '.crx-dnc__visual{position:relative;flex:0 0 220px;height:200px}' +
    '.crx-dnc__block{position:absolute;border-radius:4px}' +
    '.crx-dnc__block--1{width:140px;height:140px;background:#111;top:10px;left:40px;opacity:.9}' +
    '.crx-dnc__block--2{width:100px;height:100px;background:#333;top:50px;left:90px;opacity:.7}' +
    '.crx-dnc__block--3{width:60px;height:60px;background:#666;top:0;left:10px;opacity:.5}' +
    '.crx-dnc__visual-label{position:absolute;bottom:8px;right:0;font-size:10px;font-weight:800;letter-spacing:.14em;opacity:.25;text-transform:uppercase}' +

    '@media(max-width:720px){' +
      '.crx-dnc__inner{flex-direction:column;gap:28px;padding:32px 24px}' +
      '.crx-dnc__visual{flex:0 0 auto;width:100%;height:120px}' +
      '.crx-dnc__block--1{width:100px;height:100px;left:calc(50% - 30px);top:5px}' +
      '.crx-dnc__block--2{width:70px;height:70px;left:calc(50% + 20px);top:30px}' +
      '.crx-dnc__block--3{width:45px;height:45px;left:calc(50% - 70px);top:0}' +
    '}';

  document.head.appendChild(style);
}

/* ───────────────────────────────────────────────────
   6. MAURTEN BICARB GUIDE
   Loads only on pages containing:
   <div id="bicarb-guide"></div>
   ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  crxInitMaurtenBicarbGuide();
});

function crxInitMaurtenBicarbGuide() {
  var mount = document.getElementById("bicarb-guide");
  if (!mount) return;

  var stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.type = "text/css";
  stylesheet.href = "https://www.maurten.com/assets/bicarb-guide/css/guide.css";
  document.head.appendChild(stylesheet);

  crxInjectBicarbAccordions(mount);

  var script = document.createElement("script");
  script.src = "https://www.maurten.com/assets/bicarb-guide/js/guide.js";
  script.defer = true;

  script.onload = function () {
    guide.init({
      wrapperElementId: "#bicarb-guide",
      language: "EN",
      products: {
        bicarb_15: {
          url: "https://www.thecyclery.ca/maurten-bicarb-system.html?id=119035500&quantity=1",
          description: "Box of 4 servings",
          text: "The Maurten Bicarb System is an advanced sports fuel designed to help athletes push the boundaries of effort and power during high-intensity exercise."
        },
        bicarb_19: {
          url: "https://www.thecyclery.ca/maurten-bicarb-system.html?id=119035501&quantity=1",
          description: "Box of 4 servings",
          text: "The Maurten Bicarb System is an advanced sports fuel designed to help athletes push the boundaries of effort and power during high-intensity exercise."
        },
        bicarb_22: {
          url: "https://www.thecyclery.ca/maurten-bicarb-system.html?id=119035499&quantity=1",
          description: "Box of 4 servings",
          text: "The Maurten Bicarb System is an advanced sports fuel designed to help athletes push the boundaries of effort and power during high-intensity exercise."
        }
      }
    });
  };

  document.head.appendChild(script);
}

function crxInjectBicarbAccordions(mount) {
  if (document.getElementById("crx-bicarb-acc-styles")) return;

  var style = document.createElement("style");
  style.id = "crx-bicarb-acc-styles";
  style.textContent =
    '.crx-bicarb-acc{max-width:760px;margin:32px 0 16px;font-family:inherit;color:#111;text-align:left}' +
    '.crx-bicarb-acc__intro{font-size:15px;line-height:1.6;color:#333;margin:0 0 24px}' +
    '.crx-bicarb-acc__intro p{margin:0 0 12px}' +
    '.crx-bicarb-acc__intro p:last-child{margin-bottom:0}' +
    '.crx-bicarb-acc__item{border-bottom:1px solid #e5e5e5}' +
    '.crx-bicarb-acc__item:first-child{border-top:1px solid #e5e5e5}' +
    '.crx-bicarb-acc__sum{list-style:none;cursor:pointer;padding:18px 8px;font-size:16px;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:12px}' +
    '.crx-bicarb-acc__sum::-webkit-details-marker{display:none}' +
    '.crx-bicarb-acc__sum::after{content:"+";font-size:22px;font-weight:400;line-height:1;transition:transform .2s ease}' +
    '.crx-bicarb-acc__item[open] .crx-bicarb-acc__sum::after{content:"–"}' +
    '.crx-bicarb-acc__body{padding:0 8px 20px;font-size:15px;line-height:1.6;color:#333}' +
    '.crx-bicarb-acc__body p{margin:0 0 12px}' +
    '.crx-bicarb-acc__body p:last-child{margin-bottom:0}';
  document.head.appendChild(style);

  var wrap = document.createElement("section");
  wrap.className = "crx-bicarb-acc";
  wrap.innerHTML =
    '<div class="crx-bicarb-acc__intro">' +
      '<p>The Maurten Bicarb System does for bicarbonate what Maurten Gel 100 and Drink Mixes did for carbohydrates — use Hydrogel Technology to encapsulate the bicarb and carry it through the stomach to be absorbed.</p>' +
      '<p>Lactate is not the enemy — it\u2019s a fuel source generated during all-out, high-intensity exercise. It\u2019s the increase in acidity during these efforts that overwhelms the muscles and leads to exhaustion. Large doses of sodium bicarbonate counteract the negative effects of the rising acidity, but there\u2019s always been a catch — stomach issues that cancel out any performance gains.</p>' +
      '<p>The Bicarb System cracks the code to deliver the smoothest, most effective bicarb experience ever.</p>' +
    '</div>' +
    '<details class="crx-bicarb-acc__item">' +
      '<summary class="crx-bicarb-acc__sum">Ingredients</summary>' +
      '<div class="crx-bicarb-acc__body">' +
        '<p>Bicarb System is a carbohydrate hydrogel mix with bicarbonate.</p>' +
        '<p>Sugars (maltodextrin, fructose), sodium bicarbonate, modified starch, hydroxypropyl cellulose, magnesium stearate, flavor, xanthan gum, silicon dioxide.</p>' +
        '<p><strong>High sodium content. Max 2 servings per week.</strong></p>' +
      '</div>' +
    '</details>' +
    '<details class="crx-bicarb-acc__item">' +
      '<summary class="crx-bicarb-acc__sum">What is the Maurten Bicarb System?</summary>' +
      '<div class="crx-bicarb-acc__body">' +
        '<p>The Maurten Bicarb System combines sodium bicarbonate with a specially formulated hydrogel to support high-intensity performance by helping to buffer the acid produced by active muscles during intense exercise. It is designed to make high bicarbonate doses more tolerable compared to traditional methods.</p>' +
        '<p>Bicarbonate can be used in training and racing for sports that require intermittent or constant intensity near or above the anaerobic threshold — such as cycling, middle-distance running, rowing, swimming, team sports, and combat sports. It can also be used in threshold (interval) training for all types of endurance sports.</p>' +
        '<p>During endurance events with periods of intense exercise or when athletes are able to maintain intensities at a high percentage of their maximal aerobic capacity, sodium bicarbonate has the potential to improve performance. This is currently an area of intense and ongoing research.</p>' +
      '</div>' +
    '</details>' +
    '<details class="crx-bicarb-acc__item">' +
      '<summary class="crx-bicarb-acc__sum">Who is the Bicarb System intended for?</summary>' +
      '<div class="crx-bicarb-acc__body">' +
        '<p>It is designed for athletes performing near or above their anaerobic threshold — such as in middle-distance running, rowing, cycling, or intense interval training. It is <strong>not primarily a carbohydrate fuel</strong> but a tool for specific performance demands.</p>' +
      '</div>' +
    '</details>' +
    '<details class="crx-bicarb-acc__item">' +
      '<summary class="crx-bicarb-acc__sum">How does the Maurten Bicarb System work?</summary>' +
      '<div class="crx-bicarb-acc__body">' +
        '<p>Maurten Hydrogel Technology helps with the ingestion of the mini tablets and protects them from dissolving prematurely in the stomach. Because of their small size, the mini tablets are not caught in the stomach like capsules. This results in a more controlled transfer from the stomach to the intestine where they gradually disintegrate, and the sodium bicarbonate is absorbed.</p>' +
      '</div>' +
    '</details>';

  mount.insertAdjacentElement("beforebegin", wrap);
}

