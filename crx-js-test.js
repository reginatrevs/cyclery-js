document.addEventListener("DOMContentLoaded", function () {
  const mount = document.querySelector(".crx-brandmarquee-mount");
  if (!mount) return;

  // Edit these (keep it ~8–14 per row for a clean look)
  const row1 = [
    { label: "Specialized", href: "/search?search=Specialized" },
    { label: "Trek", href: "/search?search=Trek" },
    { label: "Cannondale", href: "/search?search=Cannondale" },
    { label: "Santa Cruz", href: "/search?search=Santa%20Cruz" },
    { label: "Cervélo", href: "/search?search=Cerv%C3%A9lo" },
    { label: "Bianchi", href: "/search?search=Bianchi" }
  ];

  const row2 = [
    { label: "Gravel", href: "/search?search=Gravel" },
    { label: "Road", href: "/search?search=Road" },
    { label: "MTB", href: "/search?search=Mountain" },
    { label: "eBike", href: "/search?search=eBike" },
    { label: "Bike Fit", href: "/service-labour/" },
    { label: "Custom Builds", href: "/bike-builds/" }
  ];

  const renderItem = (item) => {
    // label-only pill (like your reference)
    return `
      <a class="crx-marq__pill" href="${item.href}">
        <span class="crx-marq__pillText">${item.label}</span>
      </a>
    `;
  };

  const makeTrack = (items, directionClass) => {
    // Duplicate to create seamless loop
    const content = items.map(renderItem).join("");
    return `
      <div class="crx-marq__row ${directionClass}">
        <div class="crx-marq__track" aria-hidden="false">
          ${content}${content}
        </div>
      </div>
    `;
  };

  mount.innerHTML = `
    <section class="crx-marq" aria-label="Premium bike brands marquee">
      <div class="crx-marq__head">
        <h2 class="crx-marq__title">Premium bike brands, built in Ottawa</h2>
        <a class="crx-marq__cta" href="/bike-brands">View all</a>
      </div>
      <div class="crx-marq__wrap">
        ${makeTrack(row1, "crx-marq__row--left")}
        ${makeTrack(row2, "crx-marq__row--right")}
      </div>
    </section>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .crx-marq{margin:18px 0 10px}
    .crx-marq__head{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;margin:0 0 12px}
    .crx-marq__title{margin:0;font-size:18px;line-height:1.15}
    .crx-marq__cta{text-decoration:none;font-weight:700;white-space:nowrap}

    .crx-marq__wrap{
      border:1px solid rgba(0,0,0,.10);
      border-radius:16px;
      padding:12px;
      overflow:hidden;
      background: rgba(0,0,0,.02);
    }

    .crx-marq__row{overflow:hidden}
    .crx-marq__row + .crx-marq__row{margin-top:10px}

    .crx-marq__track{
      display:flex;
      width:max-content;
      gap:10px;
      align-items:center;
      animation-duration: 26s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      will-change: transform;
    }

    /* Opposite directions */
    .crx-marq__row--left .crx-marq__track{ animation-name: crx-marq-left; }
    .crx-marq__row--right .crx-marq__track{ animation-name: crx-marq-right; }

    @keyframes crx-marq-left{
      from{ transform: translateX(0); }
      to{ transform: translateX(-50%); }
    }
    @keyframes crx-marq-right{
      from{ transform: translateX(-50%); }
      to{ transform: translateX(0); }
    }

    .crx-marq__pill{
      display:inline-flex;
      align-items:center;
      border:1px solid rgba(0,0,0,.16);
      background: rgba(255,255,255,.72);
      border-radius: 999px;
      padding: 10px 14px;
      text-decoration:none;
      backdrop-filter: blur(6px);
      transition: transform .12s ease;
      white-space:nowrap;
    }
    .crx-marq__pill:hover{ transform: translateY(-1px); }
    .crx-marq__pillText{ font-weight:650; letter-spacing:.2px; }

    /* Respect reduced motion */
    @media (prefers-reduced-motion: reduce){
      .crx-marq__track{ animation: none; }
    }
  `;
  document.head.appendChild(style);
});