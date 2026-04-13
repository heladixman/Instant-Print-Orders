const manifest = chrome.runtime.getManifest();

const version = manifest.version || "unknown";
const author = manifest.author || "unknown";

document.getElementById("meta").textContent = `Version ${version} • by ${author}`;

// Command descriptions
const commandDescriptions = {
  "auto-print": {
    title: "Clean and Print",
    description: "Clean pages and print"
  },
  "undo-print": {
    title: "Undo Page",
    description: "Restore the original page view"
  },
  "detail-information": {
    title: "Show / Hide Information",
    description: "Show or Hide details"
  }
};

// Load and display shortcuts from browser
async function loadShortcuts() {
  try {
    const commands = await chrome.commands.getAll();
    const shortcutsContainer = document.getElementById("shortcutsContainer");
    const shortcutsSettings = document.getElementById("shortcutsSettings");
    
    if (!shortcutsContainer) {
      console.error("shortcutsContainer element not found");
      return;
    }

    shortcutsContainer.innerHTML = "";
    
    if (shortcutsSettings) {
      shortcutsSettings.innerHTML = "";
    }

    commands.forEach(cmd => {
      if (cmd.name.startsWith("_")) {
        return;
      }

      const desc = commandDescriptions[cmd.name] || {};
      const shortcut = cmd.shortcut || "Not set";

      // Add to shortcuts display tab
      const commandDiv = document.createElement("div");
      commandDiv.className = "command";
      commandDiv.innerHTML = `
        <div>
          <h3>${desc.title || cmd.name}</h3>
          <p>${desc.description || cmd.description}</p>
        </div>
        <span class="shortcut">${shortcut}</span>
      `;
      shortcutsContainer.appendChild(commandDiv);

      // Add to settings tab if element exists
      if (shortcutsSettings) {
        const settingDiv = document.createElement("div");
        settingDiv.className = "shortcut-setting";
        settingDiv.innerHTML = `
          <label>${desc.title || cmd.name}</label>
          <div class="shortcut-input-group">
            <input type="text" class="shortcut-display" value="${shortcut}" readonly>
          </div>
        `;
        shortcutsSettings.appendChild(settingDiv);
      }
    });
  } catch (err) {
    console.error("Failed to load shortcuts:", err);
    const container = document.getElementById("shortcutsContainer");
    if (container) {
      container.innerHTML = "<p>Failed to load shortcuts</p>";
    }
  }
}

// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab");
    
    // Remove active from all tabs and buttons
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    
    // Add active to clicked tab
    btn.classList.add("active");
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
      targetTab.classList.add("active");
    }
  });
});

// Load changelog
async function loadChangelog() {
  try {
    const changelogList = document.getElementById("changelogList");
    if (!changelogList) {
      console.error("changelogList element not found");
      return;
    }

    const res = await fetch("https://raw.githubusercontent.com/heladixman/Instant-Print-Orders/main/version.json");
    const data = await res.json();
    
    changelogList.innerHTML = "";
    
    if (data.history && data.history.length > 0) {
      data.history.forEach(release => {
        const releaseDiv = document.createElement("div");
        releaseDiv.className = "release";
        releaseDiv.innerHTML = `
          <h4>${release.version} - ${release.date}</h4>
          <ul>
            ${release.changes.map(change => `<li>${change}</li>`).join("")}
          </ul>
        `;
        changelogList.appendChild(releaseDiv);
      });
    }
  } catch (err) {
    console.error("Failed to load changelog:", err);
    const changelogList = document.getElementById("changelogList");
    if (changelogList) {
      changelogList.innerHTML = "<p>Failed to load changelog</p>";
    }
  }
}

// Open keyboard shortcuts settings
const openShortcutsBtn = document.getElementById("openShortcutsSettingsBtn");
if (openShortcutsBtn) {
  openShortcutsBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
}

// Check for updates
const checkUpdateBtn = document.getElementById("checkUpdateBtn");
if (checkUpdateBtn) {
  checkUpdateBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("https://raw.githubusercontent.com/heladixman/Instant-Print-Orders/main/version.json");
      const data = await res.json();
      
      const currentVersion = manifest.version;
      const latestVersion = data.latest.version;
      
      if (currentVersion !== latestVersion) {
        const updateMsg = `New version ${latestVersion} is available!\n\nClick OK to download.`;
        if (confirm(updateMsg)) {
          chrome.tabs.create({ url: data.download.zip });
        }
      } else {
        alert(`You're already on the latest version (${currentVersion})`);
      }
    } catch (err) {
      console.log("Update check failed:", err);
      alert("Failed to check for updates. Please try again later.");
    }
  });
}

// Refresh extension
const refreshBtn = document.getElementById("refreshExtensionBtn");
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    chrome.runtime.reload();
  });
}

// Load everything when page loads
window.addEventListener("DOMContentLoaded", () => {
  loadShortcuts();
  loadChangelog();
});