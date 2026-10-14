import { TaskBuilder } from './TaskBuilder.js';

// Owns task data and business logic.
export class TodoService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.load();
  }

  addTask(description) {
    const trimmed = this.validate(description);
    if (!trimmed) return null;

    const task = new TaskBuilder(trimmed).build();
    return this.store(task);
  }

  addUrgentTask(description) {
    const trimmed = this.validate(description);
    if (!trimmed) return null;

    const task = new TaskBuilder(trimmed)
      .setPriority('high')
      .addLabel('URGENT')
      .build();

    return this.store(task);
  }

  validate(description) {
    const trimmed = description.trim();

    if (trimmed.length < 3) {
      return null;
    }

    if (this.tasks.length >= 20) {
      console.warn(
        'This list is getting long - consider clearing completed tasks.'
      );
    }

    return trimmed;
  }

  store(task) {
    // Preserve unique IDs when tasks are created quickly.
    while (this.tasks.some(existing => existing.id === task.id)) {
      task.id++;
    }

    this.tasks.push(task);
    this.storage.save(this.tasks);
    return task.id;
  }

  toggleComplete(id) {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      task.completed = !task.completed;
      this.storage.save(this.tasks);
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.storage.save(this.tasks);
  }

  getPendingTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  getSummary() {
    const pending = this.getPendingTasks();

    const urgent = pending.filter(
      task => task.priority === 'high'
    ).length;

    return {
      total: this.tasks.length,
      done: this.tasks.length - pending.length,
      urgent,
      normal: pending.length - urgent,
      oldest: pending[0]?.desc ?? 'none',
    };
  }

  getWorkloadSummary() {
    let done = 0;
    let urgent = 0;
    let normal = 0;

    for (const task of this.tasks) {
      if (task.completed) {
        done++;
      } else if (task.priority === 'high') {
        urgent++;
      } else {
        normal++;
      }
    }

    return `${done}/${this.tasks.length} done - ${urgent} urgent, ${normal} normal remaining`;
  }
}