// Variable to track the active prefix command key (j, k, or l)
let sequencePrefix = null;
let prefixTimeout = null;

export function startKeyboardShortcutEngine() {
  window.addEventListener('keydown', (e) => {
    const activeNode = document.activeElement;

    // If user is currently typing in an input field or textarea, ignore shortcuts
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

    // Handle Number Input if a Link Prefix (j, k, l) is active
    if (sequencePrefix && ['1', '2', '3', '4', '5'].includes(key)) {
      e.preventDefault();
      const index = parseInt(key) - 1; // Convert to zero-indexed array counter

      // Map the text prefix identifiers to the correct column elements inside linksRow
      const colMap = { 'j': 0, 'k': 1, 'l': 2 };
      const columnIndex = colMap[sequencePrefix];

      const columns = document.querySelectorAll('.link-group-widget');
      if (columns[columnIndex]) {
        const links = columns[columnIndex].querySelectorAll('a');
        if (links[index]) {
          // Open the targeted URL link context safely in a brand new tab window
          window.open(links[index].href, '_blank');
        }
      }

      // Reset the internal sequence tracking state variables immediately
      sequencePrefix = null;
      clearTimeout(prefixTimeout);
      return;
    }

    // Reset prefix state variables if user types another letter instead of a number
    if (sequencePrefix && !['1', '2', '3', '4', '5'].includes(key)) {
      sequencePrefix = null;
      clearTimeout(prefixTimeout);
    }

    // Detect and Lock Sequence Link Prefix Keys (j = left, k = middle, l = right)
    if (['j', 'k', 'l'].includes(key)) {
      e.preventDefault();
      sequencePrefix = key;

      // Automatically discard the prefix command state after 2 seconds if no number follows
      clearTimeout(prefixTimeout);
      prefixTimeout = setTimeout(() => {
          sequencePrefix = null;
      }, 2000);
      return;
    }

    // Basic Core Navigation Mode Action Maps (Single Character Keys)
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

    // Keyboard Control for the Pomodoro Start / Pause Toggle
    case 'p':
      const pomoStartBtn = document.getElementById('pomo-start');
      if (pomoStartBtn) {
          e.preventDefault();
          pomoStartBtn.click();
      }
      break;

    // Keyboard Control for the Pomodoro Session Memory Reset
    case 'r':
      const pomoResetBtn = document.getElementById('pomo-reset');
      if (pomoResetBtn) {
          e.preventDefault();
          pomoResetBtn.click();
      }
      break;

      // Dynamic Workspace Matrix Hotkey Swapping Routing Options
      case '1':
      case '2':
      case '3':
      case '4':
        const targetDot = document.querySelector(`.page-dot[data-page="${key}"]`);
        // Only route navigation if the target workspace exists and isn't hidden by settings
        if (targetDot && !targetDot.classList.contains('hidden')) {
          e.preventDefault();
          targetDot.click();
        }
        break;
    }
  });
}
