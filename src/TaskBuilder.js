// src/TaskBuilder.js
// Builder: assembles a Task from one required part (the text) and optional ones.
import { Task } from './Task.js';

export class TaskBuilder {
  constructor(desc) {            // the one required part
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
