// Each state decides the next phase of a task.
export class TaskState {
  next(task) { throw new Error('override me'); }
}

export class OpenState extends TaskState {
  next(task) {
    task.status = 'doing';
    task.desc = `[DOING] ${task.desc}`;
  }
}

export class DoingState extends TaskState {
  next(task) {
    task.status = 'done';
    task.completed = true;
    task.desc = task.desc.replace('[DOING] ', '');
  }
}

export class DoneState extends TaskState {
  next(task) {
    task.status = 'open';
    task.completed = false;
  }
}

// Only the state name is saved with a task; these objects provide its behavior.
const states = {
  open: new OpenState(),
  doing: new DoingState(),
  done: new DoneState(),
};

export function stateOf(task) {
  if (task.status) {
    return states[task.status];
  }
  // Tasks saved before this change have no status.
  return task.completed ? states.done : states.open;
}
