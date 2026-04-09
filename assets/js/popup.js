const manifest = chrome.runtime.getManifest();

const version = manifest.version || "unknown";
const author = manifest.author || "unknown";

document.getElementById("meta").textContent =
  `Version ${version} • by ${author}`;