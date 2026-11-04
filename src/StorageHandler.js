export class StorageHandler {
  load() {
    throw new Error('load() must be implemented');
  }

  save(tasks) {
    throw new Error('save() must be implemented');
  }
}
