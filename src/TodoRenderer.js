export class TodoRenderer {
  constructor(containerId, todoService) {
    this.container = document.getElementById(containerId);
    this.todoService = todoService;
  }

  bindControls() {
    const input = document.getElementById('task-input');
    const addButton = document.getElementById('add-task-btn');
    const addUrgentButton = document.getElementById('add-urgent-btn');

    addButton.addEventListener('click', () => this.addTask(input, 'simple'));
    addUrgentButton.addEventListener('click', () => this.addTask(input, 'urgent'));
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') addButton.click();
    });
  }

  addTask(input, type) {
    const task = this.todoService.addTask(input.value, type);
    if (!task) return;
    input.value = '';
    this.render(task.id);
  }

  renderPendingRows() {
    return this.todoService.tasks
      .filter(task => !task.completed)
      .map(task => this.buildTaskRow(task))
      .join('');
  }

  renderCompletedRows() {
    return this.todoService.tasks
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

  summarizeWorkload() {
    let done = 0;
    let urgent = 0;
    let normal = 0;

    for (const task of this.todoService.tasks) {
      if (task.completed) {
        done++;
      } else if (task.priority === 'high') {
        urgent++;
      } else {
        normal++;
      }
    }

    return `${done}/${this.todoService.tasks.length} done - ${urgent} urgent, ${normal} normal remaining`;
  }

  render(justAddedId) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows();
    const completedHtml = this.renderCompletedRows();
    const oldestPending = this.todoService.tasks.find(task => !task.completed);
    const oldestPendingLabel = oldestPending ? oldestPending.desc : 'none';

    this.container.innerHTML =
      `<p class="status">${this.summarizeWorkload()} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    for (const button of this.container.querySelectorAll('[data-toggle]')) {
      button.addEventListener('click', () => {
        this.todoService.toggleComplete(Number(button.dataset.toggle));
        this.render();
      });
    }

    for (const button of this.container.querySelectorAll('[data-delete]')) {
      button.addEventListener('click', () => {
        this.todoService.deleteTask(Number(button.dataset.delete));
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

    document.title = `Todo (${this.todoService.tasks.filter(task => !task.completed).length})`;
  }
}