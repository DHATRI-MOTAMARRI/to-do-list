let tasks = [];
window.onload = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTasksList();
        updateStats();
    }
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        addTaskToList(tasks.length - 1);
        saveTasksToStorage();
        updateStats();
    }
};

const addTaskToList = (index) => {
    const taskList = document.querySelector(".task-list");
    const task = tasks[index];
    const listItem = createTaskElement(task, index);
    taskList.append(listItem);
};

const createTaskElement = (task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} />
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="edit.png" onClick="editTask(${index})" alt="Edit" />
                <img src="bin.png" onClick="deleteTask(${index})" alt="Delete" />
            </div>
        </div>
    `;
    listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
    return listItem;
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    const taskList = document.querySelector(".task-list");
    const listItem = taskList.children[index];
    const taskElement = listItem.querySelector(".task");
    taskElement.classList.toggle("completed");
    listItem.querySelector(".checkbox").checked = tasks[index].completed;
    saveTasksToStorage();
    updateStats();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasksToStorage();
    updateTasksList();
    updateStats();
};

const editTask = (index) => {
    const newText = prompt("Edit your task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasksToStorage();
        updateTasksList();
    }
};

const updateTasksList = () => {
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        taskList.append(createTaskElement(task, index));
    });
};

const updateStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const numbersElement = document.getElementById("numbers");
    const progressBar = document.getElementById("progress");
    numbersElement.textContent = `${completedTasks} / ${totalTasks}`;

    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;
};

const saveTasksToStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});
