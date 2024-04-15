var listTitle = "My To-Do List"; // Define the title as a variable

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

            // Add a delete button to the task
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "❌";
            deleteButton.onclick = function() {
                taskList.removeChild(li);
            };

            // Add an edit button to the task
            var editButton = document.createElement("button");
            editButton.textContent = "✎";
            editButton.onclick = function() {
                var newText = prompt("Enter the new text for the task:", li.textContent);
                if (newText !== null && newText.trim() !== "") {
                    li.textContent = newText;
                }
            };

            li.appendChild(deleteButton);
            li.appendChild(editButton);

            // Add the task to the task list
            taskList.appendChild(li);

            // Clear the input field
            taskInput.value = "";
        }
        function newName(){
          listtitle = prompt('What is the new name of your to-do list')
          document.getElementById("listTitle").textContent = listTitle;
        }