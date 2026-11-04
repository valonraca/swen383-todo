export class Task {
  constructor(builder) {
    this.id = Date.now();
    this.desc = builder.desc;
    this.completed = false;
    this.priority = builder.priority;
    this.createdAt = new Date().toLocaleTimeString();
  }
}
