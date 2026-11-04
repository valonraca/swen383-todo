export class StorageHandler {
  load() {
    throw new Error('Storage handlers must implement load()');
  }

  save(tasks) {
    throw new Error('Storage handlers must implement save(tasks)');
  }
}
