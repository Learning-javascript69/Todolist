var listTitle = "To-Do List"; // Define the title as a variable
var customizationTab = document.getElementById("customizationTab");

// Set the title of the to-do list
document.getElementById("listTitle").textContent = listTitle;

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");

    // Check if the input field is empty or null
    if (!taskInput.value || taskInput.value.trim() === "") {
        return; // Do nothing if the input is empty or null
    }

    var li = document.createElement("li");
    li.textContent = taskInput.value;

    // Add a click event listener to the task
    li.addEventListener("click", function() {
      showCustomization()
    });



    // Add the task to the task list
    taskList.appendChild(li);

    // Clear the input field
    taskInput.value = "";
}
function newNameList() {
    let newName = prompt('What is the new name of your to-do list');
    if (newName) {
        listTitle = newName;
        document.getElementById("listTitle").textContent = listTitle;
    }
}
function editTask() {
  taskInput.value = prompt('What is the new name of this task')
  
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
function hideSideBar() {
    customizationTab.style.display = "none";
}
function showCustomization() {
    document.querySelector('.customization-tab').classList.add('open');
  } 
function hideCustomization() {
        document.querySelector('.customization-tab').classList.remove('open');
  }