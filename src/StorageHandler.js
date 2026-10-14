// src/StorageHandler.js
// Product: what every storage backend must offer.
export class StorageHandler {
  load() { throw new Error('override me'); }
  save(tasks) { throw new Error('override me'); }
}