export class TodoRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.actions = { onToggle() {}, onDelete() {} };
  }

  bindActions(actions) {
    this.actions = actions;
  }

  renderPendingRows(service) {
    let html = '';
    for (const task of service.tasks) {
      if (task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  renderCompletedRows(service) {
    let html = '';
    for (const task of service.tasks) {
      if (!task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  render(service, justAddedId) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows(service);
    const completedHtml = this.renderCompletedRows(service);

    let oldestPendingLabel = 'none';
    for (const task of service.tasks) {
      if (!task.completed) {
        oldestPendingLabel = task.desc;
        break;
      }
    }

    this.container.innerHTML =
      `<p class="status">${service.getWorkloadSummary()} - oldest: ${escapeHtml(oldestPendingLabel)}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    const toggleButtons = this.container.querySelectorAll('[data-toggle]');
    for (const btn of toggleButtons) {
      btn.addEventListener('click', () => this.actions.onToggle(Number(btn.dataset.toggle)));
    }

    const deleteButtons = this.container.querySelectorAll('[data-delete]');
    for (const btn of deleteButtons) {
      btn.addEventListener('click', () => this.actions.onDelete(Number(btn.dataset.delete)));
    }

    if (justAddedId) {
      const row = this.container.querySelector(`[data-row="${justAddedId}"]`);
      if (row) {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 1500);
      }
    }

    document.title = `Todo (${service.tasks.filter(t => !t.completed).length})`;
  }
}

// Builds the markup for a single row. Called from both render lists below.
function buildTaskRow(id, desc, completed, priority, createdAt, showActions) {
  const label = desc.length > 40 ? `${desc.slice(0, 40)}...` : desc;
  const priorityClass = priority === 'high' ? 'priority-high' : '';
  const completedClass = completed ? 'completed' : '';
  const actions = showActions
    ? `<span class="task-actions">
        <button data-toggle="${id}">${completed ? 'Undo' : 'Done'}</button>
        <button data-delete="${id}">Delete</button>
      </span>`
    : '';

  return `<li class="${completedClass}" data-row="${id}">
      <span class="task-desc ${priorityClass}">${escapeHtml(label)}</span>
      <span class="task-time">${escapeHtml(createdAt)}</span>
      ${actions}
    </li>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

