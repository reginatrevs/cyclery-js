document.addEventListener("DOMContentLoaded", function () {
  // Only run where you place the mount
  const mount = document.querySelector(".crx-brandhub-mount");
  if (!mount) return;

  // Update these to your real priority brands
  const brands = [
    { name: "Specialized", href: "/search?search=Specialized" },
    { name: "Trek", href: "/search?search=Trek" },
    { name: "Cannondale", href: "/search?search=Cannondale" },
    { name: "Santa Cruz", href: "/search?search=Santa%20Cruz" },
    { name: "Cervélo", href: "/search?search=Cerv%C3%A9lo" },
    { name: "Bianchi", href: "/search?search=Bianchi" }
  ];

  mount.innerHTML = `
    <section class="crx-brandhub" aria-label="Bike brands">
      <div class="crx-brandhub__head">
        <div class="crx-brandhub__text">
          <h2 class="crx-brandhub__title">Premium Bike Brands</h2>
          <p class="crx-brandhub__subtitle">
            High-end builds, fit-ready bikes, and full service in Ottawa.
          </p>
        </div>
        <a class="crx-brandhub__cta" href="/bike-brands">View all</a>
      </div>

      <div class="crx-brandhub__grid">
        ${brands
          .map(
            (b) => `
          <a class="crx-brandhub__chip" href="${b.href}">
            <span class="crx-brandhub__chipText">${b.name}</span>
          </a>`
          )
          .join("")}
      </div>
    </section>
  `;

  // Scoped styles
  const style = document.createElement("style");
  style.textContent = `
    .crx-brandhub { margin: 18px 0 8px; }
    .crx-brandhub__head {
      display:flex;
      justify-content:space-between;
      gap:14px;
      align-items:flex-end;
      margin: 0 0 12px;
    }
    .crx-brandhub__title { margin:0; font-size:18px; line-height:1.15; }
    .crx-brandhub__subtitle { margin:6px 0 0; opacity:.78; max-width:58ch; }
    .crx-brandhub__cta { text-decoration:none; font-weight:700; white-space:nowrap; }

    .crx-brandhub__grid { display:flex; flex-wrap:wrap; gap:10px; }
    .crx-brandhub__chip {
      display:inline-flex;
      align-items:center;
      border: 1px solid rgba(0,0,0,.14);
      border-radius: 999px;
      padding: 8px 12px;
      text-decoration:none;
      transition: transform .12s ease;
    }
    .crx-brandhub__chip:hover { transform: translateY(-1px); }
    .crx-brandhub__chipText { font-weight: 650; }
  `;
  document.head.appendChild(style);
}); 
