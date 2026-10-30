import { TaskBuilder } from './TaskBuilder.js';

export class TodoService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.load();
  }

  addTask(description) {
    const trimmed = this.validate(description);
    if (!trimmed) {
      return null;
    }

    const task = new TaskBuilder(trimmed).build();
    return this.store(task);
  }

  addUrgentTask(description) {
    const trimmed = this.validate(description);
    if (!trimmed) {
      return null;
    }

    const task = new TaskBuilder(trimmed)
      .setPriority('high')
      .addLabel('URGENT')
      .build();
    return this.store(task);
  }

  validate(description) {
    const trimmed = description.trim();
    if (trimmed.length < 3) {
      alert('Task needs at least a few characters.');
      return null;
    }

    if (this.tasks.length >= 20) {
      console.warn('This list is getting long - consider clearing completed tasks.');
    }

    return trimmed;
  }

  store(task) {
    this.tasks.push(task);
    this.storage.save(this.tasks);
    return task.id;
  }

  toggleComplete(id) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      return;
    }

    task.completed = !task.completed;
    this.storage.save(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.storage.save(this.tasks);
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
