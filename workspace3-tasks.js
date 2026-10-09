/**
 * Matrix Tasks Engine
 * Renders and maintains states for the 2x3 productivity planning nodes.
 */

const BUCKETS = ['today', 'nextday', 'thisweek', 'nextweek', 'thismonth', 'nextmonth'];

export function renderMatrixTasks() {
  browser.storage.local.get('matrixTimeTasks').then(res => {
    const data = res.matrixTimeTasks || {
      today: [], nextday: [], thisweek: [], nextweek: [], thismonth: [], nextmonth: []
    };

    BUCKETS.forEach(bucketId => {
      const bucketContainer = document.getElementById(`tasks-${bucketId}`);
      if (!bucketContainer) return;

      // Clean out DOM list element securely
      bucketContainer.replaceChildren();

      const itemsList = data[bucketId] || [];
      const wrappedList = document.createElement('div');
      wrappedList.className = 'task-list';

      itemsList.forEach((task, idx) => {
        const itemRow = document.createElement('label');
        itemRow.className = 'task-item';
        itemRow.style.cssText = 'display:flex; justify-content:space-between; width:100%;';

        const leftSide = document.createElement('div');
        leftSide.style.cssText = 'display:flex; align-items:center; gap:10px; flex:1;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          data[bucketId][idx].completed = checkbox.checked;
          browser.storage.local.set({ matrixTimeTasks: data });
        });

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        if (task.completed) {
          taskText.style.textDecoration = 'line-through';
          taskText.style.opacity = '0.5';
        }

        leftSide.appendChild(checkbox);
        leftSide.appendChild(taskText);

        const delBtn = document.createElement('button');
        delBtn.className = 'del-link';
        delBtn.style.cssText = 'background:transparent; border:none; color:inherit; cursor:pointer; font-family:inherit;';
        delBtn.textContent = '[X]';
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          data[bucketId].splice(idx, 1);
          browser.storage.local.set({ matrixTimeTasks: data }).then(renderMatrixTasks);
        });

        itemRow.appendChild(leftSide);
        itemRow.appendChild(delBtn);
        wrappedList.appendChild(itemRow);
      });

      bucketContainer.appendChild(wrappedList);

      // Append input field box layout inside structural constraints
      const formBlock = document.createElement('div');
      formBlock.style.cssText = 'display:flex; gap:6px; margin-top:15px;';

      const taskInput = document.createElement('input');
      taskInput.type = 'text';
      taskInput.placeholder = '+ ADD TERMINAL TASK...';
      taskInput.style.cssText = 'flex:1; background:rgba(0,0,0,0.2); border:1px solid currentColor; color:inherit; font-family:inherit; font-size:0.8rem; padding:6px;';

      taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = taskInput.value.trim();
          if (!val) return;
          data[bucketId].push({ text: val, completed: false });
          browser.storage.local.set({ matrixTimeTasks: data }).then(renderMatrixTasks);
        }
      });

      formBlock.appendChild(taskInput);
      bucketContainer.appendChild(formBlock);
    });
  });
}
