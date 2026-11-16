# Weeks 6–7, 9, and 11: Pattern roles

## Factory Method

| Role | Implementation |
| --- | --- |
| Product | `StorageHandler` |
| ConcreteProducts | `LocalStorageHandler`, `InMemoryStorageHandler`, and the `StorageGroup` containing active-list/archive leaves |
| Creator | `StorageFactory`, with inherited `createService()` |
| ConcreteCreators | `LocalStorageFactory`, `InMemoryStorageFactory`, `ArchivingStorageFactory` |
| Factory method | `createStorage()` |

Week 6 selected `LocalStorageFactory`; Week 9 selects `ArchivingStorageFactory`.
The composition root asks its chosen factory for a service.
Subclasses choose storage without a backend-name conditional. At checkpoint
`coursework/week6-factory`, `TodoService.js` is unchanged from Week 5.

Both backends pass domain and browser checks: local tasks survive reloads,
in-memory tasks do not. The current default also retains an append-only archive.
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

## Composite

- Component: `StorageHandler`, exposing `load()` and `save(tasks)`.
- Leaves in the default group: `LocalStorageHandler` and `ArchiveStorageHandler`.
- Composite: `StorageGroup`, holding Component members while itself satisfying
  the same storage API. Groups can contain other groups.
- Factory: `ArchivingStorageFactory`, adding the active-list leaf first and archive
  leaf second.

The service makes one `save()` call. The group forwards it to both leaves.
Loading reads only the first member, so deleted archive entries cannot reappear
in the active list after reload. Archive saves append previously unseen IDs and
never remove or overwrite an existing record; completion changes do not rewrite
the first-saved snapshot. Existing active tasks enter the archive on the next save.

Design record: [Issue #11](https://github.com/ymorina/swen383-todo/issues/11).

## Protection Proxy

- Proxy: `ConfirmDeleteProxy`, matching the six-member service surface.
- Immediate real object: the `LoggingTodoServiceDecorator` around `TodoService`.
- Controlled operation: `deleteTask(id)`, delegated only after the browser's
  `confirm('Delete this task?')` returns true.

The composition root creates `ConfirmDeleteProxy(LoggingTodoServiceDecorator(service))`.
Cancel stops the real deletion and all storage writes. OK removes the active
record through the decorator and service, while the Composite retains its archive
record. Five other members pass through, including the live `tasks` getter.
The existing controller still requests rendering after either response; on
Cancel it simply redraws the same list. The domain, controller, renderer, and
original active-list handler need no changes.

Design record: [Issue #12](https://github.com/ymorina/swen383-todo/issues/12).
See [sequence-delete-task.puml](sequence-delete-task.puml) for both outcomes.

## Observer

| Role | Implementation |
| --- | --- |
| Subject | `TodoService`, with `observers`, `subscribe(observer)`, and `notify()` |
| Observer | `TaskObserver`, exposing `update(tasks)` |
| ConcreteObserver | `TaskCounter`, displaying `Open: n · Done: n` |
| Client | `main.js`, subscribing and initially updating the counter |

The Subject saves first, then notifies after `store`, `toggleComplete`, and
`deleteTask`. It never names TaskCounter or accesses the DOM. Main retains the
raw `todoService` before wrapping it, so the proxy and decorator do not need a
subscription method. Invalid additions and canceled deletes do not notify.

## Command

| Role | Implementation |
| --- | --- |
| Command | `Command`, defining `execute()` / `undo()` |
| ConcreteCommand | `AddTaskCommand`, capturing the description and returned task ID |
| Receiver | `TodoController`, through `addTask()` / `removeTask()` |
| Invoker | `CommandHistory`, storing successful commands in a last-in-first-out stack |
| Client | `main.js`, creating commands for normal Add and Enter and wiring Undo |

Only successful normal additions enter the history. Urgent additions and
suggestions use their existing paths. Undo calls the receiver, which routes
deletion through the same proxy/decorator and storage group. Observer updates
the counter automatically after an accepted deletion. The history is transient.

The supplied sample pops an entry before asking for confirmation. Cancel leaves
the task but consumes that entry, and a fresh Undo moves to the next command.
The implementation preserves this specified behavior. Normal Add also clears
the field unconditionally, while rejected commands are not stored. No Redo or
Undo for other actions is introduced. See [sequence-undo-task.puml](sequence-undo-task.puml).

Run the twenty-five domain tests with `node --test`. The parent workspace's isolated
browser harness also verified both storage choices, all existing UI actions,
all suggestions, logging order/counts, invalid-input behavior, archive retention,
both delete-confirmation choices, live counter updates, and Command history scope,
ordering, invalid additions, empty history, cancellation, and reload behavior.
