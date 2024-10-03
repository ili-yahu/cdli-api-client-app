// Run button functionality
document.getElementById('runButton').addEventListener('click', async () => {
  const command = document.getElementById('commandInput').value;
  const outputElement = document.getElementById('output');

  const result = await window.api.executeCommand(command);
  outputElement.textContent = result;
});

// Clear button functionality
document.getElementById('clearButton').addEventListener('click', () => {
  document.getElementById('commandInput').value = ''; // Clear the input box
  document.getElementById('output').textContent = ''; // Optionally clear output
});

// Handle Enter key press
document.getElementById('commandInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if in a form
      document.getElementById('runButton').click(); // Trigger the click event of the Run button
  }
});
// Help button functionality
document.getElementById('helpButton').addEventListener('click', () => {
  document.getElementById('helpModal').style.display = 'block';
});

// Credits button functionality
document.getElementById('creditsButton').addEventListener('click', () => {
  document.getElementById('creditsModal').style.display = 'block';
});

// Close modal functionality
document.querySelectorAll('.close').forEach(closeButton => {
  closeButton.addEventListener('click', () => {
      closeButton.parentElement.parentElement.style.display = 'none'; // Close the respective modal
  });
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
  const helpModal = document.getElementById('helpModal');
  const creditsModal = document.getElementById('creditsModal');
  if (event.target === helpModal) {
      helpModal.style.display = 'none';
  }
  if (event.target === creditsModal) {
      creditsModal.style.display = 'none';
  }
});
// Select output folder functionality
document.getElementById('selectFolderButton').addEventListener('click', async () => {
  const folderPath = await window.api.selectOutputFolder(); // Call the exposed function
  if (folderPath) {
      document.getElementById('commandInput').value += ` --output-folder="${folderPath}"`; // Append the folder path to the command input
  }
});