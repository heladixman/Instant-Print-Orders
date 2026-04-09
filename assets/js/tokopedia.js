/*!
 * Instant Print Tokopedia/Shopee Orders
 * Copyright (c) 2026 Hela Dixman
 * Licensed under CC BY-NC (NonCommercial)
 */

(function () {
  console.log("Auto Clean Script Loaded");

  const shippingInfo = "1dej3gv";

  let isCleaned = false;

  async function waitForRender() {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  }

  async function injectPrintBadge() {
    if (document.querySelector('[data-print-clone="badge"]')) return;

    const badges = document.querySelectorAll('[data-tid="m4b_badge"]');
    const badge = badges[4];

    const target = document.querySelector('.p-page-header-head-extra');
    
    Array.from(target.children).forEach(child => {
      child.classList.add("auto-print-hide");
      child.setAttribute("data-auto-hidden", "true");
    });

    if (!badge || !target) return;

    const clone = badge.cloneNode(true);
    clone.setAttribute("data-print-clone", "badge");

    target.appendChild(clone);
  }

  async function removePrintBadge() {
    document.querySelectorAll('[data-print-clone="badge"]')
      .forEach(el => el.remove());
  }

  async function hideThirdCard() {
    const cards = document.querySelectorAll("._card_1a706_6");

    if (cards[2]) {
      cards[2].classList.add("auto-print-hide");
      cards[2].setAttribute("data-auto-hidden", "true");
    }

    await waitForRender();
  }

  async function productDetail(mode) {
    const elements = [...document.querySelectorAll("div.sc-ccVCaX.jQDyvt")];

    if (!mode) {
      const isOpen = elements.some(el => el.textContent.includes("Sembunyikan"));
      mode = isOpen ? "close" : "open";
    }

    const targets = elements.filter(el => {
      const text = el.textContent.trim();
      return mode === "open"
        ? text.includes("Tampilkan produk lainnya")
        : text.includes("Sembunyikan");
    });

    targets.forEach(el => {
      el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitForRender();
  }

  async function paymentDetail(mode) {
    const elements = [...document.querySelectorAll("div.cursor-pointer")];

    if (!mode) {
      const isOpen = elements.some(el =>el.textContent.includes("Sembunyikan Detil"));
      mode = isOpen ? "close" : "open";
    }

    const targets = elements.filter(el => {
      const text = el.textContent.trim();
      return mode === "open"
        ? text.includes("Tampilkan Detil")
        : text.includes("Sembunyikan Detil");
    });

    targets.forEach(el => {
      el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitForRender();
  }

  async function toggleData(mode) {

    if (!mode) {
      const isOpen = !!document.querySelector('svg[data-log_click_for="close_phone_plaintext"]');
      mode = isOpen ? "close" : "open";
    }

    const attr =
      mode === "open"
        ? "open_phone_plaintext"
        : "close_phone_plaintext";

    while (true) {
      const icon = document.querySelector(
        `svg[data-log_click_for="${attr}"]`
      );

      if (!icon) {
        console.log(`Semua ${mode} selesai`);
        break;
      }

      icon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      console.log(`${mode} clicked:`, icon);

      await waitForRender();
    }
  }

  function injectStyle() {
    if (document.getElementById("auto-print-style")) return;

    const style = document.createElement("style");
    style.id = "auto-print-style";
    style.innerHTML = `
      .auto-print-hide {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  async function autoPrintHide() {
    await injectPrintBadge();
    await toggleData();
    await paymentDetail();
    await hideThirdCard();
    await productDetail();

    injectStyle();

    const selectors = [
      "header",
      "aside",
      "#sidebar-placeholder",
      "div.p-callout.p-callout-info.p-callout-title",
      `div.p-callout.p-callout-info:where([data-v="${shippingInfo}"])`
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add("auto-print-hide");
      });
    });

    isCleaned = true;
    console.log("Clean Mode: On");
  }

  async function restorePage() {
    await toggleData();
    await paymentDetail();
    await productDetail();
    await removePrintBadge();
    document.querySelectorAll(".auto-print-hide").forEach(el => {
      el.classList.remove("auto-print-hide");
    });

    isCleaned = false;
    console.log("Clean Mode: Off");
  }

  async function handleCommand(command) {
    if (command === "auto-print") {
      await autoPrintHide();
      await waitForRender();
      window.print();
    }

    if (command === "detail-information") {
      await toggleData();
      await paymentDetail();
      await productDetail();
    }

    if (command === "undo-print") {
      restorePage();
    }
  }

  window.autoPrintHandler = handleCommand;
})();