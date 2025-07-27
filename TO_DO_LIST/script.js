function generateTaskId() {
  return Math.floor(1000 + Math.random() * 9000)
}
const addBtn = document.getElementById("add-task-btn");
const input = document.getElementById("new-task");
const taskList = document.getElementById("task-list");
const filter = document.querySelectorAll('.filter-btn');
const clearBtn=document.getElementById('clear');
let currentFilter = "all";
let filterArr = [];
let tasks = [];
let counter=document.getElementById('count');

//counting the tasks 
function updateCount() {
  const activeTasks = tasks.filter(task => !task.completed);
  let counts=0;
  counts = activeTasks.length;
  counter.textContent = counts;
}
addBtn.addEventListener("click", function () {
  const taskText = input.value;
  if(taskText!==""){
  addTask(taskText);
  //console.log(tasks);
  applyFilter();
  }
});
function addTask(userInput) {
  const newTask = {
    id: generateTaskId(),
    text: userInput,
    completed: false
  }
  //console.log(newTask);
  tasks.push(newTask);
  updateCount();
}

function showTask() {
taskList.innerHTML="";
  if (filterArr.length === 0) {
    taskList.innerHTML = "<li class='empty-message'>Your to-do List is empty </li>";
  }
  filterArr.forEach((task) => {
    let li = document.createElement("li");
    li.setAttribute("data-id", task.id)

    //create elements inside li
    const checkbox = document.createElement('input');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button')

    //adding attributes and values
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    span.innerText = task.text;
    if (checkbox.checked === true) {
      span.classList.add('completed');
    }
    checkbox.addEventListener('change', () => {
      handleToggle(task.id);
    });
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
    deleteBtn.className = "delBtn";
    //append inside li
    li.append(checkbox);
    li.append(span);
    li.append(deleteBtn);
    taskList.append(li);
    input.value = "";
    //delete button
    deleteBtn.addEventListener("click", function(){
     tasks=tasks.filter(t => t.id !== task.id);
     applyFilter();
     updateCount();
    });
  })
}
//gandle toggle for status update
function handleToggle(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {...task, completed:!task.completed};
      } else {
      return task;
    }
  })
  applyFilter();
  updateCount();
}
document.addEventListener("DOMContentLoaded", () => {
  applyFilter();
});

//press enter key to add task
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const taskText = input.value;
    if(taskText!==""){
    addTask(taskText);
    //console.log(tasks);
    //taskList.innerHTML = "";
    applyFilter();
    }
  }
});

//filter buttons
function applyFilter() {
  if (currentFilter === 'all') {
    filterArr = tasks;
  } else if (currentFilter === 'active') {
    filterArr = tasks.filter(task => task.completed === false);
  } else {
    filterArr = tasks.filter(task => task.completed === true);
  }
  showTask();
}

//filter buttons 
filter.forEach((button) => {
  button.addEventListener('click', () => {
    filter.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.getAttribute("data-filter");
    applyFilter();
  })
});
//clear button
clearBtn.addEventListener('click',()=>{
  tasks=tasks.filter(task=> !task.completed);
  applyFilter();
  updateCount();
});

