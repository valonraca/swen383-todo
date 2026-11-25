// src/StorageGroup.js
import { StorageHandler } from './StorageHandler.js';

// A group of storage handlers that is itself a storage handler.
export class StorageGroup extends StorageHandler {
  constructor() {
    super();
    this.members = [];
  }

  add(handler) {
    this.members.push(handler);
  }

  load() {
    return this.members[0].load();   // read from the first member
  }

  save(tasks) {
    for (const member of this.members) {
      member.save(tasks);            // every member saves
    }
  }
}
