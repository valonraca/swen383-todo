import { StorageHandler } from './StorageHandler.js';

export class StorageGroup extends StorageHandler {
  constructor() {
    super();
    this.members = [];
  }

  add(handler) {
    this.members.push(handler);
  }

  load() {
    return this.members[0].load();
  }

  save(tasks) {
    for (const member of this.members) {
      member.save(tasks);
    }
  }
}