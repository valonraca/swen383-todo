export class TaskState {
  next(task) { throw new Error('override me'); }
}

export class OpenState extends TaskState {
  next(task) {                       // Open -> Doing
    task.status = 'doing';
    task.desc = `[DOING] ${task.desc}`;
  }
}

export class DoingState extends TaskState {
  next(task) {                       // Doing -> Done
    task.status = 'done';
    task.completed = true;
    task.desc = task.desc.replace('[DOING] ', '');
  }
}

export class DoneState extends TaskState {
  next(task) {                       // Done -> Open again
    task.status = 'open';
    task.completed = false;
  }
}

// A task is saved as text, so it keeps only the NAME of its state.
// stateOf() turns that name back into the state object.
const states = {
  open: new OpenState(),
  doing: new DoingState(),
  done: new DoneState(),
};

export function stateOf(task) {
  if (task.status) {
    return states[task.status];
  }
  // a task saved before today has no status yet
  return task.completed ? states.done : states.open;
}
