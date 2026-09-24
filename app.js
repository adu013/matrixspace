// Universal API mapping compatibility layer for Chrome execution support
globalThis.browser = globalThis.browser || globalThis.chrome;

import { getSearchTemplate, widgetTemplates } from './config.js';
import { setupWidgetListeners, startClockEngine } from './widgets.js';
import { startKeyboardShortcutEngine } from './shortcuts.js';
import { renderLinkGroups } from './links.js';

// --- Fire Master Configuration System Loops ---
startClockEngine();
startKeyboardShortcutEngine();

const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettings');
const themeSelector = document.getElementById('themeSelector');
const engineSelector = document.getElementById('engineSelector');

if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
}

// Helper to safely convert an HTML string template into a real DOM Node
function parseHTMLStringToNode(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    // Returns the document node tree fragment safely constructed
    return doc.body.firstChild;
}

// --- Render Dashboard Layout ---
function renderDashboard(config, engineUrl) {
    const currentEngine = engineUrl || "https://google.com";

    // Render Top Rows
    ['search', 'clock', 'status'].forEach(key => {
        const row = document.getElementById(`row-${key}`);
        const checkbox = document.getElementById(`toggle-${key}`);
        const isEnabled = config[key] !== false;
        if (checkbox) checkbox.checked = isEnabled;
        if (row) {
            row.replaceChildren();

            if (isEnabled) {
                const templateString = (key === 'search') ? getSearchTemplate(currentEngine) : widgetTemplates[key];

                // Parse the string template securely into real browser objects
                const parser = new DOMParser();
                const doc = parser.parseFromString(templateString, 'text/html');

                // Append all parsed children directly into the target dashboard row
                const children = Array.from(doc.body.childNodes);
                children.forEach(child => row.appendChild(child));

                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        }
    });

    // Render 3-Column Links Row
    const linksRow = document.getElementById('row-links');
    const linksEnabled = config['links'] !== false;
    const linksCheckbox = document.getElementById('toggle-links');
    if (linksCheckbox) linksCheckbox.checked = linksEnabled;
    if (linksRow) {
        if (linksEnabled) {
            linksRow.classList.remove('hidden');
            renderLinkGroups();
        } else {
            linksRow.replaceChildren();
            linksRow.classList.add('hidden');
        }
    }

    // Render Bottom Grid (Notes & Tasks)
    const bottomGrid = document.getElementById('row-bottom-grid');
    const notesEnabled = config['notes'] !== false;
    const pomoEnabled = config['pomdoro'] !== false;
    const tasksEnabled = config['tasks'] !== false;

    const notesCheckbox = document.getElementById('toggle-notes');
    const tasksCheckbox = document.getElementById('toggle-tasks');
    if (notesCheckbox) notesCheckbox.checked = notesEnabled;
    if (tasksCheckbox) tasksCheckbox.checked = tasksEnabled;

    if (bottomGrid) {
        bottomGrid.replaceChildren();

        if (notesEnabled || tasksEnabled || pomoEnabled) {
          // Dynamically adjust layout columns based on how many are enabled
          const enabledCount = [notesEnabled, pomoEnabled, tasksEnabled].filter(Boolean).length;
          if (enabledCount === 3) bottomGrid.className = "row row-3col";
          else if (enabledCount === 2) bottomGrid.className = "row row-2col";
          else bottomGrid.className = "row row-1col";

            // Safely parse and append the notes widget if active
            if (notesEnabled) {
                const notesNode = parseHTMLStringToNode(widgetTemplates.notes);
                if (notesNode) bottomGrid.appendChild(notesNode);
            }

            // Safely parse and append the pomo widget if active
            if (pomoEnabled) {
              const pomoNode = parseHTMLStringToNode(widgetTemplates.pomodoro);
              if (pomoNode) bottomGrid.appendChild(pomoNode);
            }

            // Safely parse and append the tasks widget if active
            if (tasksEnabled) {
                const tasksNode = parseHTMLStringToNode(widgetTemplates.tasks);
                if (tasksNode) bottomGrid.appendChild(tasksNode);
            }

            setupWidgetListeners();
        } else {
            bottomGrid.classList.add('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local.get(['activeTheme', 'widgetConfig', 'searchEngine']).then(res => {
        const activeTheme = res.activeTheme || "matrix-classic";
        document.body.setAttribute('data-theme', activeTheme);
        if (themeSelector) themeSelector.value = activeTheme;

        if (res.searchEngine && engineSelector) {
            engineSelector.value = res.searchEngine;
        }

        const defaultConfig = res.widgetConfig || {
            search: true,
            clock: true,
            status: true,
            links: true,
            notes: true,
            tasks: true
        };

        renderDashboard(defaultConfig, res.searchEngine);
    });
});

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        const widgetConfig = {
            search: document.getElementById('toggle-search').checked,
            clock: document.getElementById('toggle-clock').checked,
            status: document.getElementById('toggle-status').checked,
            links: document.getElementById('toggle-links').checked,
            notes: document.getElementById('toggle-notes').checked,
            tasks: document.getElementById('toggle-tasks').checked
        };
        const selectedTheme = themeSelector.value;
        const selectedEngine = engineSelector.value;
        document.body.setAttribute('data-theme', selectedTheme);
        browser.storage.local.set({ activeTheme: selectedTheme, widgetConfig, searchEngine: selectedEngine }).then(() => {
            renderDashboard(widgetConfig, selectedEngine);
            settingsPanel.classList.add('hidden');
        });
    });
}
