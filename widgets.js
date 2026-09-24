// --- Complete Synchronized Clock, Date & Day Engine ---
export function startClockEngine() {
    function tick() {
        const now = new Date();

        // Time Field Tick Update (HH:MM:SS)
        const clockEl = document.getElementById('clock-display');
        if (clockEl) clockEl.textContent = now.toLocaleTimeString();

        // Underneath Date Field Update (e.g., September 24, 2026)
        const dateEl = document.getElementById('date-display');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Right Block Day of Week Field Update (e.g., THURSDAY)
        const dayEl = document.getElementById('day-display');
        if (dayEl) {
            dayEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
        }
    }

    // Fire calculation updates instantly and check every second
    setInterval(tick, 1000);
    setTimeout(tick, 50);
}

export function setupWidgetListeners() {
    // --- Quick Notes ---
    const notesArea = document.getElementById('notesArea');
    if (notesArea) {
        browser.storage.local.get('savedNotes').then(res => { if (res.savedNotes) notesArea.value = res.savedNotes; });
        notesArea.addEventListener('input', () => { browser.storage.local.set({ savedNotes: notesArea.value }); });
    }

    // --- System Status ---
    const ramDisplay = document.getElementById('sys-ram');
    const osDisplay = document.getElementById('sys-os');
    if (ramDisplay || osDisplay) {
        if (navigator.userAgentData && navigator.userAgentData.platform) osDisplay.textContent = navigator.userAgentData.platform.toUpperCase();
        else {
            const ua = navigator.userAgent;
            if (ua.indexOf("Win") !== -1) osDisplay.textContent = "WINDOWS";
            else if (ua.indexOf("Mac") !== -1) osDisplay.textContent = "MACOS";
            else osDisplay.textContent = "LINUX";
        }
        function updateMemoryMetrics() {
            if (window.performance && performance.memory) {
                ramDisplay.textContent = `${Math.round(performance.memory.usedJSHeapSize / (1024*1024))}MB / ${Math.round(performance.memory.jsHeapSizeLimit / (1024*1024))}MB`;
            } else ramDisplay.textContent = "STABLE";
        }
        updateMemoryMetrics();
    }

    // --- Network Tracking ---
    const netStatus = document.getElementById('net-status');
    const netSpeed = document.getElementById('net-speed');
    if (netStatus || netSpeed) {
        function updateNetworkStatus() {
            netStatus.textContent = navigator.onLine ? "ONLINE (SECURE)" : "OFFLINE (DISCONNECTED)";
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            netSpeed.textContent = (conn && conn.effectiveType) ? conn.effectiveType.toUpperCase() : "DIRECT LINK";
        }
        updateNetworkStatus();
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
    }

    // --- Quote Generator Engine ---
    const quoteTextField = document.getElementById('quote-text');
    const quoteAuthorField = document.getElementById('quote-author');
    const nextQuoteBtn = document.getElementById('next-quote-btn');
    if (quoteTextField && quoteAuthorField && nextQuoteBtn) {
        const quotes = [
            { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
            { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
            { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
            { text: "Programs must be written for people to read, and only machines to execute.", author: "Abelson & Sussman" }
        ];
        function genQuote() {
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            quoteTextField.textContent = `"${q.text}"`;
            quoteAuthorField.textContent = `— ${q.author}`;
        }
        genQuote();
        nextQuoteBtn.addEventListener('click', genQuote);
    }

    // --- CRUD Tasks Engine ---
    const taskContainer = document.getElementById('crud-task-list');
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (taskContainer && newTaskInput && addTaskBtn) {
              function loadTasks() {
            browser.storage.local.get('matrixTasks').then(res => {
                const tasks = res.matrixTasks || [];

                // FIXED (Line 101): Safely clears out all old nodes without using innerHTML
                taskContainer.replaceChildren();

                if (tasks.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.style.cssText = 'opacity: 0.4; font-size: 0.85rem; padding-top: 10px;';
                    emptyMessage.textContent = 'ALL TARGETS CLEARED'; // Secure text assignment
                    taskContainer.appendChild(emptyMessage);
                    return;
                }

                tasks.forEach(task => {
                    const item = document.createElement('div');
                    item.className = 'task-item';
                    item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;';

                    // FIXED (Line 106): Construct elements programmatically to eliminate innerHTML flags
                    const label = document.createElement('label');
                    label.style.cssText = 'display:flex; align-items:center; gap:10px; cursor:pointer; flex:1; min-width:0;';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'task-checkbox';
                    checkbox.setAttribute('data-id', task.id);
                    checkbox.checked = task.completed;
                    checkbox.style.cssText = 'accent-color:currentColor; cursor:pointer;';

                    const span = document.createElement('span');
                    span.style.cssText = `word-break:break-all; ${task.completed ? 'text-decoration:line-through; opacity:0.5;' : ''}`;
                    span.textContent = task.text; // HIGHLY SECURE: Escapes user strings instantly!

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-task-btn';
                    deleteBtn.setAttribute('data-id', task.id);
                    deleteBtn.style.cssText = 'background:transparent; border:none; color:inherit; cursor:pointer; opacity:0.6; font-family:inherit;';
                    deleteBtn.textContent = '[X]';

                    // Assembly tree structure line configurations
                    label.appendChild(checkbox);
                    label.appendChild(span);
                    item.appendChild(label);
                    item.appendChild(deleteBtn);

                    taskContainer.appendChild(item);
                });

                // Event listener bindings remain perfectly intact...
                document.querySelectorAll('.task-checkbox').forEach(box => {
                    box.addEventListener('change', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        tasks.forEach(t => { if (t.id === id) t.completed = e.target.checked; });
                        browser.storage.local.set({ matrixTasks: tasks }).then(loadTasks);
                    });
                });
                document.querySelectorAll('.delete-task-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(btn.getAttribute('data-id'));
                        browser.storage.local.set({ matrixTasks: tasks.filter(t => t.id !== id) }).then(loadTasks);
                    });
                });
            });
        }

        function addT() {
            const txt = newTaskInput.value.trim(); if (!txt) return;
            browser.storage.local.get('matrixTasks').then(res => {
                const t = res.matrixTasks || []; t.push({ id: Date.now(), text: txt, completed: false });
                browser.storage.local.set({ matrixTasks: t }).then(() => { newTaskInput.value = ''; loadTasks(); });
            });
        }
        addTaskBtn.addEventListener('click', addT);
        newTaskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addT(); });
        loadTasks();
    }

  // --- Cyberpunk Pomodoro Focus Timer Logic (Editable with memory) ---
  const pomoMinsInput = document.getElementById('pomo-mins');
  const pomoSecsInput = document.getElementById('pomo-secs');
  const pomoStatus = document.getElementById('pomo-status');
  const pomoStartBtn = document.getElementById('pomo-start');
  const pomoResetBtn = document.getElementById('pomo-reset');

  if (pomoMinsInput && pomoSecsInput && pomoStatus && pomoStartBtn && pomoResetBtn) {
    let timerInterval = null;
    let timeRemaining = 25 * 60;
    let isRunning = false;

    // Memory node to cache your last chosen custom timeframe profile
    let lastUserSessionMins = "25";

    function updateTimerDisplay() {
      const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
      const seconds = (timeRemaining % 60).toString().padStart(2, '0');
      pomoMinsInput.value = minutes;
      pomoSecsInput.value = seconds;
    }

    function setTimeFromInputs() {
      let parsedMins = parseInt(pomoMinsInput.value, 10);
      if (isNaN(parsedMins) || parsedMins < 0) parsedMins = 0;
      if (parsedMins > 99) parsedMins = 99; // Cap ceiling at 99 mins

      const standardString = parsedMins.toString().padStart(2, '0');
      pomoMinsInput.value = standardString;
      timeRemaining = parsedMins * 60;

      // Only update session memory if value is valid and more than zero
      if (parsedMins > 0) {
          lastUserSessionMins = standardString;
      }
    }

    pomoMinsInput.addEventListener('change', () => {
      if (!isRunning) setTimeFromInputs();
    });

    pomoMinsInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        pomoMinsInput.blur();
        pomoStartBtn.click();
      }
    });

    function startTimer() {
      pomoMinsInput.readOnly = true;
      pomoMinsInput.style.cursor = 'default';

      timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
          timeRemaining--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          isRunning = false;
          pomoStatus.textContent = "SPRINT COMPLETE";
          pomoStartBtn.textContent = "[ START ]";
          pomoMinsInput.readOnly = false;
          pomoMinsInput.style.cursor = 'text';

          // Native audio system chime beep
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      }, 1000);
    }

    pomoStartBtn.addEventListener('click', () => {
      if (isRunning) {
        // Handle Pause State
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        pomoStatus.textContent = "SPRINT PAUSED";
        pomoStartBtn.textContent = "[ RESUME ]";
        pomoMinsInput.readOnly = false;
        pomoMinsInput.style.cursor = 'text';
      } else {
        // Lock and cache the typed target right before starting the timer cycle
        setTimeFromInputs();

        isRunning = true;
        pomoStatus.textContent = "CORE SPRINT ACTIVE";
        pomoStartBtn.textContent = "[ PAUSE ]";
        startTimer();
      }
    });

    pomoResetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      pomoMinsInput.readOnly = false;
      pomoMinsInput.style.cursor = 'text';

      // Restores the exact custom timestamp
      pomoMinsInput.value = lastUserSessionMins;
      pomoSecsInput.value = "00";
      timeRemaining = parseInt(lastUserSessionMins, 10) * 60;

      pomoStatus.textContent = "SYSTEM IDLE";
      pomoStartBtn.textContent = "[ START ]";
    });
  }
}
