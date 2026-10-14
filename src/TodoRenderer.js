// Handles DOM rendering.
export class TodoRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      throw new Error(`Missing container: ${containerId}`);
    }

    this.actions = {
      onToggle() {},
      onDelete() {},
    };
  }

  bindActions(actions) {
    this.actions = actions;
  }

  createElement(tag, text, className = '') {
    const element = document.createElement(tag);

    if (text !== undefined) {
      element.textContent = text;
    }

    element.className = className;
    return element;
  }

  buildTaskRow(task, justAddedId) {
    const row = this.createElement(
      'li',
      undefined,
      task.completed ? 'completed' : ''
    );

    row.dataset.row = task.id;

    const label =
      task.desc.length > 40
        ? `${task.desc.slice(0, 40)}...`
        : task.desc;

    const description = this.createElement(
      'span',
      label,
      `task-desc${task.priority === 'high' ? ' priority-high' : ''}`
    );

    const time = this.createElement(
      'span',
      task.createdAt,
      'task-time'
    );

    const actions = this.createElement(
      'span',
      undefined,
      'task-actions'
    );

    const toggleButton = this.createElement(
      'button',
      task.completed ? 'Undo' : 'Done'
    );

    toggleButton.type = 'button';

    toggleButton.addEventListener('click', () => {
      try {
        this.actions.onToggle(task.id);
      } catch (error) {
        console.error(error);
        this.showError('Could not update the task.');
      }
    });

    const deleteButton = this.createElement('button', 'Delete');
    deleteButton.type = 'button';

    deleteButton.addEventListener('click', () => {
      try {
        this.actions.onDelete(task.id);
      } catch (error) {
        console.error(error);
        this.showError('Could not delete the task.');
      }
    });

    actions.append(toggleButton, deleteButton);
    row.append(description, time, actions);

    if (task.id === justAddedId) {
      row.classList.add('flash');

      setTimeout(() => {
        row.classList.remove('flash');
      }, 1500);
    }

    return row;
  }

  renderRows(tasks, emptyMessage, justAddedId) {
    const list = this.createElement('ul');

    if (tasks.length === 0) {
      list.append(this.createElement('li', emptyMessage));
    }

    for (const task of tasks) {
      list.append(this.buildTaskRow(task, justAddedId));
    }

    return list;
  }

  render(service, justAddedId) {
    const pending = service.getPendingTasks();
    const completed = service.getCompletedTasks();
    const { oldest } = service.getSummary();

    const status =
      `${service.getWorkloadSummary()} - oldest: ${oldest}`;

    this.container.replaceChildren(
      this.createElement('p', status, 'status'),

      this.createElement('h2', 'To do', 'section-title'),

      this.renderRows(
        pending,
        'Nothing pending. Add a task above.',
        justAddedId
      ),

      this.createElement('h2', 'Completed', 'section-title'),

      this.renderRows(
        completed,
        'Nothing completed yet.',
        justAddedId
      )
    );

    document.title = `Todo (${pending.length})`;
  }

  showError(message) {
    window.alert(message);
  }
}