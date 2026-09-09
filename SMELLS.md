## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 14-96 (class TodoManager)
**Smell:** God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.
**Cost:** Four unrelated reasons to change this file. Adding a
second storage option means editing the same class that owns
validation, so a storage bug can break validation.
**Not yet fixing:** noted for Week 3.

## 2. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 62-78 (renderPendingRows and
renderCompletedRows)
**Smell:** Duplicated Code. The two methods are almost
identical loops over `this.tasks`, differing only in whether
they skip completed or pending tasks, and both call
`buildTaskRow` the same way.
**Cost:** Any change to how a row is built or filtered has to
be made in two places. It's easy to update one method and
forget the other, letting the two lists drift out of sync.
**Not yet fixing:** noted for Week 3.

## 3. Magic Numbers, src/todo.js
**Where:** src/todo.js, lines 10, 15, 20, 25, 125
**Smell:** Magic Numbers / Hardcoded Literals. The
localStorage key `'todo-tasks'` is typed twice (lines 10, 15),
the minimum description length `3` (line 20), the task-count
warning threshold `20` (line 25), and the label truncation
length `40` (line 125) all appear as bare literals with no
named constant.
**Cost:** These values carry no explanation of what they mean,
so changing one requires hunting through the file, and a typo
in one copy of a repeated literal (like the storage key) fails
silently instead of raising an error.
**Not yet fixing:** noted for Week 3.
