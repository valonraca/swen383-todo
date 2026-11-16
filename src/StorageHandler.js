// Product: the interface shared by storage backends.
export class StorageHandler {
  load() { throw new Error('override me'); }
  save(tasks) { throw new Error('override me'); }
}
