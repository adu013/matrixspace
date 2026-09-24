export function renderWorkspace2() {
    const primaryRow = document.getElementById('w2-row-primary-links');
    const secondaryRow = document.getElementById('w2-row-secondary-links');
    const densityRow = document.getElementById('w2-row-density-links');
    if (!primaryRow || !densityRow) return;

    // Fetch both datasets concurrently from local cache storage
    browser.storage.local.get(['matrixW2Primary', 'matrixW2Secondary', 'matrixW2Density']).then(res => {
        // Dataset 1: Standard Link Groups (Max 10 items)
        const primaryData = res.matrixW2Primary || {
            p1: { title: "GROUP A", items: [] },
            p2: { title: "GROUP B", items: [] },
            p3: { title: "GROUP C", items: [] }
        };

        // Dataset 2: Secondary Link Groups (Max 10 items)
        const secondaryData = res.matrixW2Secondary || {
            s1: { title: "GROUP D", items: [] },
            s2: { title: "GROUP E", items: [] },
            s3: { title: "GROUP F", items: [] }
        }

        // Dataset 2: High-Density Vault Directories (Max 10 items)
        const densityData = res.matrixW2Density || {
            d1: { title: "GROUP G", items: [] },
            d2: { title: "GROUP H", items: [] },
            d3: { title: "GROUP I", items: [] }
        };

        // Clear layout canvas trees securely without innerHTML flags
        primaryRow.replaceChildren();
        secondaryRow.replaceChildren();
        densityRow.replaceChildren();

        // --- PART A: Render Row 1 (Max 10 Links Grid) ---
        ['p1', 'p2', 'p3'].forEach(colId => {
            buildLinkColumn(primaryRow, primaryData, colId, 10, 'matrixW2Primary', 'w1');
        });

        // --- PART B: Render Row 2 (Max 10 Links Grid) ---
        ['s1', 's2', 's3'].forEach(colId => {
            buildLinkColumn(secondaryRow, secondaryData, colId, 10, 'matrixW2Secondary', 'w2');
        });

        // --- PART B: Render Row 3 (Max 10 Links Grid) ---
        ['d1', 'd2', 'd3'].forEach(colId => {
            buildLinkColumn(densityRow, densityData, colId, 10, 'matrixW2Density', 'w3');
        });
    });
}

// Reusable DOM construction engine to build safe, warning-free link widgets
function buildLinkColumn(targetRow, masterData, colId, maxLimit, storageKey, scopePrefix) {
    const colData = masterData[colId];
    const colDiv = document.createElement('div');
    colDiv.className = 'widget w2-density-widget';

    // Title Element
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = colData.title;
    titleInput.style.cssText = 'background:transparent; border:none; color:inherit; font-family:inherit; font-weight:bold; text-transform:uppercase; font-size:1.05rem; width:100%; border-bottom:1px dashed currentColor; padding-bottom:4px; margin-bottom:10px;';
    titleInput.addEventListener('change', (e) => {
        masterData[colId].title = e.target.value.toUpperCase();
        browser.storage.local.set({ [storageKey]: masterData });
    });
    colDiv.appendChild(titleInput);

    // Scrollable Link Stack
    const scrollVault = document.createElement('div');
    scrollVault.className = 'w2-scroll-vault';

    if (colData.items.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'opacity:0.35; font-size:0.8rem; padding:5px 0;';
        emptyMsg.textContent = 'DIRECTORY EMPTY';
        scrollVault.appendChild(emptyMsg);
    } else {
        colData.items.forEach((item, idx) => {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'w2-item-row';

            const anchor = document.createElement('a');
            anchor.href = item.url;
            anchor.target = '_blank';
            anchor.style.cssText = 'color:inherit; text-decoration:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:85%;';
            anchor.textContent = `> ${item.name}`;

            const delBtn = document.createElement('button');
            delBtn.style.cssText = 'background:transparent; border:none; color:inherit; cursor:pointer; opacity:0.5; font-family:inherit; font-size:0.75rem;';
            delBtn.textContent = '[X]';
            delBtn.addEventListener('click', () => {
                masterData[colId].items.splice(idx, 1);
                browser.storage.local.set({ [storageKey]: masterData }).then(renderWorkspace2);
            });

            rowWrapper.appendChild(anchor);
            rowWrapper.appendChild(delBtn);
            scrollVault.appendChild(rowWrapper);
        });
    }
    colDiv.appendChild(scrollVault);

    // Compact Input Row Form (Only renders if under the specific column limit cap)
    if (colData.items.length < maxLimit) {
        const formRow = document.createElement('div');
        formRow.className = 'w2-compact-form';

        const nameInp = document.createElement('input');
        nameInp.type = 'text';
        nameInp.placeholder = 'Name';
        nameInp.style.cssText = 'width:35%; background:rgba(0,0,0,0.15); border:1px solid currentColor; color:inherit; font-family:inherit; font-size:0.75rem; padding:3px;';

        const urlInp = document.createElement('input');
        urlInp.type = 'text';
        urlInp.placeholder = 'URL';
        urlInp.style.cssText = 'width:45%; background:rgba(0,0,0,0.15); border:1px solid currentColor; color:inherit; font-family:inherit; font-size:0.75rem; padding:3px;';

        const addBtn = document.createElement('button');
        addBtn.style.cssText = 'background:transparent; border:1px solid currentColor; color:inherit; cursor:pointer; font-family:inherit; font-size:0.75rem; padding:1px 6px;';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            let url = urlInp.value.trim();
            const name = nameInp.value.trim();
            if (!name || !url) return;
            if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

            masterData[colId].items.push({ name, url });
            browser.storage.local.set({ [storageKey]: masterData }).then(renderWorkspace2);
        });

        formRow.appendChild(nameInp);
        formRow.appendChild(urlInp);
        formRow.appendChild(addBtn);
        colDiv.appendChild(formRow);
    }

    targetRow.appendChild(colDiv);
}
