var listTitle = "To-Do List"; // Define the title as a variable
var customizationTab = document.getElementById("customizationTab");
let siteTitle = 'To-Do List'

// Set the title of the to-do list
document.getElementById("listTitle").textContent = listTitle;

// Remove the event listener from the task items

function addTask() {
  var taskInput = document.getElementById("taskInput");
  var taskList = document.getElementById("taskList");

  // Check if the input field is empty or null
  if (!taskInput.value || taskInput.value.trim() === "") {
      return; // Do nothing if the input is empty or null
  }

  var li = document.createElement("li");
  li.textContent = taskInput.value;

  // Add the task to the task list
  taskList.appendChild(li);

  // Clear the input field
  taskInput.value = "";
}

function editTask() {
  var taskToEdit = prompt('Enter the new name for this task:');
  if (taskToEdit !== null) {
      var taskInput = document.getElementById("taskInput");
      taskInput.value = taskToEdit;
  }
}


function newNameList() {
    let newName = prompt('What is the new name of your to-do list');
    if (newName) {
        listTitle = newName;
        siteTitle = newName
        document.getElementById("listTitle").textContent = listTitle;
        document.getElementById('siteTitle').textContent = siteTitle
    }
}

function deleteTask() {
    var task = customizationTab.getAttribute("data-task");
    customizationTab.style.display = "none"; // Hide customization tab
    var taskList = document.getElementById("taskList");
    var tasks = taskList.getElementsByTagName("li");
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].textContent === task) {
            taskList.removeChild(tasks[i]);
            break;
        }
    }
}

function showCustomization() {
  var customizationTab = document.querySelector('.customization-tab');
  customizationTab.style.visibility = 'visible';
  customizationTab.style.opacity = 1;
  customizationTab.style.right = 0;
}

function hideCustomization() {
  var customizationTab = document.querySelector('.customization-tab');
  customizationTab.style.visibility = 'hidden';
  customizationTab.style.opacity = 0;
  customizationTab.style.right = '-10%'; // Adjust this value based on your sidebar width
}
