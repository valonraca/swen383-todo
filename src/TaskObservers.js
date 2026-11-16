export class TaskObserver {
  update(tasks) { throw new Error('override me'); }
}


export class TaskCounter extends TaskObserver {
  update(tasks) {
    const open = tasks.filter(t => !t.completed).length;
    const done = tasks.length - open;
    document.getElementById('task-counter').textContent =
      `Open: ${open} · Done: ${done}`;
  }
}