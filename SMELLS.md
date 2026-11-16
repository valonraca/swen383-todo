# Week 1: three code smells in the Todo App

These findings describe the original `src/todo.js` at starter commit
`b32ff422` (use `git show coursework/starter:src/todo.js` to inspect that version).
Line numbers refer to the original file, before the later refactoring.

## 1. God Object, src/todo.js

**Where:** `src/todo.js`, lines 2–121 (`TodoManager`); persistence at 9–16,
task operations at 18–60, and rendering at 62–120.

**Smell:** God Object. The same class owns task data, validates descriptions,
creates tasks, reads/writes browser storage, builds the page, binds buttons,
handles the new-task animation, and changes the document title.

**Cost:** Storage, business rules, and visual changes all require editing the
same class. Replacing persistence or testing validation separately means also
dealing with its browser/DOM dependencies, and a UI change can disrupt task logic.

**Not yet fixing:** noted for Week 3.

## 2. Duplicated Code, src/todo.js

**Where:** `src/todo.js`, lines 62–78 (`renderPendingRows` and
`renderCompletedRows`), especially the repeated row calls at 66 and 75.

**Smell:** Duplicated Code. Both methods initialize HTML, iterate over the same
array, select tasks using opposite completion conditions, pass the same six
properties to the row helper, and return accumulated markup.

**Cost:** A new row argument or a change in list-building behavior has to be
applied in two places. Missing one edit can make pending and completed tasks
display differently after the same user action.

**Not yet fixing:** recorded for a later refactoring; Weeks 3–5 retain these
method bodies while moving their responsibility into the renderer.

## 3. Feature Envy, src/todo.js

**Where:** `src/todo.js`, lines 143–160 (the free workload-summary function),
particularly array access at 148 and 158 and the task-property checks at 149–154.

**Smell:** Feature Envy. An external function reaches into `manager.tasks`,
counts completed, urgent, and normal tasks, and reads the array length. The
information needed for the calculation belongs to the manager.

**Cost:** Changing how task completion, priority, or the collection is represented
requires changing code outside the object that owns it. The summary cannot be
encapsulated with the task rules, so callers become coupled to that representation.

**Not yet fixing:** noted for Week 4's Information Expert responsibility decision.
