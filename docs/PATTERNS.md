# Week 6: Creational patterns

## Factory Method

| Role | Implementation |
| --- | --- |
| Product | `StorageHandler` |
| ConcreteProducts | `LocalStorageHandler`, `InMemoryStorageHandler` |
| Creator | `StorageFactory`, with inherited `createService()` |
| ConcreteCreators | `LocalStorageFactory`, `InMemoryStorageFactory` |
| Factory method | `createStorage()` |

The composition root selects `LocalStorageFactory` and asks it for a service.
Subclasses choose storage without a backend-name conditional. At checkpoint
`coursework/week6-factory`, `TodoService.js` is unchanged from Week 5.

Both backends pass domain and browser checks: local tasks survive reloads,
in-memory tasks do not, and the committed default is local storage.
Design record: [Issue #7](https://github.com/ymorina/swen383-todo/issues/7).

## Builder

Product: `Task`. Builder: `TaskBuilder`, initialized with required description
text and configured through `setPriority()` and `addLabel()` before `build()`.

Normal and urgent additions have separate service/controller methods. Both
validate descriptions and store products through shared methods. There is no
task-type string or urgent conditional in the service. Saved fields and renderer
behavior remain compatible with the original app. Done/Undo/Delete still go
through the controller's bound callbacks.

Design record: [Issue #8](https://github.com/ymorina/swen383-todo/issues/8).
The Builder commit resolves [the Week 3 OCP Issue #2](https://github.com/ymorina/swen383-todo/issues/2).

Run the domain tests with `node --test`. The parent workspace's isolated browser
harness also verified both storage choices and all existing UI actions.
