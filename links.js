export function renderLinkGroups() {
    const linksRow = document.getElementById('row-links');
    if (!linksRow) return;

    browser.storage.local.get('matrixLinkGroups').then(res => {
        const data = res.matrixLinkGroups || {
            col1: { title: "GROUP ONE", items: [] },
            col2: { title: "GROUP TWO", items: [] },
            col3: { title: "GROUP THREE", items: [] }
        };

        // Safely wipe out all old columns without innerHTML
        linksRow.replaceChildren();

        ['col1', 'col2', 'col3'].forEach(colId => {
            const colData = data[colId];
            const colDiv = document.createElement('div');
            colDiv.className = 'widget link-group-widget';
            colDiv.style.cssText = 'display:flex; flex-direction:column; max-height:280px;';

            // Create Title Input Component Safely
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.className = 'col-title-input';
            titleInput.setAttribute('data-col', colId);
            titleInput.value = colData.title; // Secure value assignment
            titleInput.style.cssText = 'background:transparent; border:none; color:inherit; font-family:inherit; font-weight:bold; text-transform:uppercase; font-size:1.1rem; width:100%; border-bottom:1px dashed currentColor; padding-bottom:4px; margin-bottom:12px;';
            colDiv.appendChild(titleInput);

            // Create Scrollable Link List Container
            const linksListContainer = document.createElement('div');
            linksListContainer.style.cssText = 'flex:1; overflow-y:auto; padding-right:4px;';

            if (colData.items.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.cssText = 'opacity:0.4; font-size:0.85rem; margin-bottom:10px;';
                emptyMsg.textContent = 'NO EXTERNAL LINKS';
                linksListContainer.appendChild(emptyMsg);
            } else {
                colData.items.forEach((item, idx) => {
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = 'display:flex; justify-content:space-between; align-items:center; font-size:0.9rem; margin-bottom:8px;';

                    const anchor = document.createElement('a');
                    anchor.href = item.url;
                    anchor.target = '_blank';
                    anchor.style.cssText = 'color:inherit; text-decoration:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:80%; font-weight:bold;';
                    anchor.textContent = `> ${item.name}`; // Secure text escaping

                    const delBtn = document.createElement('button');
                    delBtn.className = 'del-link';
                    delBtn.setAttribute('data-col', colId);
                    delBtn.setAttribute('data-idx', idx);
                    delBtn.style.cssText = 'background:transparent; border:none; color:inherit; cursor:pointer; opacity:0.6;';
                    delBtn.textContent = '[X]';

                    wrapper.appendChild(anchor);
                    wrapper.appendChild(delBtn);
                    linksListContainer.appendChild(wrapper);
                });
            }
            colDiv.appendChild(linksListContainer);

            // Create Inputs Form Container Row (Up to 5 items constraint)
            if (colData.items.length < 5) {
                const formRow = document.createElement('div');
                formRow.style.cssText = 'display:flex; gap:4px; margin-top:10px;';

                const nameInp = document.createElement('input');
                nameInp.type = 'text';
                nameInp.id = `name-${colId}`;
                nameInp.placeholder = 'Name';
                nameInp.style.cssText = 'width:40%; background:rgba(0,0,0,0.2); border:1px solid currentColor; color:inherit; font-family:inherit; font-size:0.75rem; padding:4px;';

                const urlInp = document.createElement('input');
                urlInp.type = 'text';
                urlInp.id = `url-${colId}`;
                urlInp.placeholder = 'URL';
                urlInp.style.cssText = 'width:50%; background:rgba(0,0,0,0.2); border:1px solid currentColor; color:inherit; font-family:inherit; font-size:0.75rem; padding:4px;';

                const addBtn = document.createElement('button');
                addBtn.className = 'add-link-btn';
                addBtn.setAttribute('data-col', colId);
                addBtn.style.cssText = 'background:transparent; border:1px solid currentColor; color:inherit; cursor:pointer; font-family:inherit; font-size:0.75rem; padding:2px 6px;';
                addBtn.textContent = '+';

                formRow.appendChild(nameInp);
                formRow.appendChild(urlInp);
                formRow.appendChild(addBtn);
                colDiv.appendChild(formRow);
            }

            linksRow.appendChild(colDiv);
        });

        // --- Event Listeners Re-Binding ---
        // Title Change Listener
        document.querySelectorAll('.col-title-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const colId = e.target.getAttribute('data-col');
                if (data[colId]) {
                    data[colId].title = e.target.value.toUpperCase();
                    browser.storage.local.set({ matrixLinkGroups: data });
                }
            });
        });

        // Add Button Listener
        document.querySelectorAll('.add-link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const colId = btn.getAttribute('data-col');
                const nameInp = document.getElementById(`name-${colId}`);
                const urlInp = document.getElementById(`url-${colId}`);

                if (!nameInp || !urlInp || !data[colId]) return;

                let url = urlInp.value.trim();
                const name = nameInp.value.trim();

                if (!name || !url) return;
                if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

                data[colId].items.push({ name, url });
                browser.storage.local.set({ matrixLinkGroups: data }).then(renderLinkGroups);
            });
        });

        // Delete Button Listener
        document.querySelectorAll('.del-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const colId = btn.getAttribute('data-col');
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (data[colId]) {
                    data[colId].items.splice(idx, 1);
                    browser.storage.local.set({ matrixLinkGroups: data }).then(renderLinkGroups);
                }
            });
        });
    });
}
