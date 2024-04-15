var listTitle = "My To-Do List"; // Define the title as a variable
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

    // Create a new li element
    var li = document.createElement("li");
    li.textContent = taskInput.value;

    li.addEventListener("click", function() {
        // Show the customization tab
        customizationTab.style.display = "block";

        // Set the current task for editing or deleting
        customizationTab.setAttribute("data-task", li.textContent);
    });

    // Add the task to the task list
    taskList.appendChild(li);

    // Clear the input field
    taskInput.value = "";
}

function newName() {
    var newName = prompt('What is the new name of your to-do list');
    if (newName) {
        listTitle = newName;
        document.getElementById("listTitle").textContent = listTitle;
    }
}

function editTask() {
    var task = customizationTab.getAttribute("data-task");
    var newTask = prompt('Enter a new name for the task:', task);
    if (newTask) {
        customizationTab.classList.add("open"); // Open customization tab
        var taskList = document.getElementById("taskList");
        var tasks = taskList.getElementsByTagName("li");
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].textContent === task) {
                tasks[i].textContent = newTask;
                break;
            }
        }
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

function hideSideBar() {
    customizationTab.style.display = "none";
}
