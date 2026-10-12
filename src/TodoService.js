export class TodoService {
  constructor(storageHandler) {
    this.storageHandler = storageHandler;
    this.tasks = this.storageHandler.load();
  }

  addTask(description, type) {
    const trimmed = description.trim();
    if (trimmed.length < 3) {
      alert('Task needs at least a few characters.');
      return null;
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
    this.storageHandler.save(this.tasks);
    return task.id;
  }

  toggleComplete(id) {
    const task = this.tasks.find(item => item.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.storageHandler.save(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(item => item.id !== id);
    this.storageHandler.save(this.tasks);
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
