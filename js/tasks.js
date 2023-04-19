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
const errorMsgContent = document.querySelector(".error_msg");
const inputTurnRed = document.querySelector(".new_task_form");

function getLocalStorage() {
  const data = localStorage.getItem("task");
  if (data) {
    taskData = JSON.parse(data);
  } else {
    taskData = [];
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

  let newTaskName;

  if (addTaskInput.value == "") {
    errorMsgContent.classList.remove("hidden");
    inputTurnRed.classList.add("error");
    return;
  } else {
    newTaskName = addTaskInput.value;

    errorMsgContent.classList.add("hidden");
    inputTurnRed.classList.remove("error");
  }

  const newTask = {
    id: uid(),
    name: newTaskName,
    toDo: true,
  };

  taskData.push(newTask);
  setLocalStorage(taskData);

  let taskElement = createNewTaskEl(newTask.name, newTask.id);
  taskList.appendChild(taskElement);

  counter();
  isTasksListEmpty();

  addTaskInput.value = "";
}

// complete and incomplete task (toggle)
function toggleTaskCompletion(event, isDone) {
  const icon = event.target;
  const task = icon.parentNode.parentNode;

  // Por padrão, a tarefa nova possui a propriedade toDo como TRUE. Quando essa função é disparada pelo click no ícone da terefa não feita,
  // ela, além de enviar o event, também fornece o booleano TRUE para o parâmetro isDone.
  // Sendo assim, o IF abaixo fará as alterações visuais a partir da adição e remoção das classes.
  // Sendo retornado o valor TRUE (ou seja, qnd clicar para concluir a tarefa), será realizada a primeira condição.
  // Se for retornado o valor FALSE (ou seja, qnd clicar para desconcluir a tarefa), será realizada a segunda condição.
  // As ações dentro das condições são exatamente o oposto uma da outra.

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

  // Capturo o id da Task que acabou de ser criada.
  // Capturo o index dessa task dentro do meu taskData.
  // O método vai percorrer o atributo ID dentro dos elementos de taskData e, ao encontrar um valor que seja identico ao id contido em taskId,
  //  retornará o index do objeto ao qual pertence.

  const taskId = task.getAttribute("id");
  const taskIndex = taskData.findIndex((task) => task.id === taskId);

  // O findIndex, quando não localiza, retorna -1, sendo assim, caso o seu valor seja diferente de -1 (ou seja, caso tenha encontrado o ID idêntico),
  // ele altera o respectivo index do taskData, setando o atributo "toDo" para negar o valor contido nele. Se for False, vira True e vice-versa.
  // Por fim, seta para o local storage e invoca a função counter para atualizar o contador.

  if (taskIndex !== -1) {
    taskData[taskIndex].toDo = !isDone;
    setLocalStorage(taskData);
    counter();
  }
}

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

// render task list to status recovery of tasks
function renderTaskList() {
  // taskList.innerHTML = "";

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

// async HTML with taskData list
// for (const task of taskData) {
//   const taskItem = createNewTaskEl(task.name, task.id);
//   taskList.appendChild(taskItem);
// }
