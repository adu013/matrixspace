# ❖ MatrixSpace // TERMINAL_NODE

A minimalist, privacy-focused cyberpunk themed dashboard that transforms the default browser (Firefox, Chrome and more) new tab page into a responsive, secure terminal workspace.

---

## ⚡ Core Features

- **Modular Control Grid:** Toggle individual modules on and off dynamically through the integrated settings dashboard.
- **Search Module Engine:** Instantly execute search arguments via Google, DuckDuckGo, or Bing.
- **Split Terminal Clock:** Large synchronized time clock with accompanying date and weekday strings.
- **System Metrics Node:** Live diagnostics tracking JavaScript memory allocation and host platform architecture.
- **Core Directives (Main Feed):** Zero-latency random motivational quote generator to keep you locked in.
- **Custom Link Matrices:** 3-column customizable directory layout supporting inline category title edits and a 5-link ceiling per column.
- **CRUD Task Vector:** Scrollable 5-item task board supporting dynamic item creation, checked completion, and total row deletions.
- **Identity Themes:** Shift console environments instantly across styles like Matrix Midnight (Default), Cyber Pink, Neon Orange, Neon Yellow, and standard Light Mode.

---

## 📁 Folder Structure

```text
matrixspace/
├── manifest.json   # Extension metadata, permissions, & engine declarations
├── newtab.html     # DOM tree framework structure
├── style.css       # Unified layout configuration & active theme stylesheets
├── app.js          # Central bootstrap controller & DOM layout orchestrator
├── config.js       # HTML component blueprints & raw markup definitions
├── widgets.js      # System, network, quotes, & task calculation algorithms
├── links.js        # 3-Column CRUD link group rendering scripts
├── shortcuts.js    # Vim-style keyboard navigation shortcut maps
├── .gitignore      # Prevents build outputs and OS artifacts from being tracked
├── LICENSE         # Apache License 2.0 legal distribution text
└── README.md       # This beautifully crafted documantation
```

---

## ⚙️ Architecture Design

To comply with strict modern browser extension security guidelines, the runtime execution context operates completely **free of `innerHTML` strings or un-sanitized concatenations**.

1. **State Persistence:** All configurations, widget variables, user link objects, and task arrays are safely committed to the browser's persistent sandbox using `browser.storage.local`.
2. **Dynamic Injections:** String code blocks located inside `config.js` are parsed securely using `DOMParser()` inside the `app.js` workflow. Wiping layouts is executed cleanly using `replaceChildren()`.
3. **Data Protection:** Content text elements (like task strings and link labels) are rendered exclusively using `textContent` to block Cross-Site Scripting (XSS) risks.

---

## 🛠️ Local Development & Testing

To load modifications to your codebase for real-time testing:

1. Open Firefox and type `about:debugging` inside the address bar.
2. Select **This Firefox** on the left-hand navigation menu.
3. Click the **Load Temporary Add-on...** button.
4. Open your project directory and select the `manifest.json` file.
5. To test adjustments, update your file edits, click **Reload** under the MatrixSpace listing, and open a fresh tab (`Ctrl + T`).

---

## 📦 Bundling for Production Releases

When preparing to publish updates or compile a signed production archive:

1. Compress **only the inner elements** inside the root directory (do not include the outer parent folder).
2. Omit any operating system cache artifacts or hidden folders (like `.DS_Store` or `.git`).
3. If on macOS, run the following command in terminal inside the root directory to generate a clean zip:
   ```bash
   zip -r matrixspace.zip . -x "*.DS_Store" -x "__MACOSX" -x ".*"
   ```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
