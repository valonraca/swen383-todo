// State Pattern: each phase determines the next phase.
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

// Persist only state names, not objects with methods.
const states = {
  open: new OpenState(),
  doing: new DoingState(),
  done: new DoneState()
};

export function stateOf(task) {
  return states[task.status] ??
    (task.completed ? states.done : states.open);
}
