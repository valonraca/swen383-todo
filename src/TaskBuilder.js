import { Task } from './Task.js';

export class TaskBuilder {
  constructor(desc) {
    this.desc = desc;
    this.priority = 'normal';
  }

  setPriority(priority) {
    this.priority = priority;
    return this;
  }

  addLabel(label) {
    this.desc = `[${label}] ${this.desc}`;
    return this;
  }

  build() {
    return new Task(this);
  }
}
