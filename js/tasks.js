function uid() {
  return Date.now().toString(16) + Math.random().toString(16).substring(2);
}

let taskData = [];

const addTaskInput = document.querySelector("#task_input");
const addTaskButton = document.getElementsByTagName("button")[0];
const taskList = document.querySelector("#tasks_list");
const todoCounterText = document.querySelector("#todo_count");
const doneCounterText = document.querySelector("#done_count");
const emptyTasks = document.querySelector(".empty_tasks");

function getLocalStorage() {
  const data = localStorage.getItem("task");
  if (data) {
    taskData = JSON.parse(data);
  }
}

getLocalStorage();

function setLocalStorage(taskData) {
  localStorage.setItem("task", JSON.stringify(taskData));
}

// counter
function counter() {
  let toDoCounter = 0;
  let doneCounter = 0;

  toDoCounter = taskData.length;
  todoCounterText.innerText = `${toDoCounter}`;

  doneCounter = taskData.filter((task) => task.toDo == false);

  doneCounterText.innerText = `${doneCounter.length}`;
}

// task length verify
function isTasksListEmpty() {
  if (taskData.length == 0) {
    emptyTasks.classList.remove("hidden");
  } else {
    emptyTasks.classList.add("hidden");
  }
}

counter();
isTasksListEmpty();

// create new task element
function createNewTaskEl(taskName, taskId) {
  // create task li
  let task = document.createElement("li");
  task.classList.add("task");
  task.classList.add("todo");
  task.setAttribute("id", taskId);

  // create left content div
  let leftContent = document.createElement("div");
  leftContent.classList.add("left_content");

  // toDo icon
  let todoIcon = document.createElement("i");
  todoIcon.classList.add("ph-duotone");
  todoIcon.classList.add("ph-circle-dashed");
  todoIcon.classList.add("check_btn");
  todoIcon.addEventListener("click", (event) => {
    toggleTaskCompletion(event, true);
  });

  // done icon
  let doneIcon = document.createElement("i");
  doneIcon.classList.add("ph-duotone");
  doneIcon.classList.add("ph-check-circle");
  doneIcon.classList.add("check_btn");
  doneIcon.classList.add("hidden");
  doneIcon.addEventListener("click", (event) => {
    toggleTaskCompletion(event, false);
  });

  // task name / p
  let name = document.createElement("p");
  name.innerHTML = taskName;

  // delete icon
  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("ph-duotone");
  deleteIcon.classList.add("ph-trash");
  deleteIcon.classList.add("delete_btn");
  deleteIcon.addEventListener("click", deleteTask);

  leftContent.appendChild(todoIcon);
  leftContent.appendChild(doneIcon);
  leftContent.appendChild(name);

  task.appendChild(leftContent);
  task.appendChild(deleteIcon);

  return task;
}

// add new task
function addTask(event) {
  event.preventDefault();

  const newTaskName = addTaskInput.value;

  const newTask = {
    id: uid(),
    name: newTaskName,
    toDo: true,
  };

  localStorage.getItem("task")
    ? (taskData = JSON.parse(localStorage.getItem("task")))
    : (taskData = []);

  if (localStorage.getItem("task")) {
    taskData = JSON.parse(localStorage.getItem("task"));
  } else {
    taskData = [];
  }

  taskData.push(newTask);
  localStorage.setItem("task", JSON.stringify(taskData));

  let taskElement = createNewTaskEl(newTask.name, newTask.id);
  taskList.appendChild(taskElement);

  counter();
  isTasksListEmpty();

  addTaskInput.value = "";
}

function toggleTaskCompletion(event, isDone) {
  const icon = event.target;
  const task = icon.parentNode.parentNode;

  if (isDone) {
    icon.classList.add("hidden");
    task.classList.add("done");
    task.classList.remove("todo");
    task.querySelector(".ph-circle-dashed").classList.add("hidden");
    task.querySelector(".ph-check-circle").classList.remove("hidden");
    task.querySelector("p").classList.add("risked");
  } else {
    icon.classList.add("hidden");
    task.classList.add("todo");
    task.classList.remove("done");
    task.querySelector(".ph-check-circle").classList.add("hidden");
    task.querySelector(".ph-circle-dashed").classList.remove("hidden");
    task.querySelector("p").classList.remove("risked");
  }

  const taskId = task.getAttribute("id");
  const taskIndex = taskData.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    taskData[taskIndex].toDo = !isDone;
    setLocalStorage(taskData);
    counter();
  }
}

// // complete task
// function completeTask(event) {
//   const todoIcon = event.target;
//   todoIcon.classList.add("hidden");

//   const riskedText = todoIcon.parentNode.childNodes[2];
//   riskedText.classList.add("risked");

//   const taskToCompleteId = todoIcon.parentNode.parentNode.id;
//   const taskToComplete = document.getElementById(taskToCompleteId);

//   taskToComplete.classList.add("done");
//   taskToComplete.classList.remove("todo");

//   const doneIcon = todoIcon.parentNode.childNodes[1];
//   doneIcon.classList.remove("hidden");

//   taskData.find((item) => {
//     if (item.id == taskToCompleteId) {
//       item.toDo = false;
//     }
//   });

//   setLocalStorage(taskData);
//   counter();
// }

// render task list to status recovery of tasks
function renderTaskList() {
  taskList.innerHTML = "";

  taskData.forEach((task) => {
    let taskElement = createNewTaskEl(task.name, task.id);

    if (task.toDo === false) {
      taskElement.classList.remove("todo");
      taskElement.classList.add("done");
      taskElement.querySelector(".ph-circle-dashed").classList.add("hidden");
      taskElement.querySelector(".ph-check-circle").classList.remove("hidden");
      taskElement.querySelector("p").classList.add("risked");
    }
    taskList.appendChild(taskElement);
  });
}

window.addEventListener("load", () => {
  renderTaskList();
});

// // incomplete task
// function incompleteTask(event) {
//   const doneIcon = event.target;
//   doneIcon.classList.add("hidden");

//   const riskedText = doneIcon.parentNode.childNodes[2];
//   riskedText.classList.add("risked");

//   const taskToIncompleteId = doneIcon.parentNode.parentNode.id;
//   const taskToIncomplete = document.getElementById(taskToIncompleteId);

//   taskToIncomplete.classList.add("todo");
//   taskToIncomplete.classList.remove("done");

//   const todoIcon = doneIcon.parentNode.childNodes[0];
//   todoIcon.classList.remove("hidden");

//   taskData.find((item) => {
//     if (item.id == taskToIncompleteId) {
//       item.toDo = true;
//     }
//   });

//   setLocalStorage(taskData);
//   counter();
// }

// delete task
function deleteTask(event) {
  const taskToDeleteId = event.target.parentNode.id;
  const taskToDelete = document.getElementById(taskToDeleteId);

  const tasksWithoutDeletedOne = taskData.filter((task) => {
    return task.id != taskToDeleteId;
  });

  taskData = tasksWithoutDeletedOne;
  taskList.removeChild(taskToDelete);

  localStorage.removeItem(taskToDelete);
  setLocalStorage(taskData);

  counter();
  isTasksListEmpty();
}

// async HTML with taskData list
for (const task of taskData) {
  const taskItem = createNewTaskEl(task.name, task.id);
  taskList.appendChild(taskItem);
}
