/*!
 * Instant Print Tokopedia/Shopee Orders
 * Copyright (c) 2026 Hela Dixman
 * Licensed under CC BY-NC (NonCommercial)
 */

(() => {
  let odpParent = null, odpNext = null;

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const toggle = el => el?.classList.toggle("auto-hide-print");

  const wait = (n = 7) =>
    new Promise(r => {
      let i = 0;
      const loop = () => (++i >= n ? r() : requestAnimationFrame(loop));
      loop();
    });

  const toggleBatch = sels => sels.forEach(s => $$(s).forEach(toggle));

  const injectStyle = () => {
    if ($("#auto-print-style")) return;

    toggle($(".sidebar-panel"));
    $(".eds-col.eds-col-6.od-history")?.classList.add("auto-hide-print");

    const pc = $(".page-container.static-container.has-sidebar-panel");
    if (pc) pc.style.paddingRight = "24px";

    const col = $(".eds-col.eds-col-18");
    if (col) {
      col.style.width = "100%";

      [...col.children].slice(-3).forEach(el => el.classList.add("auto-hide-print"));

      const odp = $('[data-testid="odp-buyer-user"]', col);
      if (odp) {
        odpParent = odp.parentElement;
        odpNext = odp.nextSibling;
        col.prepend(odp);
      }

      if (col.children.length >= 3) {
        const wrap = document.createElement("div");
        Object.assign(wrap, {
          className: "eds-card card-style",
          style: "display:flex;justify-content:space-between;flex-flow:row-reverse;margin:-16px 0"
        });
        wrap.dataset.printWrapper = "true";

        const acc = $(".account-info");
        if (acc) {
          const box = document.createElement("div");
          box.className = "eds-card card-style";
          box.setAttribute("data-v-afb3d409", "");
          box.setAttribute("data-v-6bcf98ed", "");
          box.setAttribute("data-v-11c9a1db", "");
          box.dataset.testid = "odp-seller-user";
          box.append(acc.cloneNode(true));
          wrap.append(box);
        }

        [...col.children].slice(0, 3).forEach(el => wrap.append(el));
        col.prepend(wrap);
      }
    }

    toggle($(".header-bar.shopee-header-bar"));
    toggleBatch([".next", ".user-view-item.linkable div.button-box"]);

    document.head.insertAdjacentHTML("beforeend", `
      <style id="auto-print-style">
        .auto-hide-print{display:none!important}
        .page-container.static-container.has-sidebar-panel{padding-right:24px!important}
        .eds-col.eds-col-18{width:100%!important}
        .hidden{visibility:hidden!important}
        .product-item .product-image{height:120px!important;flex:0 0 120px!important}
        [data-testid="order-detail-status"]{width:50%!important}
        [data-testid="odp-buyer-user"],[data-testid="odp-seller-user"]{width:25%!important}
        .product-detail{align-self:baseline!important}
        .app-container{padding-top:12px!important}
      </style>
    `);
  };

  const removeStyle = () => {
    $("#auto-print-style")?.remove();

    toggle($(".sidebar-panel"));
    $(".eds-col.eds-col-6.od-history")?.classList.remove("auto-hide-print");

    const pc = $(".page-container.static-container.has-sidebar-panel");
    if (pc) pc.style.paddingRight = "";

    const col = $(".eds-col.eds-col-18");
    if (col) {
      col.style.width = "";

      const wrap = $('[data-print-wrapper="true"]', col);
      if (wrap) {
        [...wrap.children].forEach(c =>
          c.dataset.testid === "odp-seller-user"
            ? c.remove()
            : col.insertBefore(c, wrap)
        );
        wrap.remove();
      }

      const odp = $('[data-testid="odp-buyer-user"]', col);
      if (odp && odpParent) {
        odpNext ? odpParent.insertBefore(odp, odpNext) : odpParent.appendChild(odp);
        odpParent = odpNext = null;
      }
    }

    toggle($(".header-bar.shopee-header-bar"));
    toggleBatch([".next", ".user-view-item.linkable div.button-box"]);
  };

  const autoPrint = async () => {
    injectStyle();
    await wait();
    window.print();
  };

  window.autoPrintHandler = async cmd => {
    if (cmd === "auto-print") return autoPrint();
    if (cmd === "undo-print") return removeStyle();
  };
})();