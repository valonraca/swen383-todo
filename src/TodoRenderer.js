export class TodoRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  renderPendingRows(tasks) {
    let html = '';
    for (const task of tasks) {
      if (task.completed) continue;
      html += this.buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  renderCompletedRows(tasks) {
    let html = '';
    for (const task of tasks) {
      if (!task.completed) continue;
      html += this.buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  render(service, justAddedId) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows(service.tasks);
    const completedHtml = this.renderCompletedRows(service.tasks);

    let oldestPendingLabel = 'none';
    for (const task of service.tasks) {
      if (!task.completed) {
        oldestPendingLabel = task.desc;
        break;
      }
    }

    this.container.innerHTML =
      `<p class="status">${service.getWorkloadSummary()} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    if (justAddedId) {
      const row = this.container.querySelector(`[data-row="${justAddedId}"]`);
      if (row) {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 1500);
      }
    }

    document.title = `Todo (${service.tasks.filter(t => !t.completed).length})`;
  }

  buildTaskRow(id, desc, completed, priority, createdAt, showActions) {
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
        <span class="task-desc ${priorityClass}">${label}</span>
        <span class="task-time">${createdAt}</span>
        ${actions}
      </li>`;
  }
}
