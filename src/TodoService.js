import { TaskBuilder } from './TaskBuilder.js';
export class TodoService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.load();
  }

  addTask(description) {
    const trimmed = this.validate(description);
    return trimmed ? this.store(new TaskBuilder(trimmed).build()) : null;
  }

  addUrgentTask(description) {
    const trimmed = this.validate(description);
    return trimmed ? this.store(new TaskBuilder(trimmed).setPriority('high').addLabel('URGENT').build()) : null;
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
    if (!task) return;
    task.completed = !task.completed;
    this.storage.save(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.storage.save(this.tasks);
  }

  getWorkloadSummary() {
    const done = this.tasks.filter((task) => task.completed).length;
    const urgent = this.tasks.filter((task) => !task.completed && task.priority === 'high').length;
    const normal = this.tasks.filter((task) => !task.completed && task.priority !== 'high').length;
    return `${done}/${this.tasks.length} done - ${urgent} urgent, ${normal} normal remaining`;
  }
}
