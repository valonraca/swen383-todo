# Weeks 6–7: Pattern roles

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

## Adapter

- Target method: `getSuggestion()`, returning a plain description string.
- Adapter: `IdeaBoxAdapter`, formatting `title` and `minutes` for the app.
- Adaptee: the supplied `IdeaBox`, exposing `pickRandomIdea()` and left unchanged.
- Client: `main.js`, forwarding the result to `controller.addTask()`.

The domain service and controller contain no IdeaBox dependency. All three
supplied ideas pass adapter and browser checks, including persistence and normal
completion/deletion. Design record: [Issue #9](https://github.com/ymorina/swen383-todo/issues/9).

## Decorator

- Component: `TodoService` through the app's six-member public surface.
- Decorator: `LoggingTodoServiceDecorator`, holding the component and exposing
  normal/urgent add methods, task getter, completion, deletion, and summary.

The composition root wraps the factory-created service. Both adding methods log
before delegation and preserve the returned ID or null. Other methods delegate;
the task getter reflects the real array even when deletion replaces that array.
The supplied implementation logs rejected add attempts too, since logging occurs
before validation. Service, controller, renderer, and the supplied IdeaBox have
no changes for this step. Design record: [Issue #10](https://github.com/ymorina/swen383-todo/issues/10).

Run the twelve domain tests with `node --test`. The parent workspace's isolated
browser harness also verified both storage choices, all existing UI actions,
all suggestions, logging order/counts, and invalid-input behavior.
