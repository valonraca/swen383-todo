
## 1. Duplicate Code (`renderPendingRows` / `renderCompletedRows`)
Lines 62-78. Both methods loop over `this.tasks` and call `buildTaskRow` with identical arguments, differing only in the `if (task.completed) continue;` vs `if (!task.completed) continue;` condition. This is a copy-paste duplication that should be a single filtered/parameterized method (e.g. `renderRows(predicate)`).

## 2. Magic Numbers
- Line 20: `trimmed.length < 3` — minimum task length hardcoded with no named constant.
- Line 25: `this.tasks.length >= 20` — task-list warning threshold hardcoded.
- Line 125: `desc.length > 40` / `slice(0, 40)` — label truncation length hardcoded.
These unexplained literals should be named constants (e.g. `MIN_DESC_LENGTH`, `TASK_WARNING_THRESHOLD`, `LABEL_MAX_LENGTH`) so their meaning and intent are clear and consistent if changed.

## 3.Feature Envy
`buildTaskRow` and `summarizeWorkload` (lines 124-160) are free functions defined outside the class, but `summarizeWorkload` reaches directly into `manager.tasks` to do its work, and `render()` passes `this` into it just so it can. This couples an "external" function tightly to `TodoManager`'s internals — it's really a method of `TodoManager` masquerading as a standalone function, which breaks encapsulation.