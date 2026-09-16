// TodoManager owns the whole app: task data, persistence, and rendering.
class TodoManager {
  constructor(containerId) {
    this.tasks = [];
    this.container = document.getElementById(containerId);
    this.loadTasks();
  }

  loadTasks() {
    const raw = localStorage.getItem('todo-tasks');
    this.tasks = raw ? JSON.parse(raw) : [];
  }

  saveTasks() {
    localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
  }

  addTask(description, type) {
    const trimmed = description.trim();
    if (trimmed.length < 3) {
      alert('Task needs at least a few characters.');
      return false;
    }

    if (this.tasks.length >= 20) {
      console.warn('This list is getting long - consider clearing completed tasks.');
    }

    const task = {
      id: Date.now(),
      desc: trimmed,
      completed: false,
      priority: 'normal',
      createdAt: new Date().toLocaleTimeString()
    };

    if (type === 'urgent') {
      task.priority = 'high';
      task.desc = `[URGENT] ${trimmed}`;
    }

    this.tasks.push(task);
    this.saveTasks();
    this.render(task.id);
    return true;
  }

  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.saveTasks();
    this.render();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  renderPendingRows() {
    let html = '';
    for (const task of this.tasks) {
      if (task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  renderCompletedRows() {
    let html = '';
    for (const task of this.tasks) {
      if (!task.completed) continue;
      html += buildTaskRow(task.id, task.desc, task.completed, task.priority, task.createdAt, true);
    }
    return html;
  }

  render(justAddedId) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows();
    const completedHtml = this.renderCompletedRows();

    let oldestPendingLabel = 'none';
    for (const task of this.tasks) {
      if (!task.completed) {
        oldestPendingLabel = task.desc;
        break;
      }
    }

    this.container.innerHTML =
      `<p class="status">${summarizeWorkload(this)} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    const toggleButtons = this.container.querySelectorAll('[data-toggle]');
    for (const btn of toggleButtons) {
      btn.addEventListener('click', () => this.toggleComplete(Number(btn.dataset.toggle)));
    }

    const deleteButtons = this.container.querySelectorAll('[data-delete]');
    for (const btn of deleteButtons) {
      btn.addEventListener('click', () => this.deleteTask(Number(btn.dataset.delete)));
    }

    if (justAddedId) {
      const row = this.container.querySelector(`[data-row="${justAddedId}"]`);
      if (row) {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 1500);
      }
    }

    document.title = `Todo (${this.tasks.filter(t => !t.completed).length})`;
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
      <span class="task-desc ${priorityClass}">${label}</span>
      <span class="task-time">${createdAt}</span>
      ${actions}
    </li>`;
}

// A quick one-line summary of where the list stands, for the status bar.
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

window.addEventListener('DOMContentLoaded', () => {
  const app = new TodoManager('task-container');
  app.render();

  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  const addUrgentBtn = document.getElementById('add-urgent-btn');

  addBtn.addEventListener('click', () => {
    if (app.addTask(input.value, 'simple')) {
      input.value = '';
    }
  });

  addUrgentBtn.addEventListener('click', () => {
    if (app.addTask(input.value, 'urgent')) {
      input.value = '';
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addBtn.click();
    }
  });
});

