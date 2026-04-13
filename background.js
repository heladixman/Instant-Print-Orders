/*!
 * Instant Print Tokopedia/Shopee Orders
 * Copyright (c) 2026 Hela Dixman
 * Licensed under CC BY-NC (NonCommercial)
 */

chrome.commands.onCommand.addListener(async (command) => {
  console.log("Command:", command);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (
    !tab.url ||
    (!tab.url.includes("seller-id.tokopedia.com/order/") &&
     !tab.url.includes("seller.shopee.co.id/portal/sale/order/")) ||
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("edge://") ||
    tab.url.startsWith("about:")
  ) {
    notification();
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (cmd) => {
      window.autoPrintHandler?.(cmd);
    },
    args: [command]
  });

});

function notification() {
  chrome.notifications.create("auto-print", {
    type: "basic",
    iconUrl: "assets/icons/icon-128.png",
    title: "Auto Print",
    message: "Can only be used on Tokopedia or Shopee Seller Center"
  });
}

async function checkForUpdate() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/heladixman/Instant-Print-Orders/main/version.json");
    const data = await res.json();

    const currentVersion = chrome.runtime.getManifest().version;

    if (data.version !== currentVersion) {
      await chrome.storage.local.set({
        updateAvailable: true,
        updateData: data
      });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "/assets/icons/icon-128.png",
        title: "Update Available",
        message: `Version ${data.version} available`
      });
    }
  } catch (err) {
    console.log("Update check failed:", err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  checkForUpdate();
});

setInterval(checkForUpdate, 1000 * 60 * 60 * 6);