# Code smells

I reviewed `src/todo.js` before refactoring, at upstream commit `b32ff422b2560d5987b6d686e4b05a3df10da855`. The line numbers below refer to that version.

## 1. God Object — src/todo.js
**Where:** src/todo.js, lines 2–121 (`TodoManager`).
**Smell:** I found that TodoManager owns task state, validates input, reads and writes localStorage, builds DOM markup, handles button clicks, animates rows and updates the page title.
**Cost:** If I change storage or presentation, I have to edit the class that also controls task rules. A UI change could break persistence, and testing task behavior requires browser dependencies.
**Not yet fixing:** I will separate these responsibilities in Week 3.

## 2. Duplicated Code — src/todo.js
**Where:** src/todo.js, lines 62–78 (`renderPendingRows`, `renderCompletedRows`).
**Smell:** I found two almost identical loops that filter tasks and call the same row helper. Only the completion condition changes.
**Cost:** If I change how rows are built, I have to update both methods. Missing one could make pending and completed tasks behave differently.
**Not yet fixing:** I am recording this for a later refactor; Week 3 focuses on SRP and DIP.

## 3. Feature Envy — src/todo.js
**Where:** src/todo.js, lines 143–159 (`summarizeWorkload`).
**Smell:** I found that this free function reads `manager.tasks` and calculates a summary from data owned by TodoManager.
**Cost:** Changing the task collection or priority representation would also force me to change logic outside its owner. It spreads task rules into presentation code.
**Not yet fixing:** I will move the calculation onto TodoService in Week 4 using Information Expert.
