// ======================================================
// ToDoService
// Responsible for task data and task operations
// ======================================================

class ToDoService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.load();
  }

  addTask(description, type) {
    const trimmed = description.trim();

    if (trimmed.length < 3) {
      alert('Task needs at least a few characters.');
      return false;
    }

    if (this.tasks.length >= 20) {
      console.warn(
        'This list is getting long - consider clearing completed tasks.'
      );
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
    this.storage.save(this.tasks);

    return true;
  }

  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);

    if (!task) return;

    task.completed = !task.completed;
    this.storage.save(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.storage.save(this.tasks);
  }

  getTasks() {
    return this.tasks;
  }
}


// ======================================================
// TodoStorage
// Responsible only for saving and loading tasks
// ======================================================

class TodoStorage {
  save(tasks) {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }

  load() {
    const raw = localStorage.getItem('todo-tasks');

    return raw ? JSON.parse(raw) : [];
  }
}


// ======================================================
// TodoRender
// Responsible only for displaying tasks
// ======================================================

class TodoRender {
  constructor(container) {
    this.container = container;
  }

  render(tasks) {
    if (!this.container) return;

    const pendingHtml = this.renderPendingRows(tasks);
    const completedHtml = this.renderCompletedRows(tasks);

    let oldestPendingLabel = 'none';

    for (const task of tasks) {
      if (!task.completed) {
        oldestPendingLabel = task.desc;
        break;
      }
    }

    this.container.innerHTML =
      `<p class="status">${this.summarizeWorkload(tasks)} - oldest: ${oldestPendingLabel}</p>` +
      '<h2 class="section-title">To do</h2>' +
      `<ul>${pendingHtml || '<li>Nothing pending. Add a task above.</li>'}</ul>` +
      '<h2 class="section-title">Completed</h2>' +
      `<ul>${completedHtml || '<li>Nothing completed yet.</li>'}</ul>`;

    document.title =
      `Todo (${tasks.filter(t => !t.completed).length})`;
  }

  renderPendingRows(tasks) {
    let html = '';

    for (const task of tasks) {
      if (task.completed) continue;

      html += this.renderTaskRow(task);
    }

    return html;
  }

  renderCompletedRows(tasks) {
    let html = '';

    for (const task of tasks) {
      if (!task.completed) continue;

      html += this.renderTaskRow(task);
    }

    return html;
  }

  renderTaskRow(task) {
    const label =
      task.desc.length > 40
        ? `${task.desc.slice(0, 40)}...`
        : task.desc;

    const priorityClass =
      task.priority === 'high'
        ? 'priority-high'
        : '';

    const completedClass =
      task.completed
        ? 'completed'
        : '';

    return `<li class="${completedClass}" data-row="${task.id}">
      <span class="task-desc ${priorityClass}">${label}</span>
      <span class="task-time">${task.createdAt}</span>

      <span class="task-actions">
        <button data-toggle="${task.id}">
          ${task.completed ? 'Undo' : 'Done'}
        </button>

        <button data-delete="${task.id}">
          Delete
        </button>
      </span>
    </li>`;
  }

  summarizeWorkload(tasks) {
    let done = 0;
    let urgent = 0;
    let normal = 0;

    for (const task of tasks) {
      if (task.completed) {
        done++;
      } else if (task.priority === 'high') {
        urgent++;
      } else {
        normal++;
      }
    }

    const total = tasks.length;

    return `${done}/${total} done - ${urgent} urgent, ${normal} normal remaining`;
  }
}


// ======================================================
// TodoManager
// Responsible for connecting the service, storage,
// renderer, and user events
// ======================================================

class TodoManager {
  constructor(containerId) {
    const container = document.getElementById(containerId);

    this.storage = new TodoStorage();
    this.service = new ToDoService(this.storage);
    this.renderer = new TodoRender(container);

    this.setupEvents();
    this.render();
  }

  render(justAddedId) {
    const tasks = this.service.getTasks();

    this.renderer.render(tasks);

    // Flash the newly added task
    if (justAddedId) {
      const row = this.renderer.container.querySelector(
        `[data-row="${justAddedId}"]`
      );

      if (row) {
        row.classList.add('flash');

        setTimeout(() => {
          row.classList.remove('flash');
        }, 1500);
      }
    }
  }

  setupEvents() {
    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');

    // Add normal task
    addBtn.addEventListener('click', () => {
      if (this.service.addTask(input.value, 'simple')) {
        input.value = '';
        this.render();
      }
    });

    // Add urgent task
    addUrgentBtn.addEventListener('click', () => {
      if (this.service.addTask(input.value, 'urgent')) {
        input.value = '';
        this.render();
      }
    });

    // Press Enter to add normal task
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        addBtn.click();
      }
    });

    // Handle Done/Undo/Delete buttons
    this.renderer.container.addEventListener('click', event => {
      const toggleButton = event.target.closest('[data-toggle]');
      const deleteButton = event.target.closest('[data-delete]');

      if (toggleButton) {
        const id = Number(toggleButton.dataset.toggle);

        this.service.toggleComplete(id);
        this.render();
      }

      if (deleteButton) {
        const id = Number(deleteButton.dataset.delete);

        this.service.deleteTask(id);
        this.render();
      }
    });
  }
}


// ======================================================
// Start the application
// ======================================================

window.addEventListener('DOMContentLoaded', () => {
  new TodoManager('task-container');
});