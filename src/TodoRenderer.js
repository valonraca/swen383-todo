// TodoRenderer owns the DOM: it draws both lists and wires the row buttons.
export class TodoRenderer {
  constructor(containerId, service) {
    this.container = document.getElementById(containerId);
    this.service = service;
  }

  renderPendingRows() {
    let html = '';
    for (const task of this.service.tasks) {
      if (task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  renderCompletedRows() {
    let html = '';
    for (const task of this.service.tasks) {
      if (!task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  render(justAddedId) {
    if (!this.container) return;
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) undoBtn.disabled = !this.service.canUndo();

    const pendingHtml = this.renderPendingRows();
    const completedHtml = this.renderCompletedRows();

    let oldestPendingLabel = 'none';
    for (const task of this.service.tasks) {
      if (!task.completed) {
        oldestPendingLabel = task.desc;
        break;
      }
    }

    this.container.innerHTML =
      `<p class="status">${summarizeWorkload(this.service)} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    const toggleButtons = this.container.querySelectorAll('[data-toggle]');
    for (const btn of toggleButtons) {
      btn.addEventListener('click', () => {
        this.service.toggleComplete(btn.dataset.toggle);
        this.render();
      });
    }

    const deleteButtons = this.container.querySelectorAll('[data-delete]');
    for (const btn of deleteButtons) {
      btn.addEventListener('click', () => {
        this.service.deleteTask(btn.dataset.delete);
        this.render();
      });
    }

    if (justAddedId) {
      const row = this.container.querySelector(`[data-row="${justAddedId}"]`);
      if (row) {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 1500);
      }
    }

    document.title = `Todo (${this.service.tasks.filter((t) => !t.completed).length})`;
  }
}

function buildTaskRow(id, desc, completed, priority, createdAt, showActions) {
  const displayText = priority === 'high' ? `[URGENT] ${desc}` : desc;
  const label = displayText.length > 40 ? `${displayText.slice(0, 40)}...` : displayText;
  const priorityClass = priority === 'high' ? 'priority-high' : '';
  const completedClass = completed ? 'completed' : '';
  const actions = showActions
    ? `<span class="task-actions">
        <button data-toggle="${id}">${completed ? 'Undo' : 'Done'}</button>
        <button data-delete="${id}">Delete</button>
      </span>`
    : '';

  return `<li class="${completedClass}" data-row="${id}">
      <span class="task-desc ${priorityClass}">${label}</span>
      <span class="task-time">${createdAt}</span>
      ${actions}
    </li>`;
}

function summarizeWorkload(manager) {
  let done = 0;
  let urgent = 0;
  let normal = 0;

  for (const task of manager.tasks) {
    if (task.completed) {
      done++;
    } else if (task.priority === 'high') {
      urgent++;
    } else {
      normal++;
    }
  }

  const total = manager.tasks.length;
  return `${done}/${total} done - ${urgent} urgent, ${normal} normal remaining`;
}
