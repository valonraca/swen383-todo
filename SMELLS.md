## 1. God Object, src/todo.js

Where: src/todo.js, lines 2–121 (class TodoManager).

Smell: God Object. It stores tasks, validates input, writes to localStorage, and renders the list into the DOM.

Cost: Four separate reasons to change the same class. Storage and interface changes affect the same component, making responsibilities harder to test independently.

Not yet fixing: noted for Week 3.

## 2. Duplicated Code, src/todo.js

Where: src/todo.js, lines 62–78 (renderPendingRows() and renderCompletedRows()).

Smell: Duplicated Code. Both methods loop through tasks and build identical rows. Only the completion condition differs.

Cost: Changes to row generation require updating two places. Missing one can cause inconsistent behavior between the lists.

Not yet fixing: noted for Week 3.

## 3. Long Method, src/todo.js

Where: src/todo.js, lines 80–120 (method render()).

Smell: Long Method. It generates lists, finds the oldest pending task, updates HTML, attaches listeners, animates a row, and updates the page title.

Cost: Multiple operations are mixed together, making the method harder to understand and individual behaviors harder to test.

Not yet fixing: noted for Week 3.

## 4. Long Parameter List, src/todo.js

Where: src/todo.js, lines 124–140 (function buildTaskRow()).

Smell: Long Parameter List. The function takes six positional arguments, five of which belong to the same task object.

Cost: Callers must remember the correct argument order. Adding another task property requires changing the signature and its callers.

Not yet fixing: noted for Week 3.

## 5. Unnecessary Coupling, src/todo.js

Where: src/todo.js, lines 143–160 (function summarizeWorkload()).

Smell: Unnecessary Coupling. The function receives the entire manager even though it only needs its task array.

Cost: The calculation depends on the manager’s internal structure, making it harder to reuse with a standalone task list.

Not yet fixing: noted for Week 3.

## 6. Magic Numbers, src/todo.js

Where: src/todo.js, lines 20, 25, 115, and 125.

Smell: Magic Numbers. Values 3, 20, 1500, and 40 define minimum description length, a warning threshold, animation duration, and truncation length without named constants.

Cost: Readers must infer what each number means. Changing these rules requires locating values scattered across the file.

Not yet fixing: noted for Week 3.