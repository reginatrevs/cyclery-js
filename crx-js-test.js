document.addEventListener("DOMContentLoaded", function () {
  crxInitRequestModal();
  crxInitHomeBikes();
  crxInitLastRideFirstSki();
  // crxInitHomeBikeAltA(); /* Option A disabled — code kept below for reference */
  crxInitHomeBikeAltB();
  crxInitContactBikeRequest();
  crxInitDonateA();
  crxInitDonateB();
  crxInitDonateC();
  crxInitWinterStorage();
  crxInitHeroLink();
  crxInitSaleBadges();
  crxInitProductRows();
  crxInitBlackFriday();
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
   3-C. HOMEPAGE: FROM THE LAST RIDE TO THE FIRST SKI
   Two image tiles: winter bike storage + nordic shop.
   Styles live in custom.css (search "crx-lrfs").
   Mount (Content > Homepage, above the brands mount):
   <div class="crx-lrfs-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitLastRideFirstSki() {
  var mount = document.querySelector(".crx-lrfs-mount");
  if (!mount) return;

  /* ── Edit these ── */
  var TILES = [
    {
      tag: "Park it for winter",
      head: "Winter bike storage. $250.",
      cta: "See details →",
      url: "/service/winter-storage/",
      img: "https://cdn.shoplightspeed.com/shops/635245/files/78388101/storage-tile.jpg", 
      alt: "Bikes hanging on storage hooks"
    },
    {
      tag: "Prep for ski season",
      head: "The nordic shop is open.",
      cta: "Shop ski →",
      url: "/ski/",
      img: "https://cdn.shoplightspeed.com/shops/635245/files/27159581/1200x1200x1/ski.jpg",
      alt: "Nordic skis at The Cyclery"
    }
  ];

  /* Bike hanging on storage hooks, drawn in lines (no text) */
  var STORAGE_SVG =
    '<svg class="crx-lrfs__graphic" viewBox="0 0 200 120" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M10 8h180" opacity=".35"/>' +
      '<path d="M60 8v14a5 5 0 0 1-10 0M140 8v14a5 5 0 0 0 10 0" opacity=".6"/>' +
      '<circle cx="55" cy="60" r="27"/><circle cx="145" cy="60" r="27"/>' +
      '<path d="M55 60l40 2-12-30h44M95 62l29-30M55 60l28-28M124 32l21 28M118 26h14M76 28h16"/>' +
      '<circle cx="95" cy="62" r="5"/>' +
    '</svg>';

  function tileHTML(t) {
    var media = t.img ? '<img class="crx-lrfs__img" src="' + t.img + '" alt="' + t.alt + '" loading="lazy">'
              : t.graphic ? STORAGE_SVG : "";
    return '<a class="crx-lrfs__tile" href="' + t.url + '">' + media +
      '<span class="crx-lrfs__body">' +
        '<span class="crx-lrfs__tag">' + t.tag + '</span>' +
        '<span class="crx-lrfs__head">' + t.head + '</span>' +
        '<span class="crx-lrfs__cta">' + t.cta + '</span>' +
      '</span></a>';
  }

  mount.innerHTML =
    '<section class="crx-lrfs">' +
      '<div class="crx-lrfs__header">' +
        '<h2 class="crx-lrfs__title">From the last ride to the first ski</h2>' +
        '<p class="crx-lrfs__sub">Store your bike for the winter and pick it up tuned and ready on April 1. Then head over to the nordic side for skis, boots and wax.</p>' +
      '</div>' +
      '<div class="crx-lrfs__grid">' + TILES.map(tileHTML).join("") + '</div>' +
    '</section>';
}

/* ───────────────────────────────────────────────────
   3-B. HOMEPAGE BRANDS – GRID
   Static gallery of dark brand cards (no carousel).
   6 per row on desktop, 4 on tablet, 3 on phones.
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

  /* 12th card fills the grid: 6+6 / 4+4+4 / 3x4 */
  var moreCard =
    '<a href="https://www.thecyclery.ca/service/store-hours/" class="crx-hbb__card crx-hbb__card--more">' +
      '<span class="crx-hbb__more-big">+ More</span>' +
      '<span class="crx-hbb__card-name">We source any build</span>' +
    '</a>';

  mount.innerHTML =
    '<section class="crx-hbb">' +
      '<div class="crx-hbb__header">' +
        '<h2 class="crx-hbb__title">Built around the brands you ride</h2>' +
        '<p class="crx-hbb__sub">We carry the world\'s most elite cycling brands and build every bike to your exact specification. Don\'t see a model in our catalog? We can source and order it for you — <a href="https://www.thecyclery.ca/service/store-hours/" class="crx-hbb__sub-link">contact us</a> to inquire.</p>' +
      '</div>' +
      '<div class="crx-hbb__grid">' + brands.map(cardHTML).join("") + moreCard + '</div>' +
    '</section>';

  var style = document.createElement("style");
  style.textContent =
    '.crx-hbb{padding:24px 56px 40px;text-align:center;width:100%;box-sizing:border-box;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff}' +
    '.crx-hbb__header{max-width:960px;margin:0 auto 24px}' +
    '.crx-hbb__title{font-size:clamp(22px,3.6vw,34px);font-weight:900;margin:0 0 12px;line-height:1.1;color:#111}' +
    '.crx-hbb__sub{font-size:15px;line-height:1.55;opacity:.65;margin:0;color:#333}' +
    '.crx-hbb__sub-link{color:#111;font-weight:700;text-decoration:underline;text-underline-offset:2px}' +

    '.crx-hbb__grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;max-width:1328px;margin:0 auto}' +
    '.crx-hbb .crx-hbb__card{aspect-ratio:4/5;background:#000;border-radius:4px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
      'text-decoration:none;color:#fff;transition:transform .3s ease,box-shadow .3s ease}' +
    '.crx-hbb .crx-hbb__card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.3)}' +
    '.crx-hbb .crx-hbb__card-logo{width:50%;max-width:100px;aspect-ratio:1;height:auto;object-fit:contain;margin:0;opacity:.9}' +
    '.crx-hbb .crx-hbb__card-name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7);padding:0 8px}' +
    '.crx-hbb .crx-hbb__card--more{background:#A41314}' +
    '.crx-hbb .crx-hbb__card--more .crx-hbb__card-name{color:rgba(255,255,255,.85)}' +
    '.crx-hbb .crx-hbb__more-big{font-size:clamp(18px,2vw,24px);font-weight:900;color:#fff}' +


    '@media(max-width:1024px){.crx-hbb__grid{grid-template-columns:repeat(4,minmax(0,1fr))}}' +
    '@media(max-width:640px){' +
      '.crx-hbb{padding:16px 16px 32px}' +
      '.crx-hbb__grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}' +
      '.crx-hbb .crx-hbb__card{gap:6px}' +
      '.crx-hbb .crx-hbb__card-name{font-size:10px}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){.crx-hbb .crx-hbb__card:hover{transform:none}}';

  document.head.appendChild(style);
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

// MESSAGE BAR JS TO MAKE IT CLICKABLE! 
document.addEventListener("DOMContentLoaded", () => {
  // Where a click on the red announcement bar goes. Update when the bar text changes.
  const destination = (typeof crxBFLive === "function" && crxBFLive()) ? "/service/black-friday-2026/" : "/service/winter-storage/";

  // Look for the element containing the announcement text near the top of the page
  const candidates = document.querySelectorAll("body *");

  for (const element of candidates) {
    const text = element.textContent?.trim();

    if (
      text &&
      text.length < 150 &&
      element.getBoundingClientRect().top < 150
    ) {
      const style = window.getComputedStyle(element);

      // Ignore hidden elements
      if (style.display === "none" || style.visibility === "hidden") continue;

      // Find the smallest element containing the announcement
      const childHasSameText = [...element.children].some(
        (child) => child.textContent?.trim() === text
      );

      if (!childHasSameText) {
        element.style.cursor = "pointer";
        element.setAttribute("role", "link");
        element.setAttribute("tabindex", "0");

        const goToPage = () => {
          window.location.href = destination;
        };

        element.addEventListener("click", goToPage);

        element.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goToPage();
          }
        });

        break;
      }
    }
  }
});
/* ───────────────────────────────────────────────────
   WINTER STORAGE PAGE  (/service/winter-storage/)
   Mount: <div class="crx-ws-mount"></div>
   Add  crxInitWinterStorage();  to the DOMContentLoaded list at the top.
   ─────────────────────────────────────────────────── */
function crxInitWinterStorage() {
  const mount = document.querySelector(".crx-ws-mount");
  if (!mount) return;

  /* ── Edit these ── */
  const HOURS = "Mon–Fri 10am–6pm · Sat 10am–5pm · Sun closed";
  const PHOTO_URL = "";               // shop photo URL; leave "" to hide the photo
  const PHONE = "(613) 730-2856";
  const PHONE_LINK = "tel:+16137302856";
  const ADDRESS = "1115 Bank Street, Ottawa ON K1S 3X4";
  const MAPS = "https://maps.google.com/?q=1115+Bank+Street+Ottawa+ON+K1S+3X4";

  /* Font: Open Sauce Sans (same family as Canva's Open Sauce) */
  if (!document.querySelector("link[data-crx-ws-fonts]")) {
    [400, 600, 700, 900].forEach((w) => {
      const f = document.createElement("link");
      f.rel = "stylesheet";
      f.href = `https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-sans@5/${w}.css`;
      f.setAttribute("data-crx-ws-fonts", "");
      document.head.appendChild(f);
    });
  }

  /* Page tweaks: hide the theme's plain title, let the content go full width */
  const intro = document.querySelector(".text-page__intro h1");
  if (intro) intro.style.display = "none";
  const section = mount.closest(".text-page__content");
  if (section) {
    section.classList.remove("container", "max-width-sm", "padding-top-lg", "padding-bottom-xl");
  }

  const tick = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B10D0E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg>`;
  const tuneItems = [
    "Wheel truing (off bike)",
    "Brake adjustments",
    "Gear adjustments",
    "Chain lubrication",
    "Safety check of all bolts and quick releases",
    "Tire inflation",
    "Bike cleaning",
    "Drivetrain removed, soaked and cleaned in our parts washer",
    "Hub adjustment",
  ];

  const sideTop = PHOTO_URL
    ? `<div class="crx-ws__photo" role="img" aria-label="A mechanic working on a bike at The Cyclery" style="background-image:url('${PHOTO_URL}')"></div>`
    : `<div class="crx-ws__note">
         <h3 class="crx-ws__display">Ready before everyone else.</h3>
         <p>Skip the spring tune-up rush. Your bike is serviced and waiting when the first nice day hits.</p>
       </div>`;

  mount.innerHTML = `
  <div class="crx-ws">

    <section class="crx-ws__wrap crx-ws__hero">
      <div class="crx-ws__hero-copy">
        <p class="crx-ws__badge">Winter Storage 2026–27</p>
        <h1 class="crx-ws__display crx-ws__h1">Hang it up<br>for winter.</h1>
        <p class="crx-ws__lead">The warm days are behind us. Leave your bike on one of our hooks until April 1 and pick it up tuned, clean and ready to ride.</p>
        <div class="crx-ws__btns">
          <a class="crx-ws__btn crx-ws__btn--line" href="${PHONE_LINK}">Call ${PHONE}</a>
        </div>
      </div>
      <div class="crx-ws__tag-col" aria-label="Winter storage: $250, Level 2 Tune included, ready by April 1, 2027">
        <div class="crx-ws__hook" aria-hidden="true"></div>
        <div class="crx-ws__tag">
          <div class="crx-ws__tag-hole" aria-hidden="true"></div>
          <div class="crx-ws__tag-top"><span class="crx-ws__tag-brand">THE CYCLERY</span><span class="crx-ws__tag-hookno">Hook # ____</span></div>
          <div class="crx-ws__tag-rule"></div>
          <span class="crx-ws__tag-label">Winter storage</span>
          <span class="crx-ws__display crx-ws__tag-price">$250</span>
          <ul class="crx-ws__ticks">
            <li>${tick}Level 2 Tune included ($150 value)</li>
            <li>${tick}Stored indoors</li>
            <li>${tick}Ready by April 1, 2027</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="crx-ws__strip">
      <div class="crx-ws__wrap crx-ws__strip-grid">
        <div class="crx-ws__stat"><span class="crx-ws__display crx-ws__stat-big">$250</span><span class="crx-ws__stat-small">One price for the whole season</span></div>
        <div class="crx-ws__stat"><span class="crx-ws__display crx-ws__stat-big">Tune 2</span><span class="crx-ws__stat-small">Included with your storage</span></div>
        <div class="crx-ws__stat"><span class="crx-ws__display crx-ws__stat-big">Apr 1</span><span class="crx-ws__stat-small">Pick up, ready to ride</span></div>
      </div>
    </section>

    <section class="crx-ws__wrap crx-ws__section">
      <h2 class="crx-ws__display crx-ws__h2">Your bike's winter, sorted.</h2>
      <div class="crx-ws__steps">
        <div class="crx-ws__step crx-ws__step--now"><span class="crx-ws__step-when">Now</span><h3>Drop it off</h3><p>Any time during store hours, no appointment needed. Take off lights, bags and computers first.</p></div>
        <div class="crx-ws__step"><span class="crx-ws__step-when">Winter</span><h3>It hangs with us</h3><p>Stored indoors, Level 2 Tune included.</p></div>
        <div class="crx-ws__step"><span class="crx-ws__step-when">Before pickup</span><h3>We give you a heads-up</h3><p>We contact you 5 days ahead. Your bike gets cleaned, charged and aired up.</p></div>
        <div class="crx-ws__step"><span class="crx-ws__step-when">By April 1</span><h3>Ride away</h3><p>First nice day of spring, you're ready before everyone else.</p></div>
      </div>
    </section>

    <section class="crx-ws__wrap crx-ws__tune-row">
      <div class="crx-ws__tune">
        <div class="crx-ws__tune-head">LEVEL 2 TUNE</div>
        <div class="crx-ws__tune-price"><s>$150.00</s><strong>Included</strong><span>with Winter Storage</span></div>
        <ul>${tuneItems.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="crx-ws__side">
        ${sideTop}
        <div class="crx-ws__addons">
          <div><h3>Optional add-ons</h3><p class="crx-ws__addons-sub">Ask at drop-off.</p></div>
          <div class="crx-ws__chips"><span class="crx-ws__chip">Sealant refresh · $40</span><span class="crx-ws__chip">Chain wax · $40</span></div>
        </div>
      </div>
    </section>

    <section class="crx-ws__wrap">
      <h2 class="crx-ws__display crx-ws__h2" style="font-size:clamp(28px,5vw,36px)">Good to know</h2>
      <div class="crx-ws__faq">
        <div><h3>One price for the season</h3><p>$250 no matter when you drop off or pick up.</p></div>
        <div><h3>E-bikes</h3><p>For battery safety we accept Specialized, Bosch, Shimano and TQ systems only. No throttle e-bikes.</p></div>
        <div><h3>Late pickup</h3><p>Bikes not picked up by April 1, 2027 are charged $10 per day.</p></div>
      </div>
    </section>

    <section class="crx-ws__visit" id="crx-ws-visit">
      <div class="crx-ws__wrap crx-ws__visit-row">
        <div class="crx-ws__visit-copy">
          <h2 class="crx-ws__display">Bring it in.</h2>
          <p>Drop off any time during store hours: ${HOURS}<br>${ADDRESS}<br>Questions? Give us a call before you come in.</p>
        </div>
        <div class="crx-ws__btns">
          <a class="crx-ws__btn crx-ws__btn--red" href="${MAPS}" target="_blank" rel="noopener">Get directions</a>
          <a class="crx-ws__btn crx-ws__btn--light" href="${PHONE_LINK}">Call ${PHONE}</a>
        </div>
      </div>
    </section>

  </div>`;
}
/* ───────────────────────────────────────────────────
   HOMEPAGE HERO BANNER → WINTER STORAGE (whole banner clickable)
   ─────────────────────────────────────────────────── */
function crxInitHeroLink() {
  const hero = document.querySelector("section.hero");
  if (!hero) return;
  const a = document.createElement("a");
  a.href = "/giftcard/";                       /* bottom banner = gift cards */
  a.setAttribute("aria-label", "Gift cards");
  a.style.cssText = "position:absolute;inset:0;z-index:5;";
  hero.style.position = "relative";
  hero.appendChild(a);
}

/* ───────────────────────────────────────────────────
   7. SALE / BLACK FRIDAY TAGS (product cards + product pages)
   Only products listed below get a custom tag. Everything else
   keeps Lightspeed's normal "Sale" badge.
   Works anywhere a product card shows: homepage featured products,
   categories, search, the Black Friday page.
   Dates are Toronto time. To preview a tag before its start date,
   add ?crxbf=preview to the page URL (only you see it).
   ─────────────────────────────────────────────────── */
function crxInitSaleBadges() {
  var BF_START = "2026-11-20T00:00:00-05:00";
  var BF_END   = "2026-12-01T00:00:00-05:00";

  /* ── Edit these ──
     slug  = end of the product link without ".html"
             thecyclery.ca/bont-riot-g-mtb-shoe.html → "bont-riot-g-mtb-shoe"
     label = tag text. "{pct}" is replaced by the real % off (needs a
             crossed-out price; if there isn't one, no tag shows). */
  var TAGS = [
    /* Bont demo for Vince: on now */
    { slug: "bont-riot-g-mtb-shoe",     label: "Black Friday −{pct}%", start: "2026-11-17T00:00:00-05:00", end: BF_END },
    { slug: "bont-riot-24-road-shoe",   label: "Black Friday −{pct}%", start: "2026-11-17T00:00:00-05:00", end: BF_END },
    { slug: "bont-vaypor-sl-road-shoe", label: "Black Friday −{pct}%", start: "2026-11-17T00:00:00-05:00", end: BF_END }

    /* Black Friday products: add one line per product, e.g.
    ,{ slug: "wahoo-kickr-core-2-w-zwift-cogo", label: "Black Friday −{pct}%", start: BF_START, end: BF_END } */
  ];

  /* Special-order note: replaces Lightspeed's plain "On backorder" text
     on these products (only sizes with backorders on show it). */
  var SPECIAL_ORDER = {
    match: /^bont-/,
    stock: "Not in stock · Special order",
    text: "Special order · Final sale. We order your size in early December; it's ready for pickup or shipped no later than December 24. Special orders can't be returned, refunded or exchanged.",
    cart: "Special order · Final sale. Ready or shipped by December 24. We'll email you when it's in.",
    end: BF_END
  };

  /* One-off bikes. sold: true shows SOLD in black. */
  var DOOR_CRASHERS = [
    /* one: true = only one left, tag says "Only 1" */
    { slug: "25-specialized-tarmac-sl8-sw-di2-sildst-dovgry-blk", one: true,  sold: false }, /* 56 */
    { slug: "",                                                 one: true,  sold: false }, /* 3T Exploro GRX, 56: not on eCom yet */
    { slug: "26-bianchi-sprint-105-di2",                        one: false, sold: false }, /* 53, 55 */
    { slug: "look-795-blade-2-road-frame",                      one: false, sold: false }, /* S, M */
    { slug: "bianchi-specialissima-rc-frameset-miami-drip",     one: true,  sold: false }, /* 50 */
    { slug: "enve-melee-frameset",                              one: false, sold: false }, /* 52, 54, 56 */
    { slug: "open-up-frameset",                                 one: true,  sold: false }  /* XL */
  ];
  window.CRX_DOOR_CRASHERS = DOOR_CRASHERS; /* shared with the Black Friday page */

  var DC_START = "2026-11-17T00:00:00-05:00";
  var DC_LABEL = "Black Friday · Only 1 · Final sale";
  var DC_LABEL_FEW = "Black Friday · Final sale";
  var DC_NOTE = "Black Friday · Final sale. Limited stock. No returns, refunds or exchanges.";

  var preview = /[?&]crxbf=preview/.test(location.search);
  var now = Date.now();
  function live(start, end) {
    return preview || (now >= Date.parse(start) && now < Date.parse(end));
  }
  function slugOf(href) {
    return (href || "").split("?")[0].split("#")[0].split("/").pop().replace(/\.html$/, "");
  }
  function num(el) {
    if (!el) return 0;
    return parseFloat(el.textContent.replace(/[^0-9.]/g, "")) || 0;
  }

  /* Returns {text, sold} or null */
  function labelFor(slug, oldEl, newEl) {
    var i;
    for (i = 0; i < DOOR_CRASHERS.length; i++) {
      var d = DOOR_CRASHERS[i];
      if (d.slug && d.slug === slug && live(DC_START, BF_END)) {
        if (d.sold) return { text: "Sold", sold: true };
        var w0 = num(oldEl), i0 = num(newEl), dp = w0 && i0 && i0 < w0 ? Math.round((1 - i0 / w0) * 100) : 0;
        return { text: "Black Friday" + (dp > 20 ? " −" + dp + "%" : "") + (d.one ? " · Only 1" : " · Final sale"), sold: false };
      }
    }
    for (i = 0; i < TAGS.length; i++) {
      var t = TAGS[i];
      if (t.slug !== slug || !live(t.start, t.end)) continue;
      if (t.label.indexOf("{pct}") === -1) return { text: t.label, sold: false };
      var was = num(oldEl), is = num(newEl);
      if (!was || !is || is >= was) return null;
      return { text: t.label.replace("{pct}", Math.round((1 - is / was) * 100)), sold: false };
    }
    return null;
  }
  function paint(badge, lab) {
    if (badge.textContent !== lab.text) badge.textContent = lab.text; /* avoid re-triggering the observer */
    badge.classList.add("crx-bf-badge");
    badge.classList.toggle("crx-bf-badge--sold", lab.sold);
  }

  function doCards() {
    var cards = document.querySelectorAll(".prod-card");
    Array.prototype.forEach.call(cards, function (card) {
      var link = card.querySelector('a[href$=".html"]');
      if (!link) return;
      var lab = labelFor(slugOf(link.href), card.querySelector(".prod-card__old-price"), card.querySelector(".prod-card__price"));
      if (!lab) return;
      if (!lab.sold && card.className.indexOf("crx-bf-card") === -1) card.className += " crx-bf-card";
      var badge = card.querySelector(".prod-card__badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "prod-card__badge";
        card.insertBefore(badge, card.firstChild);
      }
      paint(badge, lab);
    });
  }

  function doProductPage() {
    var wrap = document.querySelector(".product__price-wrapper");
    if (!wrap) return;
    var slug = slugOf(location.pathname);
    var badge = document.querySelector(".crx-bf-badge--page");
    var lab = labelFor(slug, wrap.querySelector(".product__price--old"), wrap.querySelector(".product__price"));
    if (!lab) { if (badge) badge.style.display = "none"; return; }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "crx-bf-badge crx-bf-badge--page";
      wrap.parentNode.insertBefore(badge, wrap);
    }
    badge.style.display = "";
    paint(badge, lab);
    if (!lab.sold && wrap.className.indexOf("crx-bf-price") === -1) wrap.className += " crx-bf-price";
  }

  var style = document.createElement("style");
  style.textContent =
    ".crx-bf-badge{background:#A41314 !important;color:#fff !important;font-weight:800;" +
      "font-size:11px;letter-spacing:.06em;text-transform:uppercase;line-height:1.2}" +
    ".crx-bf-badge--sold{background:#111 !important}" +
    /* sale price bold red, old price grey */
    ".crx-bf-card .prod-card__price,.crx-bf-price .product__price{color:#A41314 !important;font-weight:800 !important}" +
    ".crx-bf-card .prod-card__old-price,.crx-bf-price .product__price--old{color:#888 !important;font-weight:400 !important}" +
    ".crx-bf-badge--page{display:inline-block;padding:6px 10px;margin:0 0 10px;font-size:12px}" +
    ".crx-so-note{background:#FBE9E9;border-left:3px solid #A41314;color:#5A0A0B;" +
      "padding:10px 12px;margin:0 0 12px;font-size:14px;font-weight:600;line-height:1.4}" +
    ".out-of-stock[data-crx-so]{color:#A41314;font-weight:700}" +
    ".out-of-stock[data-crx-ss]{color:#1a7f37;font-weight:700}" +
    ".crx-so-cart{margin:6px 0 0;font-size:12px;font-weight:700;color:#A41314;line-height:1.35}";
  document.head.appendChild(style);

  /* Remembers which cart items are special orders (this browser only) */
  var SO_KEY = "crxSpecialOrders";
  function soLoad() { try { return JSON.parse(localStorage.getItem(SO_KEY) || "[]"); } catch (e) { return []; } }
  function soSave(list) { try { localStorage.setItem(SO_KEY, JSON.stringify(list.slice(-20))); } catch (e) {} }

  /* Backorder items we can get fast (ordered from the distributor the same day) */
  var SHIP_SOON = {
    slugs: ["wahoo-kickr-core-2-w-zwift-cogo", "wahoo-kickr-core-2-w-11s-cassette"],
    stock: "Available · Ships in 2–3 business days",
    text: "We order this one in for you the same day. Ready for pickup or shipped in 2–3 business days.",
    end: BF_END
  };
  function doShipSoon() {
    if (!document.querySelector(".product__price-wrapper")) return;
    if (SHIP_SOON.slugs.indexOf(slugOf(location.pathname)) < 0) return;
    if (!preview && Date.now() >= Date.parse(SHIP_SOON.end)) return;
    var stock = null;
    Array.prototype.forEach.call(document.querySelectorAll(".out-of-stock"), function (el) {
      if (el.getAttribute("data-crx-ss") || /on backorder/i.test(el.textContent)) stock = el;
    });
    var note = document.querySelector(".crx-ss-note");
    if (!stock) { if (note) note.parentNode.removeChild(note); return; }
    if (!stock.getAttribute("data-crx-ss")) { stock.setAttribute("data-crx-ss", "1"); stock.textContent = SHIP_SOON.stock; }
    var btn = document.querySelector(".btn--add-to-cart");
    if (btn && !note) {
      note = document.createElement("div");
      note.className = "crx-so-note crx-ss-note";
      note.textContent = SHIP_SOON.text;
      btn.parentElement.parentNode.insertBefore(note, btn.parentElement);
    }
  }

  function doSpecialOrderNote() {
    if (!document.querySelector(".product__price-wrapper")) return;
    if (!SPECIAL_ORDER.match.test(slugOf(location.pathname))) return;
    if (!preview && Date.now() >= Date.parse(SPECIAL_ORDER.end)) return;

    var stock = null;
    Array.prototype.forEach.call(document.querySelectorAll(".out-of-stock"), function (el) {
      if (el.getAttribute("data-crx-so") || /on backorder/i.test(el.textContent)) stock = el;
    });
    var note = document.querySelector(".crx-so-note");
    if (!stock) { if (note) note.parentNode.removeChild(note); return; }

    /* 1. Stock line */
    if (!stock.getAttribute("data-crx-so")) {
      stock.setAttribute("data-crx-so", "1");
      stock.textContent = SPECIAL_ORDER.stock;
    }

    /* 2. Note right above the Add to cart button */
    var btn = document.querySelector(".btn--add-to-cart");
    if (btn && !note) {
      note = document.createElement("div");
      note.className = "crx-so-note";
      note.textContent = SPECIAL_ORDER.text;
      var row = btn.parentElement;
      row.parentNode.insertBefore(note, row);
    }

    /* 3. Remember this variant when it's added to the cart */
    var form = document.getElementById("product_configure_form");
    if (form && !form.getAttribute("data-crx-so")) {
      form.setAttribute("data-crx-so", "1");
      form.addEventListener("submit", function () {
        var m = (form.action || "").match(/cart\/add\/(\d+)/);
        if (!m) return;
        var parts = Array.prototype.map.call(form.querySelectorAll("select"), function (sel) {
          var lab = form.querySelector('label[for="' + sel.id + '"]');
          var name = lab ? lab.textContent.replace(/[*:]/g, "").trim() : "";
          return name + ": " + (sel.options[sel.selectedIndex] || {}).text;
        });
        var list = soLoad().filter(function (x) { return x.id !== m[1]; });
        list.push({ id: m[1], slug: slugOf(location.pathname), parts: parts });
        soSave(list);
      });
    }
  }

  /* Adds the special-order line under those items in the cart page and cart drawer */
  function doCartNotes() {
    var list = soLoad();
    if (!list.length) return;
    function addNote(container) {
      if (!container || container.querySelector(".crx-so-cart")) return;
      var p = document.createElement("p");
      p.className = "crx-so-cart";
      p.textContent = SPECIAL_ORDER.cart;
      container.appendChild(p);
    }
    list.forEach(function (item) {
      /* Cart page: product link carries ?id=<variant> */
      Array.prototype.forEach.call(document.querySelectorAll('.gui-table a.gui-bold[href*="id=' + item.id + '"]'), function (a) {
        if (/[?&]id=(\d+)/.exec(a.href)[1] === item.id) addNote(a.closest("td"));
      });
      /* Cart drawer: match product + all chosen options */
      Array.prototype.forEach.call(document.querySelectorAll(".dr-cart__product"), function (li) {
        var a = li.querySelector('h2 a[href*="' + item.slug + '.html"]');
        var opts = li.querySelector("p");
        if (!a || !opts) return;
        var ok = item.parts.every(function (part) { return opts.textContent.indexOf(part) !== -1; });
        if (ok) addNote(opts.parentElement);
      });
    });
  }

  /* Final sale note above Add to cart on door crasher pages */
  function doDoorCrasherNote() {
    if (!document.querySelector(".product__price-wrapper")) return;
    var slug = slugOf(location.pathname), hit = null;
    for (var i = 0; i < DOOR_CRASHERS.length; i++) {
      if (DOOR_CRASHERS[i].slug && DOOR_CRASHERS[i].slug === slug) hit = DOOR_CRASHERS[i];
    }
    if (!hit || hit.sold || !live(DC_START, BF_END)) return;
    var btn = document.querySelector(".btn--add-to-cart");
    if (!btn || document.querySelector(".crx-dc-note")) return;
    var note = document.createElement("div");
    note.className = "crx-so-note crx-dc-note";
    note.textContent = DC_NOTE;
    var row = btn.parentElement;
    row.parentNode.insertBefore(note, row);
  }

  function run() { doCards(); doProductPage(); doSpecialOrderNote(); doShipSoon(); doDoorCrasherNote(); doCartNotes(); }
  run();

  /* Re-run when the theme swaps prices (size picked) or loads more products */
  var t = null;
  new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(run, 150);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

/* ───────────────────────────────────────────────────
   8. HOMEPAGE PRODUCT ROWS (Bont on sale, door crashers)
   Pulls real product cards from a Lightspeed page (search or
   category), so prices, stock and tags stay live.
   Mounts (Content > Homepage, where you want each row):
     <div class="crx-hp-bont-mount"></div>
     <div class="crx-hp-dc-mount"></div>
   ─────────────────────────────────────────────────── */
function crxInitProductRows() {
  /* ── Edit these ── */
  var ROWS = [
    {
      mount: ".crx-hp-bont-mount",
      source: "/search/bont/",          /* page to pull cards from */
      match: /^bont-/,                  /* keep only product links starting with "bont-" */
      kicker: "Up to 20% off",
      title: "Bont shoes",
      sub: "Every size, Standard and Wide. Not on the shelf? Special-order it by Nov 30.",
      cta: null                         /* no button: these are the only Bont shoes */
    },
    {
      mount: ".crx-hp-dc-mount",
      source: "",                       /* e.g. "/black-friday/door-crashers/" once the category exists */
      match: /.*/,
      kicker: "Black Friday Sale",
      title: "One-off frames & bikes",
      sub: "When it's gone, it's gone. We ship across Canada.",
      cta: { text: "See all door crashers", url: "" }
    }
  ];

  function slugOf(href) {
    return (href || "").split("?")[0].split("#")[0].split("/").pop().replace(/\.html$/, "");
  }

  if (!document.getElementById("crx-hp-rows-css")) {
    var style = document.createElement("style");
    style.id = "crx-hp-rows-css";
    style.textContent =
      ".crx-hpr{padding:40px 56px 24px;box-sizing:border-box;width:100%;" +
        "font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif}" +
      ".crx-hpr__head{max-width:1328px;margin:0 auto 24px;display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center}" +
      ".crx-hpr .crx-hpr__kicker{margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#A41314}" +
      ".crx-hpr .crx-hpr__title{margin:0;font-size:clamp(22px,3vw,32px);font-weight:900;line-height:1.1;color:#111}" +
      ".crx-hpr .crx-hpr__sub{margin:6px 0 0;font-size:15px;line-height:1.5;color:#555}" +
      ".crx-hpr .crx-hpr__cta{flex-shrink:0;text-decoration:none}" +
      ".crx-hpr__grid{max-width:1328px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}" +
      ".crx-hpr__grid .prod-card{position:relative;margin:0}" +
      "@media(max-width:1024px){.crx-hpr__grid{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
      /* fewer than 4 products: spread across the full width */
      "@media(min-width:641px){.crx-hpr__grid--n1{grid-template-columns:minmax(0,1fr)}" +
        ".crx-hpr__grid--n2{grid-template-columns:repeat(2,minmax(0,1fr))}" +
        ".crx-hpr__grid--n3{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
      /* phones: one swipeable row, next card peeking in */
      "@media(max-width:640px){.crx-hpr{padding:28px 0 16px}" +
        ".crx-hpr__head{padding:0 16px;margin-bottom:16px}" +
        ".crx-hpr .crx-hpr__sub{font-size:14px}" +
        ".crx-hpr__grid{display:grid;grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:68%;" +
          "gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 16px 8px;scroll-padding:0 16px;" +
          "-webkit-overflow-scrolling:touch;scrollbar-width:none}" +
        ".crx-hpr__grid::-webkit-scrollbar{display:none}" +
        ".crx-hpr__grid .prod-card{scroll-snap-align:start}" +
        ".crx-hpr__grid .crx-bf-badge{font-size:10px;letter-spacing:.04em;padding:5px 7px;max-width:calc(100% - 20px)}}";
    document.head.appendChild(style);
  }

  ROWS.forEach(function (row) {
    var mount = document.querySelector(row.mount);
    if (!mount || !row.source) return;

    fetch(row.source, { credentials: "same-origin" })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var cards = Array.prototype.filter.call(doc.querySelectorAll(".prod-card"), function (card) {
          var a = card.querySelector('a[href$=".html"]');
          return a && row.match.test(slugOf(a.href));
        });
        if (!cards.length) return;

        var cta = row.cta && row.cta.url
          ? '<a class="btn btn--primary crx-hpr__cta" href="' + row.cta.url + '">' + row.cta.text + ' &rarr;</a>' : "";
        mount.innerHTML =
          '<section class="crx-hpr">' +
            '<div class="crx-hpr__head"><div>' +
              '<p class="crx-hpr__kicker">' + row.kicker + '</p>' +
              '<h2 class="crx-hpr__title">' + row.title + '</h2>' +
              '<p class="crx-hpr__sub">' + row.sub + '</p>' +
            '</div>' + cta + '</div>' +
            '<div class="crx-hpr__grid"></div>' +
          '</section>';
        var grid = mount.querySelector(".crx-hpr__grid");
        if (cards.length < 4) grid.className += " crx-hpr__grid--n" + cards.length;
        cards.slice(0, 8).forEach(function (card) {
          grid.appendChild(document.importNode(card, true));
        });
      })
      .catch(function () { /* leave the mount empty if the page can't load */ });
  });
}





























/* ───────────────────────────────────────────────────
   9. BLACK FRIDAY  (homepage takeover + landing page)
   Turns on by itself Nov 20 at 12:00 am (Toronto) and off Dec 1.
   Nothing to paste on the homepage on Friday: the code adds the
   Black Friday hero and tiles and hides the normal hero.

   Landing page: eCom > Content > Pages > new page
     Title: Black Friday 2026   ·   URL: black-friday-2026
     Content (HTML view):  <div class="crx-bfp-mount"></div>
   Before Nov 20 the page shows a "starts Friday" teaser
   (with the Bont deal, which is already on).

   Preview everything now (only you see it): add ?crxbf=preview
     thecyclery.ca/?crxbf=preview
     thecyclery.ca/service/black-friday-2026/?crxbf=preview
   ─────────────────────────────────────────────────── */
function crxBFLive() {
  var START = Date.parse("2026-11-20T00:00:00-05:00");
  var END = Date.parse("2026-12-01T00:00:00-05:00");
  if (/[?&]crxbf=preview/.test(location.search)) return true;
  var now = Date.now();
  return now >= START && now < END;
}

function crxInitBlackFriday() {
  var PAGE = "/service/black-friday-2026/";
  var CDN = "https://cdn.shoplightspeed.com/shops/635245/files/";

  /* ── Edit these: the sections of the Black Friday page, in order ──
     sources = category/brand pages to pull products from
     slugs   = exact products (used for door crashers)
     keep    = only keep products whose name matches (optional)
     skip    = drop products whose link matches (optional)
     tag     = true: cards get "Black Friday −X%"  ·  false: no tag (Wahoo) */
  var SECTIONS = [
    { id: "door-crashers", title: "Door crashers", label: "One-off frames & bikes", sub: "Only one of each.",
      slugs: (window.CRX_DOOR_CRASHERS || []).map(function (d) { return d.slug; }).filter(Boolean), tag: "dc" },
    { id: "bont", title: "Bont shoes", sub: "Every size, Standard and Wide.\nNot on the shelf? Special-order it by Nov 30.",
      sources: ["/brands/bont-cycling/"], tag: true, early: true },
    { id: "wahoo", title: "Wahoo trainers & computers", nav: "Wahoo", sub: "KICKR trainers and ELEMNT computers at Black Friday prices.",
      sources: ["/brands/wahoo/"], keep: /kickr|elemnt|bolt|roam|rollr|\bace\b/i,
      drop: /freehub|feet|floor mat/i, tag: true, saleOnly: true },
    { id: "ski", title: "Nordic ski", sub: "Skis, boots and poles at 20% off or more.",
      sources: ["/sale/xc-ski/"], slugs: ["salomon-s-max-carbon-skate-mv-boot"], min: 0.20, tag: true, pin: ["salomon-s-max-carbon-skate-mv-boot"],
      promo: true },
    { id: "bikes", title: "Bikes, frames & wheels", nav: "Bikes & frames", sub: "Complete bikes, framesets and wheels.",
      sources: ["/sale/bikes-and-wheels/", "/sale/framesets/"], min: 0.15, tag: true },
    { id: "helmets", title: "Helmets", sub: "Black Friday prices on helmets from POC, Specialized, Kask and more.",
      sources: ["/sale/helmets/", "/sale/poc-helmet-clearance/"], tag: true },
    { id: "clothing", title: "Clothing", sub: "Men's and women's kit, base layers and winter gear.",
      sources: ["/sale/mens-clothing/", "/sale/womens-clothing/"], tag: true },
    { id: "shoes", title: "Cycling shoes", sub: "Road and mountain shoes at Black Friday prices.",
      sources: ["/sale/shoes/"], skip: /^bont-/, tag: true }
  ];

  /* Homepage tiles (shown under the door crashers / Bont rows) */
  var TILES = [
    { tag: "Black Friday prices", big: "Wahoo", line: "KICKR trainers & ELEMNT computers.", cta: "Shop Wahoo →", url: PAGE + "#wahoo",
      img: CDN + "78452444/wahoo.png" },
    { tag: "Early season ski", big: "−30%", line: "Full ski packages. 20% off any 2 of the 3.", cta: "How it works →", url: PAGE + "#ski",
      img: CDN + "27159581/1200x1200x1/ski.jpg" },
    { tag: "Clothing & helmets", big: "−70%", line: "Kit, base layers, winter gear and helmets.", cta: "Shop clothing →", url: PAGE + "#clothing",
      img: CDN + "31781707/1200x1200x1/clothing.jpg", up: "clothing" }
  ];

  /* Lightspeed "No image available" placeholders uploaded as product photos */
  var NO_IMAGE = [58993200, 58994769, 58994776, 58995352];

  var HERO_IMG = CDN + "75960329/1600x900x1/cyclery-racing-2026-team.jpg";
  var isHome = location.pathname === "/" || location.pathname === "";
  var pageMount = document.querySelector(".crx-bfp-mount");
  var live = crxBFLive();
  if (!pageMount && !live && !isHome) return;

  var DC = {};
  (window.CRX_DOOR_CRASHERS || []).forEach(function (d) { if (d.slug) DC[d.slug] = d; });

  /* ── styles ── */
  if (!document.getElementById("crx-bf-css")) {
    var css = document.createElement("style");
    css.id = "crx-bf-css";
    css.textContent = [
      "@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,800;0,900;1,900&display=swap');",
      ".crx-bf{--neon:#E4FF3A;--red:#A41314;--ink:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:var(--ink)}",
      ".crx-bf *{box-sizing:border-box}",
      ".crx-bf .crx-d{font-family:'Archivo',Arial,sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-.03em;line-height:.88}",
      ".crx-bf .crx-l{font-family:'Archivo',Arial,sans-serif;font-weight:800;letter-spacing:.14em;text-transform:uppercase}",
      /* hero */
      ".crx-bf-hero{position:relative;background:#000;color:#fff;overflow:hidden;width:100vw;margin-left:calc(50% - 50vw)}",
      ".crx-bf-hero__img{position:absolute;right:0;top:0;bottom:0;width:60%;background-size:auto 215%;background-position:center 0;filter:grayscale(1) contrast(1.1)}",
      ".crx-bf-hero__fade{position:absolute;inset:0;background:linear-gradient(90deg,#000 42%,rgba(0,0,0,.55) 65%,rgba(0,0,0,.1))}",
      ".crx-bf-hero__in{position:relative;max-width:1328px;margin:0 auto;padding:64px 56px;display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}",
      ".crx-bf-hero--home .crx-bf-hero__in{grid-template-columns:1fr;min-height:520px}",
      ".crx-bf-hero--home .crx-bf-hero__img{width:66%}",
      ".crx-bf-hero .crx-bf-kick{color:#fff;opacity:.85;font-size:13px}",
      ".crx-bf-hero h1{margin:14px 0 0;color:var(--neon);font-size:clamp(64px,9vw,148px)}",
      ".crx-bf-hero .crx-bf-lead{margin:18px 0 0;font-size:20px;line-height:1.4;font-weight:600;max-width:520px;color:#fff}",
      ".crx-bf-hero .crx-bf-btns{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}",
      ".crx-bf-btn{display:inline-flex;align-items:center;height:52px;padding:0 28px;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none!important}",
      ".crx-bf-btn--neon{background:var(--neon);color:#000!important}",
      ".crx-bf-btn--ghost{border:2px solid #fff;color:#fff!important}",
      ".crx-bf-count{display:flex;gap:10px;margin-top:26px}",
      ".crx-bf-count div{background:#111;border:1px solid #333;padding:10px 14px;min-width:78px;text-align:center}",
      ".crx-bf-count b{display:block;font-family:'Archivo',Arial,sans-serif;font-size:34px;font-weight:900;color:var(--neon);line-height:1}",
      ".crx-bf-count span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.7}",
      /* start list */
      ".crx-bf-sl{background:#fff;color:var(--ink);border-radius:14px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.45);position:relative}",
      ".crx-bf-sl__band{background:var(--red);color:#fff;display:flex;justify-content:space-between;padding:14px 22px;font-size:12px}",
      ".crx-bf-sl ol{list-style:none;margin:0;padding:6px 0}",
      ".crx-bf-sl li a{display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:14px;padding:9px 22px;color:var(--ink)!important;text-decoration:none!important;border-bottom:1px dashed #e2e2e2}",
      ".crx-bf-sl li:last-child a{border-bottom:0}",
      ".crx-bf-sl li a:hover{background:#f6f6f6}",
      ".crx-bf-sl .crx-bf-no{background:#000;color:var(--neon);font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:17px;text-align:center;padding:5px 0}",
      ".crx-bf-sl .crx-bf-nm{font-weight:700;font-size:15px}",
      ".crx-bf-sl .crx-bf-n{font-size:12px;color:#777;white-space:nowrap}",
      /* sticky chips */
      ".crx-bf-chips{position:sticky;top:0;z-index:20;background:#000;width:100vw;margin-left:calc(50% - 50vw)}",
      ".crx-bf-chips__in{max-width:1328px;margin:0 auto;padding:10px 56px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}",
      ".crx-bf-chips__in::-webkit-scrollbar{display:none}",
      ".crx-bf-chips a{flex-shrink:0;display:inline-flex;gap:8px;align-items:center;color:#fff!important;text-decoration:none!important;border:1px solid #333;padding:7px 12px;font-size:13px;font-weight:700}",
      ".crx-bf-chips a b{color:var(--neon);font-family:'Archivo',Arial,sans-serif}",
      /* sections */
      ".crx-bf-sec{max-width:1328px;margin:0 auto;padding:56px 56px 8px;scroll-margin-top:60px}",
      ".crx-bf-sec__head{display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:end;border-bottom:3px solid var(--ink);padding-bottom:16px;margin-bottom:24px}",
      ".crx-bf-bib{position:relative;width:96px;height:78px;background:var(--neon);display:flex;align-items:center;justify-content:center;border-radius:6px}",
      ".crx-bf-bib b{font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:44px;color:#000;letter-spacing:-.04em}",
      ".crx-bf-bib i{position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 2px #00000033}",
      ".crx-bf-sec h2{margin:0;font-size:clamp(30px,4vw,52px);color:var(--ink)}",
      ".crx-bf-sec p.crx-bf-sub{margin:8px 0 0;color:#555;font-size:15px;line-height:1.5}",
      ".crx-bf-sec .crx-bf-n{font-size:13px;color:#777;white-space:nowrap;padding-bottom:6px}",
      ".crx-bf-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}",
      ".crx-bf-grid .prod-card{position:relative;margin:0}",
      ".crx-bf-homedc{width:100vw;margin-left:calc(50% - 50vw)}",
      "@media(min-width:641px){.crx-bf-homedc .crx-hpr{padding:48px 56px 16px}}",
      "@media(max-width:640px){.crx-hpr .crx-hpr__kicker{font-size:11px;letter-spacing:.1em}}",
      ".crx-bf .crx-bf-all{display:table;margin:26px auto 0;border:2px solid var(--ink);padding:14px 26px;font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink)!important;text-decoration:none!important}",
      ".crx-bf-more{display:block;margin:26px auto 0;background:none;border:2px solid var(--ink);height:48px;padding:0 26px;font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}",
      ".crx-bf-empty{color:#777;font-size:15px;padding:12px 0 24px}",
      ".crx-bf-foot{max-width:1328px;margin:40px auto 0;padding:24px 56px 56px;color:#555;font-size:14px;line-height:1.6;border-top:1px solid #e4e4e4}",
      /* landing page */
      ".crx-bfp{width:100vw;margin-left:calc(50% - 50vw);background:#fff}",
      ".crx-bfp-head{background:var(--neon);color:#000}",
      ".crx-bfp-head__in{max-width:1328px;margin:0 auto;padding:40px 56px 34px;display:grid;grid-template-columns:auto 1fr;column-gap:40px;align-items:end}",
      ".crx-bfp-kick{grid-column:1/-1;font-size:12px;margin-bottom:10px}",
      ".crx-bfp-head h1{margin:0;font-size:clamp(56px,8vw,112px);color:#000}",
      ".crx-bfp-lead{margin:0 0 10px;font-size:17px;line-height:1.45;font-weight:600;max-width:460px}",
      ".crx-bf-count--light{margin:0 0 12px}.crx-bf-count--light div{background:#000;border-color:#000}.crx-bf-count--light span{color:#fff}",
      ".crx-bfp-jump{position:sticky;top:0;z-index:2;background:#000}",
      ".crx-bfp-jump__in{max-width:1328px;margin:0 auto;padding:0 56px;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}",
      ".crx-bfp-jump__in::-webkit-scrollbar{display:none}",
      ".crx-bfp-jump a{flex-shrink:0;color:#fff!important;text-decoration:none!important;font-weight:700;font-size:14px;padding:14px 14px;border-bottom:3px solid transparent}",
      ".crx-bfp-jump a:hover{border-bottom-color:var(--neon)}",
      ".crx-bfp-jump a span{color:var(--neon);margin-left:6px;font-weight:800}",
      ".crx-bfp-sec{max-width:1328px;margin:0 auto;padding:60px 56px 8px;scroll-margin-top:56px;border-bottom:1px solid #eee}",
      ".crx-bfp-sec__head{text-align:center;margin-bottom:26px}",
      ".crx-bfp-up{display:inline-block;background:#000;color:var(--neon);font-size:12px;padding:6px 10px;margin-bottom:12px}",
      ".crx-bfp-sec h2{margin:0;font-size:clamp(30px,3.6vw,46px);color:var(--ink)}",
      ".crx-bfp-sub{margin:10px auto 0;max-width:620px;color:#555;font-size:15px;line-height:1.5}",
      ".crx-bfp-n{margin:6px 0 0;color:#888;font-size:13px}",
      ".crx-bfp-note{max-width:820px;margin:0 auto 26px;border:2px solid #000;padding:14px 18px;font-size:15px;line-height:1.5;text-align:center}",

      ".crx-bfp-promo{display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:16px}",
      ".crx-bfp-howp{margin:6px 0 0;font-size:15px;line-height:1.5}.crx-bfp-fine{margin:4px 0 0;font-size:13px;line-height:1.45;opacity:.75}",
      ".crx-bfp-pkg{margin:0 0 56px;padding-bottom:48px;border-bottom:1px solid #eee}",
      ".crx-bfp-promo .crx-bfp-promo__t--neon b{font-size:15px;font-weight:800}",
      ".crx-bfp-promo__t--neon a.crx-bfp-promo__go{color:#000!important;text-decoration:none!important}",
      "@media(max-width:1024px){.crx-bfp-promo{grid-template-columns:1fr 1fr}}",
      ".crx-bfp-promo__t{display:flex;flex-direction:column;justify-content:flex-end;gap:6px;padding:28px;min-height:240px;text-decoration:none!important;color:inherit!important}",
      ".crx-bfp-promo__t b{font-size:20px;line-height:1.25}",
      ".crx-bfp-promo__t span{font-size:14px;line-height:1.45}",
      ".crx-bfp-promo__t--dark{background:#000;color:#fff!important}",
      ".crx-bfp-promo__t--dark .crx-d{font-size:96px;color:var(--neon);line-height:.85;margin-bottom:6px}",
      ".crx-bfp-promo__t--feat{background:#f4f4f4;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:20px}",
      ".crx-bfp-promo__t--feat>div{display:flex;flex-direction:column;gap:6px}",
      ".crx-bfp-promo__img{height:100%;min-height:190px;background:#fff center/contain no-repeat}",
      ".crx-bfp-promo__t--feat .crx-l{font-size:11px;color:var(--red)}",
      ".crx-bfp-promo__t--feat ins{text-decoration:none;color:var(--red);font-weight:900;font-size:30px;font-family:'Archivo',Arial,sans-serif}",
      ".crx-bfp-promo__t--feat del{color:#888;font-size:16px}",
      ".crx-bfp-promo__t--neon{background:var(--neon);color:#000!important}",
      ".crx-bfp-promo__t--neon .crx-l{font-size:11px}",
      ".crx-bfp-promo__go{margin-top:8px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:13px!important;border-bottom:2px solid #000;align-self:flex-start}",
      ".crx-bfp-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}",
      ".crx-bfp-grid .prod-card{position:relative;margin:0}",
      ".crx-bfp-more{display:block;margin:28px auto 40px;background:#000;color:#fff;border:0;height:50px;padding:0 30px;font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}",
      ".crx-bfp-foot{max-width:1328px;margin:0 auto;padding:32px 56px 56px;color:#555;font-size:14px;line-height:1.6}",
      ".crx-bfp-more--link{display:table;line-height:50px;height:auto;color:#fff!important;text-decoration:none!important;margin:28px auto 8px}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__grid{grid-template-columns:1fr}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile:nth-child(2){display:none}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile{aspect-ratio:21/8}",
      ".crx-hpr .crx-hpr__kicker{display:inline-block;background:#000;color:#E4FF3A;font-family:'Archivo',Arial,sans-serif;font-weight:800;font-size:12px;letter-spacing:.14em;padding:6px 10px;margin:0 0 12px}",
      ".crx-lrfs-mount .crx-lrfs .crx-lrfs__tile:first-child .crx-lrfs__tag{background:#fff;color:#000}",
      "@media(min-width:1025px){.crx-hpr__grid.crx-hpr__grid--n3{max-width:1000px}}",
      /* modern homepage rows: left header, See all link, grey square cards */
      ".crx-hpr .crx-hpr__head{flex-direction:row!important;justify-content:space-between!important;align-items:flex-end!important;text-align:left!important;border-bottom:2px solid #111;padding-bottom:16px;margin:0 auto 24px!important;gap:20px}",
      ".crx-hpr .crx-hpr__title{font-family:'Archivo',Arial,sans-serif!important;font-weight:900!important;font-style:italic;text-transform:uppercase;letter-spacing:-.02em;font-size:clamp(30px,3.4vw,44px)!important;line-height:.95!important}",
      ".crx-hpr .crx-hpr__sub{margin-top:8px!important}",
      ".crx-hpr__all{flex-shrink:0;font-family:'Archivo',Arial,sans-serif;font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#111!important;text-decoration:none!important;border-bottom:2px solid #111;padding-bottom:3px;margin-bottom:6px}",
      ".crx-hpr .prod-card .media-wrapper{position:relative;height:0;padding-bottom:100%!important;background:#F2F2EF!important;overflow:hidden}",
      ".crx-hpr .prod-card .media-wrapper img{position:absolute;inset:0;width:100%!important;height:100%!important;object-fit:contain!important;padding:9%;mix-blend-mode:multiply}",
      ".crx-hpr .prod-card .padding-sm{text-align:left!important;padding-left:0!important;padding-right:0!important}",
      ".crx-hpr-info{text-align:left;background:#000;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;padding:28px;aspect-ratio:1/1}",
      ".crx-hpr-info .crx-l{color:#E4FF3A;font-family:'Archivo',Arial,sans-serif;font-weight:800;font-size:12px;letter-spacing:.14em;text-transform:uppercase}",
      ".crx-hpr-info b{font-size:19px;line-height:1.3}.crx-hpr-info span:last-child{font-size:14px;opacity:.7}",
      /* deal bar under the hero */
      ".crx-bf-deals{width:100vw;margin-left:calc(50% - 50vw);background:#111}",
      ".crx-bf-deals__in{display:flex}",
      ".crx-bf-deals a{flex:1;display:flex;flex-direction:column;gap:4px;padding:16px 18px;border-right:1px solid #2a2a2a;color:#fff!important;text-decoration:none!important}",
      ".crx-bf-deals a:hover{background:#1c1c1c}",
      ".crx-bf-deals b{font-size:14px}.crx-bf-deals .crx-l{font-size:11px;color:var(--neon);min-height:13px}",
      /* winter storage as a split banner, photo darkened */
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs__header{display:none}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile{aspect-ratio:auto!important;height:400px}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile::after{display:none}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__img{width:52%;right:auto;filter:grayscale(.35) brightness(.62)}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__body{left:52%;right:0;top:0;bottom:0;background:#000;justify-content:center;padding:48px 56px;gap:14px}",
      ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__head{max-width:none;font-size:clamp(34px,4vw,60px);text-transform:uppercase}",
      ".crx-lrfs__more{font-size:17px;line-height:1.5;opacity:.85;max-width:440px}",
      /* homepage tiles */
      ".crx-bf-tiles{width:100vw;margin-left:calc(50% - 50vw);padding:24px 56px 40px}",
      ".crx-bf-tiles__in{max-width:1328px;margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}",
      ".crx-bf-tile{position:relative;text-align:left;aspect-ratio:4/5;overflow:hidden;background:#111 center/cover no-repeat;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;text-decoration:none!important;color:#fff!important}",
      ".crx-bf-tile::before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.9) 0%,rgba(0,0,0,.55) 40%,rgba(0,0,0,0) 75%)}",
      ".crx-bf-tile--dark{background:#0b0b0b}",
      ".crx-bf-tile--dark::before{background:none}",
      ".crx-bf-tile__prod{position:absolute;left:8%;right:8%;top:6%;height:38%;background:#fff center/contain no-repeat;border-radius:10px}",
      ".crx-bf-tile>*{position:relative}",
      ".crx-bf-tile .crx-l{align-self:flex-start;background:var(--neon);color:#000;font-size:11px;padding:5px 9px}",
      ".crx-bf-tile .crx-d{margin-top:12px;font-size:clamp(28px,2.6vw,40px);color:var(--neon)}",
      ".crx-bf-tile .crx-bf-tile__big{font-size:clamp(48px,5vw,76px);line-height:.9}",
      ".crx-bf-tile__line{margin-top:10px;font-size:17px;font-weight:700;line-height:1.35;max-width:320px}",
      ".crx-bf-tile span.crx-bf-go{margin-top:14px;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid var(--neon);align-self:flex-start;padding-bottom:2px}",
      /* tablet / phone */
      "@media(max-width:1024px){.crx-bf-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.crx-bf-hero__in{grid-template-columns:1fr}.crx-bf-hero__img{width:100%;opacity:.45}}",
      "@media(max-width:640px){.crx-bf-hero__in{padding:40px 16px 32px;gap:28px}.crx-bf-hero .crx-bf-lead{font-size:17px}",
        ".crx-bf-chips__in{padding:8px 16px}",
        ".crx-bf-sec{padding:40px 16px 4px}.crx-bf-sec__head{grid-template-columns:auto 1fr;gap:14px}.crx-bf-sec .crx-bf-n{display:none}",
        ".crx-bf-bib{width:64px;height:54px}.crx-bf-bib b{font-size:30px}",
        ".crx-bf-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}",
        ".crx-bf-grid .crx-bf-badge{font-size:10px;letter-spacing:.04em;padding:5px 7px;max-width:calc(100% - 16px)}",
        ".crx-bf-foot{padding:20px 16px 40px}",
        ".crx-bfp-head__in{grid-template-columns:1fr;padding:28px 16px 22px}.crx-bfp-lead{font-size:15px;margin-top:10px}",
        ".crx-bfp-jump{position:static}.crx-bfp-jump__in{flex-wrap:wrap;overflow:visible;padding:10px 12px;gap:6px}",
        ".crx-bfp-jump a{flex:1 1 calc(50% - 6px);font-size:13px;padding:9px 10px;border:1px solid #333;border-bottom:1px solid #333}",
        ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile{aspect-ratio:16/10}",
        ".crx-bfp-pkg{margin:0 0 32px;padding-bottom:32px}.crx-bfp-pkg .crx-bfp-promo{margin:0 16px}.crx-bfp-promo{grid-template-columns:1fr 1fr;gap:10px}.crx-bfp-promo__t--neon{grid-column:1/-1}.crx-bfp-promo__t{min-height:0;padding:22px}.crx-bfp-promo__t--dark .crx-d{font-size:56px}.crx-bfp-promo__t--dark b{font-size:16px}.crx-bfp-promo__img{min-height:140px}",
        ".crx-bfp-sec{padding:40px 0 4px}.crx-bfp-sec__head{padding:0 16px}.crx-bfp-note{margin:0 16px 20px;font-size:14px}",
        ".crx-bfp-grid{display:grid;grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:62%;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 16px 8px;scrollbar-width:none}",
        ".crx-bfp-grid::-webkit-scrollbar{display:none}.crx-bfp-grid .prod-card{scroll-snap-align:start}",
        ".crx-bfp-grid--all{grid-auto-flow:row;grid-template-columns:repeat(2,minmax(0,1fr));overflow:visible}",
        ".crx-bfp-grid .crx-bf-badge{font-size:10px;letter-spacing:.04em;padding:5px 7px;max-width:calc(100% - 16px)}",
        ".crx-bfp-more{margin:20px auto 32px}.crx-bfp-foot{padding:24px 16px 40px}",
        ".crx-bf-tiles{padding:16px 16px 28px}.crx-bf-tiles__in{grid-template-columns:1fr;gap:12px}.crx-bf-tile{aspect-ratio:4/3;padding:20px}.crx-bf-hero--home .crx-bf-sl{display:none}",
        ".crx-hpr .crx-hpr__head{margin:0 16px 16px!important;padding:0 0 12px!important;flex-direction:column!important;align-items:flex-start!important;gap:10px}",
        ".crx-hpr .crx-hpr__title{font-size:30px!important}.crx-hpr .crx-hpr__kicker{font-size:10px!important}.crx-hpr__all{font-size:11px;margin:0}",
        ".crx-hpr-info{aspect-ratio:auto;padding:22px}",
        ".crx-bf-deals__in{display:grid;grid-template-columns:1fr 1fr}.crx-bf-deals a{border-bottom:1px solid #2a2a2a;padding:12px 16px}",
        ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__tile{height:auto;display:flex;flex-direction:column}",
        ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__img{position:relative;width:100%;height:220px}",
        ".crx-lrfs-mount.crx-lrfs--solo .crx-lrfs .crx-lrfs__body{position:relative;left:auto;top:auto;bottom:auto;right:auto;padding:24px 20px}}"
    ].join("");
    document.head.appendChild(css);
  }

  /* ── helpers ── */
  function money(n) { return "C$" + Number(n).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function slugOf(u) { return String(u || "").split("?")[0].split("/").pop().replace(/\.html$/, ""); }
  function list(x) { return Array.isArray(x) ? x : Object.keys(x || {}).map(function (k) { return x[k]; }); }
  function getJSON(url) {
    return fetch(url + (url.indexOf("?") < 0 ? "?" : "&") + "format=json", { credentials: "same-origin" })
      .then(function (r) { return r.json(); });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function bib(no) { return '<div class="crx-bf-bib"><i style="left:7px;top:7px"></i><i style="right:7px;top:7px"></i><i style="left:7px;bottom:7px"></i><i style="right:7px;bottom:7px"></i><b>' + no + "</b></div>"; }

  function card(p, tag) {
    var price = p.price || {}, now = price.price, old = price.price_old;
    var slug = slugOf(p.url), url = "/" + p.url;
    var img = p.image ? CDN + p.image + "/300x400x1/image.jpg" : "";
    var img2 = p.image ? CDN + p.image + "/600x800x1/image.jpg" : "";
    var badge = "", cls = "prod-card";
    if (tag === "dc" && DC[slug]) {
      var dcp = old > now ? Math.round((1 - now / old) * 100) : 0;
      badge = DC[slug].sold ? "Sold" : "Black Friday" + (dcp > 20 ? " −" + dcp + "%" : "") + (DC[slug].one ? " · Only 1" : " · Final sale");
      cls += DC[slug].sold ? "" : " crx-bf-card";
    } else if (tag && old > now) {
      badge = tag === "plain" ? "Black Friday" : "Black Friday −" + Math.round((1 - now / old) * 100) + "%";
      cls += " crx-bf-card";
    }
    return '<div class="' + cls + '">' +
      (badge ? '<span class="prod-card__badge crx-bf-badge' + (DC[slug] && DC[slug].sold ? " crx-bf-badge--sold" : "") + '">' + esc(badge) + "</span>" : "") +
      '<div class="prod-card__img-wrapper"><a href="' + url + '" class="prod-card__img-link" aria-label="' + esc(p.title) + '">' +
      '<figure class="media-wrapper media-wrapper--3:4 bg-contrast-lower">' +
      (img ? '<img src="' + img + '" srcset="' + img + " 300w, " + img2 + ' 600w" sizes="(min-width: 400px) 300px, 150px" alt="' + esc(p.title) + '" loading="lazy">' : "") +
      "</figure></a></div>" +
      '<div class="padding-sm text-center"><h3 class="text-base margin-bottom-xs"><a href="' + url + '" class="product-card__title">' + esc(p.title) + "</a></h3>" +
      '<div class="margin-bottom-xs"><ins class="prod-card__price">' + money(now) + "</ins>" +
      (old > now ? ' <del class="prod-card__old-price">' + money(old) + "</del>" : "") + "</div></div></div>";
  }

  function loadSection(s) {
    var jobs = [];
    (s.sources || []).forEach(function (src) {
      jobs.push(getJSON(src + "?limit=100").then(function (d) { return list(d.collection && d.collection.products); }).catch(function () { return []; }));
    });
    (s.slugs || []).forEach(function (slug) {
      jobs.push(getJSON("/" + slug + ".html").then(function (d) { return d.product ? [d.product] : []; }).catch(function () { return []; }));
    });
    return Promise.all(jobs).then(function (lists) {
      var seen = {}, out = [];
      lists.forEach(function (l) {
        l.forEach(function (p) {
          var slug = slugOf(p.url);
          if (!p || seen[p.id]) return;
          if (s.keep && !s.keep.test(p.title || "")) return;
          if (s.drop && s.drop.test(p.title || "")) return;
          if (!p.image || NO_IMAGE.indexOf(p.image) > -1) return;           /* no photo: leave it off */
          if ((s.tag === true || s.tag === "plain" || s.saleOnly) && !(p.price && p.price.price_old > p.price.price)) return; /* not actually discounted */
          if (s.min && !(p.price && p.price.price_old > 0 && 1 - p.price.price / p.price.price_old >= s.min - 0.005)) return;
          if (s.skip && s.skip.test(slug)) return;
          if (s.id !== "door-crashers" && DC[slug]) return;
          seen[p.id] = 1; out.push(p);
        });
      });
      if (s.tag) out.sort(function (a, b) { return (b.price.price_old ? 1 - b.price.price / b.price.price_old : 0) - (a.price.price_old ? 1 - a.price.price / a.price.price_old : 0); });
      (s.pin || []).slice().reverse().forEach(function (slug) {
        for (var k = 0; k < out.length; k++) if (slugOf(out[k].url) === slug) { out.unshift(out.splice(k, 1)[0]); break; }
      });
      return out;
    });
  }

  function heroHTML(onPage) {
    var startList = SECTIONS.map(function (s, i) {
      return '<li><a href="' + (onPage ? "" : PAGE) + "#" + s.id + '"><span class="crx-bf-no">' + pad(i + 1) + '</span><span class="crx-bf-nm">' + esc(s.title.split(" · ")[0]) +
        '</span><span class="crx-bf-n" data-crx-bf-n="' + s.id + '"></span></a></li>';
    }).join("");
    var body = live
      ? '<p class="crx-bf-lead">In store and online.</p>' +
        '<div class="crx-bf-btns"><a class="crx-bf-btn crx-bf-btn--neon" href="' + PAGE + '">Shop the deals</a>' +
        '<a class="crx-bf-btn crx-bf-btn--ghost" href="' + PAGE + '#door-crashers">Door crashers</a></div>'
      : '<p class="crx-bf-lead">Friday, November 20.</p>' +
        '<div class="crx-bf-count" data-crx-bf-count></div>';
    return '<section class="crx-bf crx-bf-hero' + (onPage ? "" : " crx-bf-hero--home") + '"><div class="crx-bf-hero__img" style="background-image:url(' + HERO_IMG + ')"></div><div class="crx-bf-hero__fade"></div>' +
      '<div class="crx-bf-hero__in"><div><div class="crx-l crx-bf-kick">Nov 20–30 · All final sale</div><h1 class="crx-d">Black<br>Friday.</h1>' + body + "</div>" +
      (onPage ? '<div class="crx-bf-sl"><div class="crx-bf-sl__band crx-l"><span>Start list</span><span>' + SECTIONS.length + " categories</span></div><ol>" + startList + "</ol></div>" : "") +
      "</div></section>";
  }

  function countdown(el) {
    var t = Date.parse("2026-11-20T00:00:00-05:00");
    function tick() {
      var s = Math.max(0, Math.floor((t - Date.now()) / 1000));
      var parts = [[Math.floor(s / 86400), "days"], [Math.floor(s % 86400 / 3600), "hrs"], [Math.floor(s % 3600 / 60), "min"], [s % 60, "sec"]];
      el.innerHTML = parts.map(function (p) { return "<div><b>" + pad(p[0]) + "</b><span>" + p[1] + "</span></div>"; }).join("");
    }
    tick();
    var iv = setInterval(function () {
      tick();
      if (Date.now() >= t && !live) { clearInterval(iv); setTimeout(function () { location.reload(); }, 1500); }
    }, 1000);
  }

  var PKG = '<div class="crx-bfp-pkg"><div class="crx-bfp-sec__head"><span class="crx-l crx-bfp-up">Early season ski package sale</span>' +
    '<h2 class="crx-d">Ski packages</h2><p class="crx-bfp-sub">Nov 20–30, in store and online.</p></div>' +
    '<div class="crx-bfp-promo">' +
    '<div class="crx-bfp-promo__t crx-bfp-promo__t--dark"><span class="crx-d">30%</span><b>off full packages</b><span>Skis + boots + poles.</span></div>' +
    '<div class="crx-bfp-promo__t crx-bfp-promo__t--dark"><span class="crx-d">20%</span><b>off any combo</b><span>Any 2 of the 3, like skis + boots or skis + poles.</span></div>' +
    '<div class="crx-bfp-promo__t crx-bfp-promo__t--neon"><span class="crx-l">Ordering online?</span>' +
      '<p class="crx-bfp-howp">Add your skis, boots and poles to the cart and check out at the regular price. Once your order is in, we apply your package discount and refund the difference to your card.</p>' +
      '<p class="crx-bfp-fine">Club discounts don\'t stack. Single items don\'t qualify.</p>' +
      '<a class="crx-bfp-promo__go" href="/ski/">Shop all ski →</a></div>' +
    '</div></div>';

  /* ── landing page (no hero: label + jump bar, then one row per deal) ── */
  if (pageMount) {
    var secs = live ? SECTIONS : SECTIONS.filter(function (s) { return s.id !== "wahoo"; }); /* Wahoo joins Nov 20 */
    pageMount.innerHTML =
      '<div class="crx-bf crx-bfp">' +
      '<header class="crx-bfp-head"><div class="crx-bfp-head__in">' +
        '<div class="crx-l crx-bfp-kick">Nov 20–30 · In store &amp; online</div>' +
        '<h1 class="crx-d">Black Friday</h1>' +
        '<p class="crx-bfp-lead">All Black Friday items are final sale.</p>' +
      '</div></header>' +
      '<nav class="crx-bfp-jump"><div class="crx-bfp-jump__in">' + secs.map(function (s) {
        return '<a href="#' + s.id + '">' + esc(s.nav || s.title) + '<span data-crx-bf-up="' + s.id + '"></span></a>'; }).join("") + "</div></nav>" +
      secs.map(function (s) {
        return '<section class="crx-bfp-sec" id="' + s.id + '">' + (s.promo ? PKG : "") + '<div class="crx-bfp-sec__head">' +
          '<span class="crx-l crx-bfp-up" data-crx-bf-up2="' + s.id + '"></span>' +
          '<h2 class="crx-d">' + esc(s.title) + '</h2><p class="crx-bfp-sub">' + esc(s.sub).replace(/\n/g, "<br>") + '</p>' +
          '<p class="crx-bfp-n" data-crx-bf-n2="' + s.id + '"></p></div>' +

          '<div class="crx-bfp-grid"></div></section>';
      }).join("") +
      '<div class="crx-bfp-foot">All sale and Black Friday items are final sale. Free pickup at 1115 Bank Street, Ottawa, or we ship across Canada. ' +
      'Questions? <a href="mailto:sales@thecyclery.ca">sales@thecyclery.ca</a> · (613) 730-2856</div></div>';
    var cd = pageMount.querySelector("[data-crx-bf-count]");
    if (cd) countdown(cd);
    var box = pageMount.closest(".text-page__content");
    var head = box && box.previousElementSibling;
    if (head && head.tagName === "SECTION" && head.querySelector("h1")) head.style.display = "none";
    if (box) { box.style.paddingTop = "0"; box.style.maxWidth = "none"; }

    var smax = pageMount.querySelector("[data-crx-bf-smax]");
    if (smax) getJSON("/salomon-s-max-carbon-skate-mv-boot.html").then(function (d) {
      if (d.product && d.product.image) smax.style.backgroundImage = "url(" + CDN + d.product.image + "/600x600x1/image.jpg)";
    }).catch(function () {});

    secs.forEach(function (s) {
      var sec = pageMount.querySelector("#" + s.id), grid = sec.querySelector(".crx-bfp-grid");
      loadSection(s).then(function (items) {
        var n = items.length;
        var up = 0;
        items.forEach(function (p) { var o = p.price.price_old, v = p.price.price; if (o > v) up = Math.max(up, Math.round((1 - v / o) * 100)); });
        var upTxt = s.label ? s.label + (up > 20 ? " · Up to " + up + "% off" : "") : up ? "Up to " + up + "% off" : s.tag === false ? "Black Friday prices" : "";
        var u1 = pageMount.querySelector('[data-crx-bf-up="' + s.id + '"]'); if (u1) u1.textContent = up ? " −" + up + "%" : "";
        var u2 = sec.querySelector("[data-crx-bf-up2]"); if (upTxt) u2.textContent = upTxt; else u2.remove();
        sec.querySelector("[data-crx-bf-n2]").textContent = n ? n + (n === 1 ? " item" : " items") : "";
        if (!n) { grid.outerHTML = '<p class="crx-bf-empty">New deals going up. Check back soon, or ask us in store.</p>'; return; }
        var SHOW = 8;
        grid.innerHTML = items.slice(0, SHOW).map(function (p) { return card(p, s.tag); }).join("");
        if (n > SHOW || window.innerWidth <= 640 && n > 2) {
          var btn = document.createElement("button");
          btn.className = "crx-bfp-more"; btn.type = "button"; btn.textContent = "Show all " + n + " →";
          btn.onclick = function () {
            grid.insertAdjacentHTML("beforeend", items.slice(SHOW).map(function (p) { return card(p, s.tag); }).join(""));
            grid.className += " crx-bfp-grid--all"; btn.remove();
          };
          grid.after(btn);
        }
      });
    });
  }

  /* ── site-wide: tag the same products on every page (categories, search, product pages) ── */
  function paintAll(map) {
    Array.prototype.forEach.call(document.querySelectorAll(".prod-card:not(.crx-bf-card)"), function (c) {
      var a = c.querySelector('a[href$=".html"]'); if (!a) return;
      var t = map[slugOf(a.getAttribute("href"))]; if (!t) return;
      var b = c.querySelector(".prod-card__badge");
      if (!b) { b = document.createElement("span"); b.className = "prod-card__badge"; c.insertBefore(b, c.firstChild); }
      b.textContent = t; b.className += " crx-bf-badge"; b.style.display = "";
      c.className += " crx-bf-card";
    });
    var w = document.querySelector(".product__price-wrapper");
    var t2 = map[slugOf(location.pathname)];
    if (w && t2 && !document.querySelector(".crx-bf-badge--page")) {
      var pb = document.createElement("span"); pb.className = "crx-bf-badge crx-bf-badge--page"; pb.textContent = t2;
      w.parentNode.insertBefore(pb, w); w.className += " crx-bf-price";
    }
  }
  if (live && !pageMount) {
    var KEY = "crxBFmap1", cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}
    var ready = cached && Date.now() - cached.t < 30 * 60 * 1000 ? Promise.resolve(cached.m) :
      Promise.all(SECTIONS.filter(function (s) { return s.tag && s.tag !== "dc"; }).map(function (s) {
        return loadSection(s).then(function (items) { return items.map(function (p) {
          var o = p.price.price_old, n = p.price.price;
          return [slugOf(p.url), !(o > n) ? "" : s.tag === "plain" ? "Black Friday" : "Black Friday −" + Math.round((1 - n / o) * 100) + "%"];
        }); });
      })).then(function (lists) {
        var m = {}; lists.forEach(function (l) { l.forEach(function (x) { if (x[1]) m[x[0]] = x[1]; }); });
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), m: m })); } catch (e) {}
        return m;
      });
    ready.then(function (m) {
      paintAll(m);
      var timer; new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(function () { paintAll(m); }, 200); })
        .observe(document.body, { childList: true, subtree: true });
    });
  }

  /* ── announcement bar: neon + Black Friday text while live ── */
  if (live) {
    var bar = document.querySelector(".main-header__top-section");
    var msg = bar && bar.querySelector(".main-header__nav-grid > div");
    if (bar) { bar.style.background = "#E4FF3A"; bar.style.color = "#000"; Array.prototype.forEach.call(bar.querySelectorAll("a"), function (a) { a.style.color = "#000"; }); }
    if (msg) { msg.textContent = "BLACK FRIDAY · NOV 20–30 · SHOP THE DEALS →"; msg.style.fontWeight = "800"; msg.style.letterSpacing = ".06em"; }
  }

  /* ── homepage rows (Bont): header link + special-order card, once the row has loaded ── */
  function polishBont() {
    var m = document.querySelector(".crx-hp-bont-mount");
    var h = m && m.querySelector(".crx-hpr__head");
    if (!h) return false;
    if (!h.querySelector(".crx-hpr__all")) h.insertAdjacentHTML("beforeend", '<a class="crx-hpr__all" href="' + PAGE + '#bont">Shop Bont →</a>');
    var g = m.querySelector(".crx-hpr__grid");
    if (g && !g.querySelector(".crx-hpr-info")) {
      g.className = g.className.replace(/\s*crx-hpr__grid--n\d/g, "");
      g.insertAdjacentHTML("beforeend", '<div class="crx-hpr-info"><span class="crx-l">Special order</span>' +
        '<b>Every size, Standard and Wide. Not on the shelf? Order it by Nov 30.</b><span>Ready or shipped by Dec 24. Final sale.</span></div>');
    }
    return true;
  }
  if (isHome) { var pb = 0, pbt = setInterval(function () { if (polishBont() || ++pb > 40) clearInterval(pbt); }, 250); }

  /* ── homepage: Black Friday hero now (countdown), the rest from Nov 20 ── */
  if (isHome) {
    var slide = document.querySelector(".hero-slideshow");
    var hero = slide && (slide.closest("section") || slide);
    if (hero) {
      var dealSecs = SECTIONS.filter(function (x) { return live || x.id !== "wahoo"; });
      hero.insertAdjacentHTML("beforebegin", heroHTML(false) +
        '<nav class="crx-bf crx-bf-deals"><div class="crx-bf-deals__in">' + dealSecs.map(function (x) {
          return '<a href="' + PAGE + '#' + x.id + '"><b>' + esc(x.nav || x.title) + '</b><span class="crx-l" data-crx-bf-deal="' + x.id + '">' +
            (x.tag === false ? "BF prices" : "") + '</span></a>'; }).join("") + '</div></nav>');
      dealSecs.forEach(function (x) {
        if (x.tag === false) return;
        loadSection(x).then(function (items) {
          var up = 0;
          items.forEach(function (p) { var o = p.price.price_old, v = p.price.price; if (o > v) up = Math.max(up, Math.round((1 - v / o) * 100)); });
          var el = document.querySelector('[data-crx-bf-deal="' + x.id + '"]');
          if (el && up) el.textContent = (x.id === "bont" ? up + "% off" : "Up to " + (x.id === "clothing" ? Math.floor(up / 10) * 10 : up) + "% off");
        });
      });
      hero.style.display = "none";
      var cdh = document.querySelector(".crx-bf-hero--home [data-crx-bf-count]");
      if (cdh) countdown(cdh);
    }
    var bfHero = document.querySelector(".crx-bf-deals") || document.querySelector(".crx-bf-hero--home");
    if (bfHero) {
      var dcs = SECTIONS[0];
      bfHero.insertAdjacentHTML("afterend",
        '<div class="crx-bf crx-bf-homedc"><section class="crx-hpr" id="crx-bf-home-dc"><div class="crx-hpr__head"><div>' +
        '<p class="crx-hpr__kicker">One-off frames &amp; bikes<span data-crx-bf-dcup></span></p><h2 class="crx-hpr__title">Door crashers</h2>' +
        '</div><a class="crx-hpr__all" href="' + PAGE + '#door-crashers">See all →</a></div><div class="crx-hpr__grid"></div></section></div>' +
        (live ? '<section class="crx-bf crx-bf-tiles"><div class="crx-bf-tiles__in">' + TILES.map(function (t, i) {
          return '<a class="crx-bf-tile" href="' + t.url + '" style="background-image:url(' + t.img + ')">' +
            '<span class="crx-l">' + esc(t.tag) + '</span><span class="crx-d crx-bf-tile__big" data-crx-bf-tile="' + i + '">' + esc(t.big) + '</span>' +
            '<span class="crx-bf-tile__line">' + esc(t.line) + '</span><span class="crx-bf-go">' + esc(t.cta) + "</span></a>";
        }).join("") + "</div></section>" : ""));
      loadSection(dcs).then(function (items) {
        var g = document.querySelector("#crx-bf-home-dc .crx-hpr__grid");
        var up = 0;
        items.forEach(function (p) { var o = p.price.price_old, v = p.price.price; if (o > v) up = Math.max(up, Math.round((1 - v / o) * 100)); });
        if (up > 20) document.querySelector("[data-crx-bf-dcup]").textContent = " · Up to " + up + "% off";
        if (!items.length) { document.getElementById("crx-bf-home-dc").style.display = "none"; return; }
        g.innerHTML = items.slice(0, 4).map(function (p) { return card(p, dcs.tag); }).join("");
      });
      if (live) TILES.forEach(function (t, i) {
        if (false) getJSON("/" + t.product + ".html").then(function (d) {
          var el = document.querySelector('[data-crx-bf-prod="' + i + '"]');
          if (el && d.product && d.product.image) el.style.backgroundImage = "url(" + CDN + d.product.image + "/600x600x1/image.jpg)";
        }).catch(function () {});
        if (t.up) loadSection(SECTIONS.filter(function (x) { return x.id === t.up; })[0]).then(function (items) {
          var up = 0;
          items.forEach(function (p) { var o = p.price.price_old, v = p.price.price; if (o > v) up = Math.max(up, Math.round((1 - v / o) * 100)); });
          var h = document.querySelector('[data-crx-bf-tile="' + i + '"]');
          if (h && up > 20) h.textContent = "−" + Math.floor(up / 10) * 10 + "%";
        });
      });
      /* winter storage tile goes big on its own; the ski tile is covered above */
      var lr = live && document.querySelector(".crx-lrfs-mount");
      if (lr) {
        lr.className += " crx-lrfs--solo";
        var lt = lr.querySelector(".crx-lrfs__title"); if (lt) lt.textContent = "Winter bike storage";
        var ls = lr.querySelector(".crx-lrfs__sub"); if (ls) ls.textContent = "Store your bike for the winter and pick it up tuned and ready on April 1.";
        var lb = lr.querySelector(".crx-lrfs__tile .crx-lrfs__body"), lc = lb && lb.querySelector(".crx-lrfs__cta");
        if (lc && !lb.querySelector(".crx-lrfs__more")) lc.insertAdjacentHTML("beforebegin", '<span class="crx-lrfs__more">Level 2 Tune included. Pick it up tuned and ready on April 1.</span>');
      }
    }
  }
}
