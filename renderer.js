// Store the selected folder path globally
let outputFolderPath = '';

// Store the available commands and options for auto-suggestion
const availableCommands = ['export', 'search', '--version', '--host, -h', '--format, -f', '--output-file, -o', '--help', '--entities, -e', '-q, --query', '--queryCategory, --qc', '--queryOperator, --qo', '--advancedField, --af', '--advancedQuery, --aq', '--filterField, --fk', '--filterValue, --fv'];

// Choices for specific options (to be used for additional filtering in the suggestions)
const queryCategories = ['keyword', 'publication', 'collection', 'provenience', 'period', 'transliteration', 'translation', 'id'];

const queryOperators = ['AND', 'OR'];

const formats = ['ndjson', 'csv', 'tsv', 'ntriples', 'bibtex', 'atf'];

const entities = ['archives', 'artifacts', 'artifactsExternalResources', 'artifactsMaterials', 'collections', 'dates', 'dynasties', 'genres', 'inscriptions', 'languages', 'materials', 'materialAspects', 'materialColors', 'periods', 'proveniences', 'publications', 'regions', 'rulers'];

// Capture user input and filter suggestions
document.getElementById('commandInput').addEventListener('input', (event) => {
    const input = event.target.value.toLowerCase(); // Get the current input value
    const suggestionsList = document.getElementById('suggestions'); // Get the suggestions element
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    // Filter available commands based on user input
    const filteredCommands = availableCommands.filter(command => command.toLowerCase().includes(input));

    // Display filtered suggestions
    if (filteredCommands.length > 0 && input) {
        suggestionsList.style.display = 'block'; // Show the suggestions list
        filteredCommands.forEach(command => {
            const listItem = document.createElement('li');
            listItem.textContent = command; // Set the text to the command
            listItem.addEventListener('click', () => {
                document.getElementById('commandInput').value = command; // Autofill the input with the selected command
                suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
            });
            suggestionsList.appendChild(listItem); // Append the item to the suggestions list
        });
    } else {
        suggestionsList.style.display = 'none'; // Hide if no matches found
    }
});

// Hide suggestions when clicking outside
window.addEventListener('click', (event) => {
    const suggestionsList = document.getElementById('suggestions');
    if (!event.target.closest('#commandInput')) {
        suggestionsList.style.display = 'none'; // Hide suggestions if clicking outside
    }
});

// Run button functionality
document.getElementById('runButton').addEventListener('click', async () => {
    const command = document.getElementById('commandInput').value;
    const outputElement = document.getElementById('output');

    // Execute the command with the selected output folder
    const result = await window.api.executeCommand(command, outputFolderPath);
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
    outputFolderPath = await window.api.selectOutputFolder(); // Call the exposed function
    if (outputFolderPath) {
        document.getElementById('commandInput').value += ` --output-folder="${outputFolderPath}"`; // Optionally update the command input
    }
});
