// Store the selected folder path globally
let outputFolderPath = '';

// Store the available commands and options for auto-suggestion
const commands = {
    'search': {
        description: 'Search artifacts in the catalog',
        options: {
            '--query': { short: '-q', description: 'Search query' },
            '--queryCategory': { short: '--qc', description: 'Search category (choices: "keyword", "publication", "collection", "provenience", "period", "transliteration", "translation", "id")' },
            '--queryOperator': { short: '--qo', description: 'Search operator (choices: "AND", "OR")' },
            '--advancedField': { short: '--af', description: 'Advanced search field' },
            '--advancedQuery': { short: '--aq', description: 'Advanced search query' },
            '--filterField': { short: '--fk', description: 'Filter by field' },
            '--filterValue': { short: '--fv', description: 'Filter by value' },
            '--version': { description: 'Show version number' },
            '--host': { short: '-h', description: 'Host URL to use for API calls' },
            '--format': { short: '-f', description: 'File format (choices: "ndjson", "csv", "tsv", "ntriples", "bibtex", "atf")' },
            '--output-file': { short: '-o', description: 'Output file' },
            '--help': { description: 'Show help' },
        },
    },
    'export': {
        description: 'Export catalog and text data',
        options: {
            '--version': { description: 'Show version number' },
            '--host': { short: '-h', description: 'Host URL to use for API calls' },
            '--format': { short: '-f', description: 'File format (choices: "ndjson", "csv", "tsv", "ntriples", "bibtex", "atf")' },
            '--output-file': { short: '-o', description: 'Output file' },
            '--help': { description: 'Show help' },
            '--entities': { short: '-e', description: 'Which types of entities to fetch (choices: "archives", "artifacts", "artifactsExternalResources", "artifactsMaterials", "collections", "dates", "dynasties", "genres", "inscriptions", "languages", "materials", "materialAspects", "materialColors", "periods", "proveniences", "publications", "regions", "rulers")' },
        },
    },
};

// Capture user input and filter suggestions
document.getElementById('commandInput').addEventListener('input', (event) => {
    const input = event.target.value.trim(); // Get the current input value
    const inputParts = input.split(/\s+/); // Split the input by whitespace
    const command = inputParts[0]; // Get the command (first part)
    const lastArgument = inputParts.slice(-1)[0]; // Get the last argument
    const previousArgument = inputParts.slice(-2)[0]; // Get the second to last argument
    const suggestionsList = document.getElementById('suggestions'); // Get the suggestions element
    suggestionsList.innerHTML = ''; // Clear previous suggestions
    suggestionsList.style.display = 'none'; // Hide suggestions by default

    // Check if the command exists in our commands object
    if (commands[command]) {
        const currentOptions = commands[command].options; // Get options for the current command

        // Debugging: Log the command and last argument
        console.log(`Command: ${command}, Last Argument: "${lastArgument}", Previous Argument: "${previousArgument}"`);

        // Determine whether to suggest based on the last or previous argument
        let filterInput = lastArgument; // Default to last argument
        let isFlag = false;

        // Check if the last argument is a flag (starts with `--` or `-`)
        if (lastArgument.startsWith('--') || lastArgument.startsWith('-')) {
            isFlag = true; // It's a flag, we should suggest related options
            // Filter options based on the last argument typed
            filterInput = lastArgument; // Use the last argument as the filter
        }

        // Filter options based on the last argument typed
        const filteredOptions = Object.keys(currentOptions).filter(option => {
            return option.toLowerCase().includes(filterInput.toLowerCase()) || 
                   (currentOptions[option].short && currentOptions[option].short.toLowerCase().includes(filterInput.toLowerCase())); // Include short forms
        });

        // Debugging: Log filtered options
        console.log(`Filtered Options: ${filteredOptions}`);

        // Display filtered suggestions
        if (filteredOptions.length > 0) {
            suggestionsList.style.display = 'block'; // Show the suggestions list
            filteredOptions.forEach(option => {
                const listItem = document.createElement('li'); // Create a list item for each suggestion
                listItem.textContent = option; // Set the text to the option
                listItem.addEventListener('click', () => {
                    // Autofill the input with the selected command and option
                    const newInput = inputParts.slice(0, -1).join(' ') + ' ' + option; 
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                });
                suggestionsList.appendChild(listItem); // Append the item to the suggestions list
            });
        }
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
