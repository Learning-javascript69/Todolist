// Function to toggle customization bar
function toggleCustomizationBar() {
  var bar = document.getElementById("customizationBar");
  bar.style.display = (bar.style.display === "none") ? "block" : "none";
}

// Function to handle click on list item
function handleItemClick() {
  // Display customization bar
  toggleCustomizationBar();
  
  // Simulate customization options based on clicked item
  // For demonstration purposes, let's assume we show some text related to the clicked item
  var selectedItem = this.textContent;
  var customizationBar = document.getElementById("customizationBar");
  customizationBar.innerHTML = "<h3>Customizing: " + selectedItem + "</h3>";
}

// Event listener to toggle customization bar
document.getElementById("customList").addEventListener("click", toggleCustomizationBar);

// Event delegation to handle clicks on list items
document.getElementById("customList").addEventListener("click", function(event) {
  if (event.target && event.target.nodeName === "LI") {
    handleItemClick.call(event.target);
  }
});
