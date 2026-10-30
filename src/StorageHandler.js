export class StorageHandler {
  load() {
    throw new Error('override me');
  }

  save(tasks) {
    throw new Error('override me');
  }
}
