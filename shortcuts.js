// Variable tracking arrays to watch active prefix states
let sequencePrefix = null;
let prefixTimeout = null;

export function startKeyboardShortcutEngine() {
  window.addEventListener('keydown', (e) => {
    const activeNode = document.activeElement;

    // Safety Guard: Ignore shortcut binds while typing inside input or textarea elements
    if (activeNode && (activeNode.tagName === 'INPUT' || activeNode.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') activeNode.blur();
        return;
    }

    const key = e.key.toLowerCase();

    // Clear sequence state safely if user presses Escape key
    if (e.key === 'Escape') {
      sequencePrefix = null;
      clearTimeout(prefixTimeout);
      return;
    }

    // Define valid input arrays for both layouts
    const page1Prefixes = ['j', 'k', 'l'];
    const page2Prefixes = ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c'];
    const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    // EXECUTE SEQUENCE: Handle incoming number input if a prefix is locked active
    if (sequencePrefix && validNumbers.includes(key)) {
      e.preventDefault();

            // --- SYSTEM A: PAGE 1 LINK GRIDS (j, k, l) ---
            if (page1Prefixes.includes(sequencePrefix)) {
                const p1View = document.getElementById('page-view-1');
                // Only allow if Page 1 is currently active and the number is between 1-5
                if (p1View && !p1View.classList.contains('hidden') && ['1', '2', '3', '4', '5'].includes(key)) {
                    const index = parseInt(key, 10) - 1;
                    const colMap = { 'j': 0, 'k': 1, 'l': 2 };
                    const columnIndex = colMap[sequencePrefix];

                    const rowLinks = document.getElementById('row-links');
                    if (rowLinks) {
                        const columns = rowLinks.querySelectorAll('.link-group-widget');
                        if (columns[columnIndex]) {
                            const links = columns[columnIndex].querySelectorAll('a');
                            if (links[index]) window.open(links[index].href, '_blank');
                        }
                    }
                }
            }

            // --- SYSTEM B: PAGE 2 HIGH-DENSITY 3x3 MATRIX (q, w, e, a, s, d, z, x, c) ---
            if (page2Prefixes.includes(sequencePrefix)) {
                const p2View = document.getElementById('page-view-2');
                // Only allow if Page 2 is currently active
                if (p2View && !p2View.classList.contains('hidden')) {
                    // Map character "0" to index 9 (the 10th item)
                    const index = key === '0' ? 9 : parseInt(key, 10) - 1;
                    const widgets = p2View.querySelectorAll('.w2-density-widget');

                    const matrixMap = {
                        'q': 0, 'w': 1, 'e': 2,
                        'a': 3, 's': 4, 'd': 5,
                        'z': 6, 'x': 7, 'c': 8
                    };

                    const targetColumnIndex = matrixMap[sequencePrefix];
                    if (widgets[targetColumnIndex]) {
                        const links = widgets[targetColumnIndex].querySelectorAll('a');
                        if (links[index]) window.open(links[index].href, '_blank');
                    }
                }
            }

            // Flush the prefix cache state immediately after execution
            sequencePrefix = null;
            clearTimeout(prefixTimeout);
            return;
        }

        // Reset sequence cache parameters if another letter is typed instead of a number
        if (sequencePrefix && !validNumbers.includes(key)) {
            sequencePrefix = null;
            clearTimeout(prefixTimeout);
        }

        // DETECT PREFIX: Lock input state if a valid selector is clicked
        if (page1Prefixes.includes(key)) {
            const p1View = document.getElementById('page-view-1');
            if (p1View && !p1View.classList.contains('hidden')) {
                e.preventDefault();
                sequencePrefix = key;
                clearTimeout(prefixTimeout);
                prefixTimeout = setTimeout(() => { sequencePrefix = null; }, 2000);
                return;
            }
        }

        if (page2Prefixes.includes(key)) {
            const p2View = document.getElementById('page-view-2');
            if (p2View && !p2View.classList.contains('hidden')) {
                e.preventDefault();
                sequencePrefix = key;
                clearTimeout(prefixTimeout);
                prefixTimeout = setTimeout(() => { sequencePrefix = null; }, 2000);
                return;
            }
        }

        // Core Base Navigation Actions (Single Key Map Commands)
        switch (key) {
            case 's':
                const searchInp = document.querySelector('.search-input');
                if (searchInp) {
                    e.preventDefault();
                    searchInp.focus();
                    searchInp.select();
                }
                break;

            case 't':
                const taskInp = document.getElementById('newTaskInput');
                if (taskInp) {
                    e.preventDefault();
                    taskInp.focus();
                }
                break;

            case 'p':
                const pomoStartBtn = document.getElementById('pomo-start');
                if (pomoStartBtn) {
                    e.preventDefault();
                    pomoStartBtn.click();
                }
                break;

            case 'r':
                const pomoResetBtn = document.getElementById('pomo-reset');
                if (pomoResetBtn) {
                    e.preventDefault();
                    pomoResetBtn.click();
                }
                break;

            case '1':
            case '2':
            case '3':
            case '4':
                const targetDot = document.querySelector(`.page-dot[data-page="${key}"]`);
                if (targetDot && !targetDot.classList.contains('hidden')) {
                    e.preventDefault();
                    targetDot.click();
                }
                break;
        }
    });
}
