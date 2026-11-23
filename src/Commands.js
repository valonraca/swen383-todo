export class Command {
  execute() {
    throw new Error('override me');
  }

  undo() {
    throw new Error('override me');
  }
}

export class AddTaskCommand extends Command {
  constructor(controller, description) {
    super();
    this.controller = controller;
    this.description = description;
  }

  execute() {
    this.id = this.controller.addTask(this.description);
    return this.id;
  }

  undo() {
    this.controller.removeTask(this.id);
  }
}

export class CommandHistory {
  constructor() {
    this.done = [];
  }

  run(command) {
    if (command.execute()) {
      this.done.push(command);
    }
  }

  undo() {
    const last = this.done.pop();
    if (last) {
      last.undo();
    }
  }
}
