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
