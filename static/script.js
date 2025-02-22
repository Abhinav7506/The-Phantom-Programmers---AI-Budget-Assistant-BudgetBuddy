const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    addTaskToList(task.text, task.completed);
  });
};

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTaskToList(taskText);
    saveTask(taskText, false);
    taskInput.value = "";
  } else {
    alert("Please enter a task.");
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

function addTaskToList(taskText, completed = false) {
  const listItem = document.createElement("li");
  if (completed) {
    listItem.classList.add("completed");
  }
  listItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="task-actions">
            <button class="mark-done-btn">✔</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

  listItem.querySelector(".mark-done-btn").addEventListener("click", () => {
    listItem.classList.toggle("completed");
    updateTask(taskText, listItem.classList.contains("completed"));
  });

  listItem.querySelector(".delete-btn").addEventListener("click", () => {
    listItem.remove();
    deleteTask(taskText);
  });

  taskList.appendChild(listItem);
}

function saveTask(taskText, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(taskText, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const task = tasks.find(t => t.text === taskText);
  if (task) {
    task.completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}