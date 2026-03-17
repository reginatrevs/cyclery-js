document.addEventListener("DOMContentLoaded", function () {
  crxInitRequestModal();
  crxInitHomeBikes();
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