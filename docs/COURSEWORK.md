# SWEN-383 Weeks 1–7

Repository: <https://github.com/ymorina/swen383-todo>.
Verified course starter: <https://github.com/valonraca/swen383-todo>, commit
`b32ff422b2560d5987b6d686e4b05a3df10da855`.

## Deliverables

| Week | Work completed | Preserved checkpoint |
| --- | --- | --- |
| 1 | Fork and clone; original-app browser checks; three source-specific smells in root `SMELLS.md`; commit and push | `coursework/week1` |
| 2 | Class diagram of the actual original code and successful Add sequence; PlantUML sources and rendered SVGs; commit and push | `coursework/week2` |
| 3 | File SRP/OCP/DIP Issues before changes; record the responsibility split; separate classes in the original file; verify; inject storage and split modules; push feature branch | `coursework/week3`, `feat/solid-refactoring` |
| 4 | Merge Week 3; file Controller/Creator/Information Expert Issues before changes; coordinate all actions through the controller; bind callbacks; verify Creator; move summary to service; push feature branch | `coursework/week4`, `feat/grasp-controller` |
| 5 | Replay Week 3/4 from the Week 2 baseline; preserve original feature history; update diagrams; verify the five-file design; push review branch and merge into `main` | `coursework/week5`, `feat/w3-w4-refactor` |
| 6 | Factory Method for local/in-memory storage; Builder for normal/urgent task recipes; ten source files; domain and browser tests; two design Issues; merge into `main` | `coursework/week6`, `feat/creational-patterns` |
| 7 | Adapter for unchanged IdeaBox; Get Suggestion; logging Decorator; unchanged service/controller/renderer; two design Issues; merge into `main` | `coursework/week7`, `feat/structural-patterns` |

The intermediate Week 3 classes live together in `todo.js` until the design
works. Storage construction then moves into `main.js`, which injects a handler
with `load()` and `save(tasks)`. The final service contains no direct browser
storage calls or DOM rendering. The renderer reads data and invokes callbacks;
the controller delegates domain mutations and requests redraws.

## GitHub Issues

| Issue | Decision | Intended final state |
| --- | --- | --- |
| [#1: SRP](https://github.com/ymorina/swen383-todo/issues/1) | Separate domain, rendering, and persistence | Closed by the linked fix on `main` |
| [#2: OCP](https://github.com/ymorina/swen383-todo/issues/2) | Replace the urgent-task conditional with Builder recipes | Resolved in Week 6 |
| [#3: DIP](https://github.com/ymorina/swen383-todo/issues/3) | Inject the storage contract | Closed by the linked fix on `main` |
| [#4: Controller](https://github.com/ymorina/swen383-todo/issues/4) | Coordinate Add, Done/Undo, and Delete | Closed by the linked fix on `main` |
| [#5: Creator](https://github.com/ymorina/swen383-todo/issues/5) | Service owns the collection and constructs task records | Closed with a verification comment |
| [#6: Information Expert](https://github.com/ymorina/swen383-todo/issues/6) | Service calculates its workload summary | Closed by the linked fix on `main` |

## Diagram history

The `.puml` files on `main` describe the current code. Their adjacent SVG files
are rendered previews. The original Week 2 versions remain in `coursework/week2`.
Only `TodoManager` is a declared class in the original source. Week 6 adds actual
storage base classes and factory subclasses plus Task/TaskBuilder. Week 7 adds
IdeaBox, its Adapter, and a service logging Decorator. Helpers and browser APIs
are marked separately. Previous diagrams remain in the weekly tags.

The four design records for Weeks 6–7 are listed in [PATTERNS.md](PATTERNS.md).
The fork's `main` and each completed weekly feature branch are pushed. A pull
request to `valonraca/swen383-todo:main` presents the full accumulated commit
history, including the earlier Weeks 1–5 work, for instructor review.

## Student-handled submissions

The student chose to submit the repository URL and team declaration in myCourses
personally. Those submissions have not been performed or verified by this agent.

Submit `https://github.com/ymorina/swen383-todo` for the repository. The team form
requires a team of 3–4 actual members, its name, and a contact person. The student
has a team; GitHub invitations are pending until teammates' usernames are supplied.

## Deliberately deferred work

The urgent-task conditional was retained through Week 5 and removed in Week 6.
The duplicated list loops, six-parameter row helper, and numeric literals remain
outside the current labs. Prototype and Singleton are deliberately not introduced.
