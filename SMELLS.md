## 1. Long Parameter List, src/todo.js
**Where:** src/todo.js, line 124 (class TodoManager)
**Smell:** Long Parameter List, It has 6 parameters and they're easy to mix up since
several are the same type, so it should just take one `task` object instead.

## 2. Duplicated Code, src/todo.js
**Where:** src/todo.js, line 124 (class TodoManager)
**Smell:** Duplicated Code, lines 62-78, the two functions are almost identical and the
logic can be in the same function with an if else.

## 3. Feature Envy, src/todo.js
**Where:** src/todo.js, line 143 (function summarizeWorkload)
**Smell:** Feature Envy. It only reads `manager`'s data and never its own, so it should
just be a method on TodoManager, like `manager.summarizeWorkload()`.