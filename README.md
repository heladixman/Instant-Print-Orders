# 🖨️ Instant Print Orders (Tokopedia / Shopee)

A browser extension designed to **clean up order pages** and enable **instant printing** with minimal manual effort.

---

## 📌 Description

Auto Print Helper manipulates the DOM of marketplace order pages (Tokopedia / Shopee) to:

* Remove unnecessary elements
* Display only essential information
* Automatically expand hidden details
* Optimize the layout for printing

This tool is ideal for:

* Store administrators
* Operations teams
* Bulk invoice / order printing workflows

---

## ⚙️ Features

### 🔹 Auto Clean & Print

* Cleans the page automatically
* Expands all relevant details
* Instantly opens the print dialog

---

### 🔹 Undo Clean

* Restores the page to its original state
* Reverts all DOM modifications made by the extension

---

### 🔹 Toggle Detail Information

* Show / hide:

  * Payment details
  * Additional information
  * Certain sensitive data (e.g., phone numbers)

* Uses **smart auto-toggle detection**

---

## ⌨️ Shortcuts

| Function      | Shortcut           |
| ------------- | ------------------ |
| Clean & Print | `Ctrl + Shift + Y` |
| Undo Clean    | `Ctrl + Shift + U` |
| Toggle Detail | `Ctrl + Shift + H` |

---

## 🧠 How It Works

This extension operates by:

* Direct DOM manipulation
* Applying `auto-print-hide` classes
* Cloning important UI elements (e.g., badges)
* Simulating click events to expand/collapse sections
* Using `requestAnimationFrame` for render synchronization

---

## 📂 Project Structure

```
extension/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── content.js
```

---

## 🚀 Installation

1. Open Chrome and go to:

   ```
   chrome://extensions/
   ```
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select your extension folder

---

## 🧪 Usage

1. Open a Tokopedia or Shopee order page
2. Use the following shortcuts:

   * `Ctrl + Shift + Y` → Clean & Print
   * `Ctrl + Shift + H` → Toggle details
   * `Ctrl + Shift + U` → Undo changes

💡 No need to open the extension popup

---

## ⚠️ Notes

* Depends heavily on marketplace DOM structure
* UI updates from Tokopedia/Shopee may break some features
* Minor delays may occur due to async rendering

---

## 🔒 Privacy & Security

* No data is sent to any server
* No user data is stored
* Everything runs locally in the browser (client-side)

---

## 📜 License

Licensed under **CC BY-NC (NonCommercial)**
© 2026 Hela Dixman

---

## 👤 Author

**Hela Dixman**
Version: 1.0.0

---

## 🚧 Known Issues

* Toggle may delay if the page has not fully rendered
* UI changes from marketplace platforms may affect selectors

---

## 🗺️ Roadmap

* [ ] Interactive settings UI (popup)
* [ ] Automatic order page detection
* [ ] Support for additional marketplaces
* [ ] Performance optimization (reduce loop usage)

---

## 💡 Tips

Use keyboard shortcuts directly for maximum efficiency without opening the popup.

---

## ⭐ Support

If this extension helps your workflow, feel free to use, modify, and improve it based on your needs.

---
