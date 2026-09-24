// --- Component HTML Templates ---
export function getSearchTemplate(engineUrl) {
    return `<div class="widget search-widget">
                <form action="${engineUrl}" method="GET" target="_blank">
                    <input type="text" name="q" class="search-input" placeholder=">_ SEARCH THE MATRIX..." autofocus autocomplete="off">
                </form>
            </div>`;
}

export const widgetTemplates = {
    clock:  `<!-- Left Grid Block: Large Clock & Underneath Date -->
             <div class="widget clock-split-left" style="display: flex; flex-direction: column; justify-content: center; min-height: 120px;">
                <div id="clock-display" style="font-size: 3.5rem; font-weight: bold; line-height: 1; letter-spacing: 2px; color: inherit;">00:00:00</div>
                <div id="date-display" style="font-size: 1rem; opacity: 0.7; margin-top: 8px; letter-spacing: 1px;">YYYY-MM-DD</div>
             </div>
             <!-- Right Grid Block: Large Day of the Week Display -->
             <div class="widget clock-split-right" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 120px; text-align: center;">
                <div style="font-size: 0.75rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">CURRENT SYSTEM CYCLE</div>
                <div id="day-display" style="font-size: 2.2rem; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: inherit;">DAY</div>
             </div>`,

    status: `<div class="widget">
                <h3>System Status</h3>
                <div class="status-metrics" style="margin-top:15px; font-size:0.9rem; line-height:1.6;">
                    <div>• RAM LOAD: <span id="sys-ram" style="color:inherit; font-weight:bold;">TRACKING...</span></div>
                    <div>• OS NODE: <span id="sys-os" style="color:inherit; font-weight:bold;">DETECTING...</span></div>
                </div>
             </div>
             <div class="widget" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
                <div>
                    <h3>Main Feed: Core Directives</h3>
                    <p id="quote-text" style="font-style: italic; margin-top: 15px; font-size: 0.95rem; line-height: 1.4;">"Initializing directive matrix..."</p>
                    <p id="quote-author" style="text-align: right; font-size: 0.8rem; opacity: 0.7; margin-top: 5px; margin-bottom: 0;">— Node 0</p>
                </div>
                <button id="next-quote-btn" style="background: transparent; border: 1px solid currentColor; color: inherit; padding: 4px 10px; cursor: pointer; font-family: inherit; font-size: 0.75rem; align-self: flex-end; margin-top: 10px;">[ CYCLE DIRECTIVE ]</button>
             </div>
             <div class="widget">
                <h3>Network Node</h3>
                <div class="status-metrics" style="margin-top:15px; font-size:0.9rem; line-height:1.6;">
                    <div>• LINK: <span id="net-status" style="color:inherit; font-weight:bold;">CHECKING...</span></div>
                    <div>• SPEED TYPE: <span id="net-speed" style="color:inherit; font-weight:bold;">DETECTING...</span></div>
                </div>
             </div>`,
    notes:  `<div class="widget">
                <h3>Quick Notes</h3>
                <textarea id="notesArea" placeholder="Type notes here... auto-saves instantly."></textarea>
             </div>`,
  // Cyberpunk Pomodoro Sprint Timer Widget
  pomodoro: `
  <div class="widget" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
    <h3>Pomodoro Sprint</h3>
    <div style="text-align: center; margin: 15px 0;">
      <!-- Editable Time Fields -->
      <div id="pomo-input-wrapper" style="font-size: 3rem; font-weight: bold; font-family: monospace; letter-spacing: 2px; display: flex; justify-content: center; align-items: center; line-height: 1;">
        <input type="text" id="pomo-mins" value="25" maxlength="2" style="font-size: 3rem; font-weight: bold; font-family: inherit; color: inherit; background: transparent; border: none; width: 90px; text-align: right; padding: 0;">
        <span>:</span>
        <input type="text" id="pomo-secs" value="00" maxlength="2" style="font-size: 3rem; font-weight: bold; font-family: inherit; color: inherit; background: transparent; border: none; width: 90px; text-align: left; padding: 0;" readonly>
      </div>
      <div id="pomo-status" style="font-size: 0.75rem; opacity: 0.5; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">SYSTEM IDLE</div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button id="pomo-start" style="flex: 1; background: transparent; border: 1px solid currentColor; color: inherit; padding: 6px; cursor: pointer; font-family: inherit; font-size: 0.8rem;">[ START ]</button>
      <button id="pomo-reset" style="background: transparent; border: 1px solid currentColor; color: inherit; padding: 6px 12px; cursor: pointer; font-family: inherit; font-size: 0.8rem;">[ RESET ]</button>
    </div>
  </div>
  `,
    tasks:  `<div class="widget" style="display: flex; flex-direction: column; max-height: 250px;">
                <h3>System Tasks</h3>
                <div class="task-input-container" style="display: flex; gap: 8px; margin-top: 10px;">
                    <input type="text" id="newTaskInput" placeholder="Add custom directive..." style="flex: 1; background: rgba(0,0,0,0.2); border: 1px solid currentColor; color: inherit; padding: 6px; font-family: inherit;">
                    <button id="addTaskBtn" style="background: transparent; border: 1px solid currentColor; color: inherit; padding: 6px 12px; cursor: pointer; font-family: inherit;">+</button>
                </div>
                <div id="crud-task-list" class="task-list scrollable-tasks" style="overflow-y: auto; margin-top: 15px; flex: 1; padding-right: 5px;"></div>
             </div>`
};
