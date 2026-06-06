// =========================
// APP DATA
// =========================

let tasks = [];
let selectedTaskId = null;


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

    totalTasks: document.getElementById("totalTasks"),

    pendingTasks: document.getElementById("pendingTasks"),

    completedTasks: document.getElementById("completedTasks"),

    overdueTasks: document.getElementById("overdueTasks"),

    progressPercentage:
        document.getElementById("progressPercentage"),

    progressFill:
        document.querySelector(".progress-fill"),
    completeModal:
        document.getElementById("completeModal"),

    completionNote:
        document.getElementById("completionNote"),

    confirmCompleteBtn:
        document.getElementById("confirmCompleteBtn"),

    cancelCompleteBtn:
        document.getElementById("cancelCompleteBtn"),
    tasksTab: document.getElementById("tasksTab"),

    recycleTab: document.getElementById("recycleTab"),

    recycleBinSection:
        document.getElementById("recycleBinSection"),

    deletedTasksContainer:
        document.getElementById("deletedTasksContainer"),
    dashboard: document.querySelector(".dashboard"),

    progressSection:
        document.querySelector(".progress-section"),

    taskForm:
        document.querySelector(".task-form"),

    searchSection:
        document.querySelector(".search-section"),

    filters:
        document.querySelector(".filters"),

    emptyState:
        document.querySelector(".empty-state"),

};
// =========================
// FORMAT DATE
// =========================

function formatDate(dateString) {

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

function createTaskObject() {

    const title = elements.taskInput.value.trim();

    const priority = elements.priority.value;

    const dueDate = elements.dueDate.value;

    if (!title) {

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
function resetForm() {

    elements.taskInput.value = "";

    elements.priority.value = "High";

    elements.dueDate.value = "";

    elements.taskInput.focus();

}
// =========================
// RENDER TASK
// =========================

function renderTask(task) {

    elements.taskContainer.innerHTML += `

  <div class="task-card ${task.completed ? "completed-task" : ""}" data-id="${task.id}">

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

           <button
    class="complete-btn"
    data-id="${task.id}">
                ✓ Complete
            </button>

           <button
    class="delete-btn"
    data-id="${task.id}">
                🗑 Delete
            </button>

        </div>

    </div>

    `;

}
function renderAllTasks() {

    elements.taskContainer.innerHTML = "";

    const sortedTasks = [...tasks].sort((a, b) => {

        if (a.completed === b.completed) {
            return 0;
        }

        return a.completed ? 1 : -1;

    });

    sortedTasks.forEach(task => {

        if (!task.deleted) {

            renderTask(task);

        }

    });

    attachCompleteEvents();
    attachDeleteEvents();


}
// =========================
// RENDER RECYCLE BIN
// =========================

function renderRecycleBin() {

    elements.deletedTasksContainer.innerHTML = "";

    const deletedTasks =
        tasks.filter(task => task.deleted);

    if (deletedTasks.length === 0) {

        elements.deletedTasksContainer.innerHTML = `
            <p>No deleted tasks found.</p>
        `;

        return;
    }

    deletedTasks.forEach(task => {

        elements.deletedTasksContainer.innerHTML += `

        <div class="task-card">

            <h3>${task.title}</h3>

            <p>Priority: ${task.priority}</p>

            <div class="task-actions">

                <button
                    class="restore-btn"
                    data-id="${task.id}">
                    Restore
                </button>

                <button
                    class="delete-forever-btn"
                    data-id="${task.id}">
                    Delete Forever
                </button>

            </div>

        </div>

        `;

    });
    
attachRestoreEvents();

attachDeleteForeverEvents();
}


// =========================
// TAB SWITCHING
// =========================

function showTasksTab() {

    elements.dashboard.classList.remove("hidden");

    elements.progressSection.classList.remove("hidden");

    elements.taskForm.classList.remove("hidden");

    elements.searchSection.classList.remove("hidden");

    elements.filters.classList.remove("hidden");

    elements.taskContainer.classList.remove("hidden");

    elements.recycleBinSection.classList.add("hidden");

    elements.tasksTab.classList.add("active");

    elements.recycleTab.classList.remove("active");

}

function showRecycleBinTab() {

    elements.dashboard.classList.add("hidden");

    elements.progressSection.classList.add("hidden");

    elements.taskForm.classList.add("hidden");

    elements.searchSection.classList.add("hidden");

    elements.filters.classList.add("hidden");

    elements.taskContainer.classList.add("hidden");

    elements.emptyState.classList.add("hidden");
    renderRecycleBin();

    elements.recycleBinSection.classList.remove("hidden");

    elements.tasksTab.classList.remove("active");

    elements.recycleTab.classList.add("active");

}
// =========================
// MOVE TO RECYCLE BIN
// =========================

function moveToRecycleBin(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;

    task.deleted = true;

    saveTasks();

    renderAllTasks();

    updateDashboard();

    updateEmptyState();

}
// =========================
// RESTORE TASK
// =========================

function restoreTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;

    task.deleted = false;

    saveTasks();

    renderAllTasks();

    renderRecycleBin();

    updateDashboard();

    updateEmptyState();

}
// =========================
// RESTORE EVENTS
// =========================

function attachRestoreEvents() {

    const restoreButtons =
        document.querySelectorAll(".restore-btn");

    restoreButtons.forEach(button => {

        button.addEventListener("click", () => {

            restoreTask(
                Number(button.dataset.id)
            );

        });

    });

}
// =========================
// DELETE FOREVER
// =========================

function deleteForever(taskId){

    tasks = tasks.filter(
        task => task.id !== taskId
    );

    saveTasks();

    renderRecycleBin();

    renderAllTasks();

    updateDashboard();

    updateEmptyState();

}
// =========================
// DELETE FOREVER EVENTS
// =========================

function attachDeleteForeverEvents(){

    const buttons =
        document.querySelectorAll(
            ".delete-forever-btn"
        );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            deleteForever(
                Number(button.dataset.id)
            );

        });

    });

}
// =========================
// COMPLETE BUTTON EVENTS
// =========================

function attachCompleteEvents() {

    const completeButtons =
        document.querySelectorAll(".complete-btn");

    completeButtons.forEach(button => {

        button.addEventListener("click", () => {
            console.log("Complete button clicked");

            selectedTaskId =
                Number(button.dataset.id);

            elements.completeModal
                .classList.remove("hidden");

        });

    });

}
// =========================
// DELETE BUTTON EVENTS
// =========================

function attachDeleteEvents() {

    const deleteButtons =
        document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const taskId =
                Number(button.dataset.id);

            moveToRecycleBin(taskId);

        });

    });

}
// =========================
// COMPLETE TASK
// =========================

function completeTask() {
    console.log("complete task runing");

    const task = tasks.find(
        task => task.id === selectedTaskId
    );

    if (!task) return;

    task.completed = true;

    task.completedDate =
        new Date().toISOString();

    task.completionNote =
        elements.completionNote.value.trim();

    saveTasks();

    renderAllTasks();

    updateDashboard();

    elements.completeModal
        .classList.add("hidden");

    elements.completionNote.value = "";

}

// =========================
// ADD TASK EVENT
// =========================

elements.addTaskBtn.addEventListener("click", () => {

    const task = createTaskObject();

    if (!task) return;
    tasks.push(task);
    saveTasks();

    renderAllTasks();
    updateEmptyState();
    updateDashboard();
    resetForm();

    // console.log(tasks);

});
// =========================
// EMPTY STATE
// =========================

function updateEmptyState() {

    const activeTasks =
    tasks.filter(task => !task.deleted);

if(activeTasks.length === 0) {

        elements.emptyState.classList.remove("hidden");

    } else {

        elements.emptyState.classList.add("hidden");

    }

}
// =========================
// DASHBOARD STATS
// =========================

function updateDashboard() {

    const activeTasks =
        tasks.filter(task => !task.deleted);

    const completedTasks =
        activeTasks.filter(task => task.completed);

    const pendingTasks =
        activeTasks.filter(task => !task.completed);

    const overdueTasks =
        activeTasks.filter(task => {

            if (task.completed) return false;

            return new Date(task.dueDate) < new Date();

        });

    elements.totalTasks.textContent =
        activeTasks.length;

    elements.pendingTasks.textContent =
        pendingTasks.length;

    elements.completedTasks.textContent =
        completedTasks.length;

    elements.overdueTasks.textContent =
        overdueTasks.length;
    let progress = 0;

    if (activeTasks.length > 0) {

        progress =
            Math.round(
                (completedTasks.length / activeTasks.length) * 100
            );

    }

    elements.progressPercentage.textContent =
        `${progress}%`;

    elements.progressFill.style.width =
        `${progress}%`;

}
// =========================
// SAVE TASKS
// =========================

function saveTasks() {

    localStorage.setItem(
        "smartTodoTasks",
        JSON.stringify(tasks)
    );

}
// =========================
// LOAD TASKS
// =========================

function loadTasks() {

    const storedTasks =
        localStorage.getItem("smartTodoTasks");

    if (!storedTasks) return;

    tasks = JSON.parse(storedTasks);

    renderAllTasks();

    updateEmptyState();

    updateDashboard();

}
loadTasks();
// =========================
// COMPLETE MODAL EVENTS
// =========================

elements.confirmCompleteBtn
    .addEventListener("click", () => {

        completeTask();

    });

elements.cancelCompleteBtn
    .addEventListener("click", () => {

        elements.completeModal
            .classList.add("hidden");

        elements.completionNote.value = "";

    });
elements.tasksTab
    .addEventListener("click", showTasksTab);

elements.recycleTab
    .addEventListener("click", showRecycleBinTab);