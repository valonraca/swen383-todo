export function createMemoryStorage(initialTasks = []) {
  let tasks = [...initialTasks];

  return {
    load() {
      return tasks;
    },
    save(nextTasks) {
      tasks = nextTasks;
    },
    get savedTasks() {
      return tasks;
    }
  };
}
