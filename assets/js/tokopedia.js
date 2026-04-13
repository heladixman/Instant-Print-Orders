/*!
 * Instant Print Tokopedia/Shopee Orders
 * Copyright (c) 2026 Hela Dixman
 * Licensed under CC BY-NC (NonCommercial)
 */

(function () {
  const shippingInfo = "1dej3gv";
  let isCleaned = false;
  let isStyleInjected = false;

  const wait = async (n = 7) => {
    for (let i = 0; i < n; i++) await new Promise(requestAnimationFrame);
  }

  const clickAll = (els) =>
    els.forEach(el => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));

  const clickByText = (selector, openText, closeText, mode) => {
    const els = [...document.querySelectorAll(selector)];

    if (!mode) {
      const isOpen = els.some(el => el.textContent.includes(closeText));
      mode = isOpen ? "close" : "open";
    }

    const targets = els.filter(el =>
      el.textContent.includes(mode === "open" ? openText : closeText)
    );

    clickAll(targets);
    return wait();
  };

  async function injectPageHeader() {
    if (document.querySelector('[data-print-clone="badge"]')) return;

    const badge = document.querySelectorAll('[data-tid="m4b_badge"]')[4];
    const invoiceNumber = document.querySelector('.p-page-header-title');

    const target = document.querySelector('.p-page-header-head');
    const parent = document.querySelector('.p-page-header-head-main').classList.add("auto-print-hide");
    if (!badge || !invoiceNumber || !target) return;

    [...target.children].forEach(c => {
      c.classList.add("auto-print-hide");
      c.dataset.autoHidden = "true";
    });

    const wrapper = document.createElement("div");
    const badgeClone = badge.cloneNode(true);
    const invoiceClone = invoiceNumber.cloneNode(true);

    wrapper.appendChild(badgeClone);
    wrapper.appendChild(invoiceClone);
    wrapper.dataset.printClone = "badge";

    target.appendChild(wrapper);
  }

  const removeBadge = () =>
    document.querySelectorAll('[data-print-clone="badge"]').forEach(el => el.remove());

  async function orderHistory() {
    const el = document.querySelectorAll("._card_1a706_6")[2];
    if (el) {
      el.classList.add("auto-print-hide");
      el.dataset.autoHidden = "true";
    }
    await wait();
  }

  async function customerInformation(mode) {
    if (!mode) {
      mode = document.querySelector('svg[data-log_click_for="close_phone_plaintext"]')
        ? "close"
        : "open";
    }

    const attr = `${mode}_phone_plaintext`;
    const icons = document.querySelectorAll(`svg[data-log_click_for="${attr}"]`);

    for (const icon of [...icons].slice(0, 3)) {
      icon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await wait();
    }
  }

  const injectStyle = () => {
    if (document.getElementById("auto-print-style")) return;
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="auto-print-style">
        .auto-print-hide{display:none!important}
        .p-badge div div .p-space-item span{color: black;}
        .p-page-header-title{width:auto}
        div[data-print-clone="badge"] {width:auto;justify-items:right;}
        .p-page-header-title{width:auto!important}
        .hidden{visibility:hidden!important}
        .p-page-header-head{display:block!important}
        ._image_dgltq_1{width: 100px !important; height: 100px !important;}
        ._image_dgltq_1 div.p-image{width: 100px !important; height: 100px !important;}
        .sc-ccVCaX.eiYAtb div{word-break: normal!important;-webkit-line-clamp: 6!important;}
      </style>`
    );
    isStyleInjected = true;
  };

  const removeInjectStyle = () => {
    const styleEl = document.getElementById("auto-print-style");
    if (styleEl) {
      styleEl.remove();
      isStyleInjected = false;
    }
  };

  async function autoPrintHide() {
    await customerInformation();
    await clickByText("div.cursor-pointer", "Tampilkan Detil", "Sembunyikan Detil", "open");
    await orderHistory();
    await injectPageHeader();
    await clickByText(
      "div.sc-ccVCaX.jQDyvt",
      "Tampilkan produk lainnya",
      "Sembunyikan",
      "open"
    );

    injectStyle();
    
    [
      "header",
      "aside",
      "#sidebar-placeholder",
      "div.p-callout.p-callout-info.p-callout-title",
      `div.p-callout.p-callout-info[data-v="${shippingInfo}"]`
    ].forEach(sel =>
      document.querySelectorAll(sel).forEach(el =>
        el.classList.add("auto-print-hide")
      )
    );

    isCleaned = true;
    await wait();
    window.print();
  }

  async function restorePage() {
    await customerInformation();
    await clickByText("div.cursor-pointer", "Tampilkan Detil", "Sembunyikan Detil");
    await clickByText("div.sc-ccVCaX.jQDyvt", "Tampilkan produk lainnya", "Sembunyikan");
    removeBadge();  
    removeInjectStyle();

    document.querySelectorAll(".auto-print-hide")
      .forEach(el => el.classList.remove("auto-print-hide"));

    isCleaned = false;
  }

  async function detailInformation() {
    await customerInformation();
    await clickByText("div.cursor-pointer", "Tampilkan Detil", "Sembunyikan Detil");
    await clickByText("div.sc-ccVCaX.jQDyvt", "Tampilkan produk lainnya", "Sembunyikan");
  }

  async function handleCommand(cmd) {
    if (cmd === "auto-print") await autoPrintHide();
    if (cmd === "detail-information") await detailInformation();
    if (cmd === "undo-print") restorePage();
  }

  window.autoPrintHandler = handleCommand;
})();