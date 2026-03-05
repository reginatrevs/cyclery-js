document.addEventListener("DOMContentLoaded", function () {
  console.log("[CRX] loaded");

  const mount = document.querySelector(".crx-brandhub-mount");
  console.log("[CRX] mount?", mount);

  if (!mount) return;

  mount.innerHTML = `
    <section class="crx-brandhub">
      <h2 class="crx-brandhub__title">Premium Bike Brands</h2>
      <p class="crx-brandhub__subtitle">If you see this, JS injection works on this page.</p>
      <div class="crx-brandhub__grid">
        <a class="crx-brandhub__chip" href="/search?search=Specialized">Specialized</a>
        <a class="crx-brandhub__chip" href="/search?search=Trek">Trek</a>
        <a class="crx-brandhub__chip" href="/search?search=Cannondale">Cannondale</a>
      </div>
    </section>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .crx-brandhub{margin:18px 0 8px;border:1px solid rgba(0,0,0,.12);border-radius:14px;padding:14px}
    .crx-brandhub__title{margin:0;font-size:18px}
    .crx-brandhub__subtitle{margin:6px 0 10px;opacity:.8}
    .crx-brandhub__grid{display:flex;flex-wrap:wrap;gap:10px}
    .crx-brandhub__chip{display:inline-flex;align-items:center;border:1px solid rgba(0,0,0,.14);border-radius:999px;padding:8px 12px;text-decoration:none;font-weight:650}
  `;
  document.head.appendChild(style);

  console.log("[CRX] injected");
}); 