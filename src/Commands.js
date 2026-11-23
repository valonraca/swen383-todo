// src/Commands.js

// The Command
export class Command {
    execute() { throw new Error('override me'); }
    undo() { throw new Error('override me'); }
}

// A ConcreteCommand: add a task, and take it back
export class AddTaskCommand extends Command {
    constructor(controller, description) {
        super();
        this.controller = controller;     // the Receiver
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

// The Invoker: runs commands and keeps them for Undo
export class CommandHistory {
    constructor() {
        this.done = [];
    }
    run(command) {
        if (command.execute()) {          // keep only adds that worked
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
