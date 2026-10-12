## 1. God Object, src/todo.js

**Where:** src/todo.js, lines 2-121 (class TodoManager)

**Smell:** God Object. The TodoManager class does too many things. It stores the tasks, checks the input, saves data in localStorage, changes task status, and renders the tasks on the page.

**Cost:** The class has several different reasons to change. For example, if I change how tasks are stored, I still have to edit the same class that handles validation and rendering. This makes it easier for one change to cause problems in another part of the class.

**Not yet fixing:** noted for Week 3.


## 2. Duplicated Code, src/todo.js

**Where:** src/todo.js, lines 62-69 and 71-78 (renderPendingRows() and renderCompletedRows())

**Smell:** Duplicated Code. Both methods go through the task list and call buildTaskRow() in almost the same way. The main difference is that one handles pending tasks and the other handles completed tasks.

**Cost:** If the way task rows are created changes later, both methods may need to be updated. If I change one and forget the other, the pending and completed sections could behave differently.

**Not yet fixing:** noted for Week 3.


## 3. Long Parameter List, src/todo.js

**Where:** src/todo.js, lines 124-140 (function buildTaskRow)

**Smell:** Long Parameter List. The function takes six parameters, and most of them describe the same task.

**Cost:** The function is harder to read and easier to call incorrectly because all six values have to be passed in the correct order. If more task data is added later, the parameter list could become even longer and harder to maintain.

**Not yet fixing:** noted for Week 3.