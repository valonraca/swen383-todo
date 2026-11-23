export class TaskState {
  next(task) {
    throw new Error('override me');
  }
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

const states = {
  open: new OpenState(),
  doing: new DoingState(),
  done: new DoneState(),
};

export function stateOf(task) {
  if (task.status) {
    return states[task.status];
  }
  return task.completed ? states.done : states.open;
}
