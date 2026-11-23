export class TodoRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.actions = { onToggle() {}, onDelete() {} };
  }

  bindActions(actions) {
    this.actions = actions;
  }

  renderPendingRows(service) {
    return service.tasks
      .filter(task => !task.completed)
      .map(task => this.buildTaskRow(task))
      .join('');
  }

  renderCompletedRows(service) {
    return service.tasks
      .filter(task => task.completed)
      .map(task => this.buildTaskRow(task))
      .join('');
  }

  buildTaskRow(task) {
    const label = task.desc.length > 40 ? `${task.desc.slice(0, 40)}...` : task.desc;
    const priorityClass = task.priority === 'high' ? 'priority-high' : '';
    const completedClass = task.completed ? 'completed' : '';

    return `<li class="${completedClass}" data-row="${task.id}">
      <span class="task-desc ${priorityClass}">${label}</span>
      <span class="task-time">${task.createdAt}</span>
      <span class="task-actions">
        <button data-toggle="${task.id}">${task.completed ? 'Undo' : 'Done'}</button>
        <button data-delete="${task.id}">Delete</button>
      </span>
    </li>`;
  }

  render(service, justAddedId) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows(service);
    const completedHtml = this.renderCompletedRows(service);
    const oldestPending = service.tasks.find(task => !task.completed);
    const oldestPendingLabel = oldestPending ? oldestPending.desc : 'none';

    this.container.innerHTML =
      `<p class="status">${service.getWorkloadSummary()} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    for (const button of this.container.querySelectorAll('[data-toggle]')) {
      button.addEventListener('click', () => this.actions.onToggle(Number(button.dataset.toggle)));
    }

    for (const button of this.container.querySelectorAll('[data-delete]')) {
      button.addEventListener('click', () => this.actions.onDelete(Number(button.dataset.delete)));
    }

    if (justAddedId) {
      const row = this.container.querySelector(`[data-row="${justAddedId}"]`);
      if (row) {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 1500);
      }
    }

    document.title = `Todo (${service.tasks.filter(task => !task.completed).length})`;
  }
}