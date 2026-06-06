// =========================
// APP DATA
// =========================

let tasks = [];


// =========================
// DOM ELEMENTS
// =========================

const elements = {

    taskInput: document.getElementById("taskInput"),

    priority: document.getElementById("priority"),

    dueDate: document.getElementById("dueDate"),

    addTaskBtn: document.getElementById("addTaskBtn"),

    taskContainer: document.getElementById("taskContainer"),

    emptyState: document.querySelector(".empty-state"),

};
// =========================
// FORMAT DATE
// =========================

function formatDate(dateString){

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}
// =========================
// CREATE TASK OBJECT
// =========================

function createTaskObject(){

    const title = elements.taskInput.value.trim();

    const priority = elements.priority.value;

    const dueDate = elements.dueDate.value;

    if(!title){

        alert("Please enter a task");

        return null;
    }

    return {

        id: Date.now(),

        title,

        priority,

        dueDate,

        createdDate: new Date().toISOString(),

        completed: false,

        completedDate: null,

        completionNote: "",

        deleted: false

    };

}
// =========================
// RENDER TASK
// =========================

function renderTask(task){

    elements.taskContainer.innerHTML += `

    <div class="task-card">

        <h3>${task.title}</h3>

        <div class="task-meta">

            <p>🔴 Priority: ${task.priority}</p>

            <p>📅 Due: ${formatDate(task.dueDate)}</p>

            <p>🕒 Created: ${formatDate(task.createdDate)}</p>

        </div>

        <div class="task-actions">

            <button class="edit-btn">
                ✏ Edit
            </button>

            <button class="complete-btn">
                ✓ Complete
            </button>

            <button class="delete-btn">
                🗑 Delete
            </button>

        </div>

    </div>

    `;

}
// =========================
// ADD TASK EVENT
// =========================

elements.addTaskBtn.addEventListener("click", () => {

    const task = createTaskObject();

    if(!task) return;
tasks.push(task);
saveTasks();

renderTask(task);
updateEmptyState();

// console.log(tasks);

});
// =========================
// EMPTY STATE
// =========================

function updateEmptyState(){

    if(tasks.length === 0){

        elements.emptyState.classList.remove("hidden");

    }else{

        elements.emptyState.classList.add("hidden");

    }

}
// =========================
// SAVE TASKS
// =========================

function saveTasks(){

    localStorage.setItem(
        "smartTodoTasks",
        JSON.stringify(tasks)
    );

}
// =========================
// LOAD TASKS
// =========================

function loadTasks(){

    const storedTasks =
        localStorage.getItem("smartTodoTasks");

    if(!storedTasks) return;

    tasks = JSON.parse(storedTasks);

    tasks.forEach(task => {
        renderTask(task);
    });

    updateEmptyState();

}
loadTasks();