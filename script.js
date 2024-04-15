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

    // Add a delete button to the task
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.onclick = function() {
        taskList.removeChild(li);
    };

    li.appendChild(deleteButton);

    // Add the task to the task list
    taskList.appendChild(li);

    // Clear the input field
    taskInput.value = "";
  }
document.getElementById("taskInput").addEventListener("keypress", function(event) {
  if (event.keyCode === 13) {
      addTask();
  }
});