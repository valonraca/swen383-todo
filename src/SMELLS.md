God Object (TodoManager): Only class there is in the code and it does too much

Long Method (render): Chatgpt found this one : The render(justAddedId) method inside TodoManager is a massive block of procedural code that forces you to scroll. It handles assembling inner HTML, searching for the oldest pending task, querying the container for sub-elements, manually attaching nested click events for deletion and completion, setting up a timeout-based CSS animation class (flash), and updating the document title all in one go.

Long Parameter List (buildTaskRow): all these parememters(id, desc, completed, priority, createdAt, showActions)

Duplicated Code (renderPendingRows & renderCompletedRows): The exact same loop written twice just for different lists.

Feature Envy (summarizeWorkload): ChatGPT found this one :The standalone function summarizeWorkload(manager) is a textbook case of feature envy. It takes a manager object as an argument and spends its entire life reaching into manager.tasks, looping through internal task properties (completed, priority), and calculating stats. Because it cares way more about TodoManager's internal data than its own space, it really ought to be a method living directly inside the TodoManager class.

Magic Numbers (1500): It has no specific reason why this number exactly.