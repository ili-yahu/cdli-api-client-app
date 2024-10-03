document.getElementById('runButton').addEventListener('click', async () => {
  const command = document.getElementById('commandInput').value;
  const outputElement = document.getElementById('output');

  // Use the exposed API to execute the command
  const result = await window.api.executeCommand(command);
  outputElement.textContent = result;
});
