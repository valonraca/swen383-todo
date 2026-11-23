# 1. God Object, src/todo.js
**Where:** src/todo.js, lines 2-144 (class TodoManager)
**Smell:** God Object. TodoManager owns task data, undo history, validation,
localStorage persistence, DOM rendering, and click-handler setup.
**Cost:** Changes to storage, validation, undo behavior, or rendering will
require editing the same class. A storage bug can affect task behavior, and
one change can break several unrelated features.
**Not yet fixing:** noted for Week 3.

# 2. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 75-99 (renderPendingRows and renderCompletedRows)
**Smell:** Duplicated Code. The pending and completed methods contain nearly
identical loops and call buildTaskRow with the same arguments.
**Cost:** A change to row rendering or filtering must be made twice. The copies
can drift, so pending rows and completed rows may begin to behave differently.
**Not yet fixing:** noted for Week 3.

# 3. Long Parameter List, src/todo.js
**Where:** src/todo.js, lines 155-172 (buildTaskRow)
**Smell:** Long Parameter List. buildTaskRow receives six arguments:
id, description, completed state, priority, created time, and showActions.
**Cost:** Adding or reordering task fields makes call sites and the function
signature easy to confuse. It also makes future changes more error-prone,
especially for large classes of task data.
**Not yet fixing:** noted for Week 3.
