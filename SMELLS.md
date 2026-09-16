## 1. God Object, src/todo.js

**Where:** src/todo.js, lines 2-113 (class TodoManager)

**Smell:** God Object. The TodoManager class is responsible for too many things. It stores the tasks, validates new tasks, saves and loads from localStorage, deletes and completes tasks, and also renders the page.

**Cost:** If we need to change one part of the application, such as how tasks are stored, we still have to edit the same class that handles validation and the user interface. This makes the class harder to maintain and increases the chance of breaking something unrelated.

**Not yet fixing:** noted for Week 3.


## 2. Duplicated Code, src/todo.js

**Where:** src/todo.js, lines 58-74 (renderPendingRows and renderCompletedRows)

**Smell:** Duplicated Code. The renderPendingRows() and renderCompletedRows() methods contain almost the same loop and both call buildTaskRow(). The main difference is whether they check for completed or incomplete tasks.

**Cost:** If the way task rows are rendered needs to change later, we may have to make the same change in more than one place. It is easy to update one method and forget the other, which could cause inconsistent behavior.

**Not yet fixing:** noted for Week 3.


## 3. Long Method, src/todo.js

**Where:** src/todo.js, lines 75-112 (render method)

**Smell:** Long Method. The render() method does several different jobs. It creates the pending and completed lists, finds the oldest task, creates HTML, adds event listeners, handles the flash effect, and updates the document title.

**Cost:** As more features are added, this method could become even larger and harder to understand. Changing one part of the rendering behavior could accidentally affect another part, making debugging and testing more difficult.

**Not yet fixing:** noted for Week 3.