document.addEventListener("DOMContentLoaded", function () {
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
              <label>Don’t fill this out: <input name="bot-field"></label>
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
              <input name="brand" type="text" placeholder="Factor, etc.">
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
    .crx-rqnl__status{margin:0;font-weight:800}
    .crx-rqnl__frame{width:0;height:0;border:0;position:absolute;opacity:0}
    .crx-rqnl__hp{display:none}
  `;
  document.head.appendChild(style);

  const openBtn = mount.querySelector(".crx-rqnl__open");
  const modal = mount.querySelector(".crx-rqnl__modal");
  const form = mount.querySelector(".crx-rqnl__form");
  const status = mount.querySelector(".crx-rqnl__status");
  const iframe = mount.querySelector(".crx-rqnl__frame");

  function open() { modal.classList.add("crx-rqnl__modal--open"); modal.setAttribute("aria-hidden","false"); }
  function close() { modal.classList.remove("crx-rqnl__modal--open"); modal.setAttribute("aria-hidden","true"); }

  openBtn.addEventListener("click", open);
  mount.addEventListener("click", (e) => { if (e.target.closest("[data-crx-close]")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  form.addEventListener("submit", () => { status.textContent = "Sending…"; });

  iframe.addEventListener("load", () => {
    status.textContent = "Sent ✔";
    form.reset();
  });

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
});