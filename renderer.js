// Store the selected folder path globally
let outputFolderPath = '';

// Store the available commands and options for auto-suggestion
const commands = {
    'search': {
        description: 'Search artifacts in the catalog',
        options: {
            '--query': { short: '-q', description: 'Search query' },
            '--queryCategory': { 
                short: '--qc', 
                description: 'Search category', 
                choices: ['keyword', 'publication', 'collection', 'provenience', 'period', 'transliteration', 'translation', 'id'] 
            },
            '--queryOperator': { 
                short: '--qo', 
                description: 'Search operator', 
                choices: ['AND', 'OR'] 
            },
            '--advancedField': { short: '--af', description: 'Advanced search field' },
            '--advancedQuery': { short: '--aq', description: 'Advanced search query' },
            '--filterField': { short: '--fk', description: 'Filter by field' },
            '--filterValue': { short: '--fv', description: 'Filter by value' },
            '--version': { description: 'Show version number' },
            '--host': { short: '-h', description: 'Host URL to use for API calls' },
            '--format': { 
                short: '-f', 
                description: 'File format', 
                choices: ['ndjson', 'csv', 'tsv', 'ntriples', 'bibtex', 'atf'] 
            },
            '--output-file': { short: '-o', description: 'Output file' },
            '--help': { description: 'Show help' },
        },
    },
};

// Capture user input and filter suggestions
document.getElementById('commandInput').addEventListener('input', (event) => {
    const input = event.target.value.trim(); // Get the current input value
    const inputParts = input.split(/\s+/); // Split the input by whitespace
    const command = inputParts[0]; // Get the command (first part)
    const lastArgument = inputParts.slice(-1)[0]; // Get the last argument
    const suggestionsList = document.getElementById('suggestions'); // Get the suggestions element
    suggestionsList.innerHTML = ''; // Clear previous suggestions
    suggestionsList.style.display = 'none'; // Hide suggestions by default

    // Debugging: Log the command and arguments
    console.log(`Input: "${input}", Command: "${command}", Last Argument: "${lastArgument}"`);

    // Check if the command exists in our commands object
    if (commands[command]) {
        const currentOptions = commands[command].options; // Get options for the current command

        // Check if the last argument starts with '--' for flag suggestions
        if (lastArgument.startsWith('--')) {
            // Filter options based on the last argument
            const filteredOptions = Object.keys(currentOptions).filter(option => option.startsWith(lastArgument));

            // Suggest the filtered flags
            filteredOptions.forEach(option => {
                const listItem = document.createElement('li'); // Create a list item for each option
                listItem.textContent = option; // Set the text to the option
                listItem.addEventListener('click', () => {
                    // Autofill the input with the selected command and option
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${option}`; 
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                });
                suggestionsList.appendChild(listItem); // Append the item to the suggestions list
            });

            // Only show suggestions if there are any filtered options
            if (filteredOptions.length > 0) {
                suggestionsList.style.display = 'block'; // Show the suggestions list
            }
        } else {
            // Check for recognized flags (short form)
            const recognizedFlag = currentOptions[lastArgument] || 
                Object.values(currentOptions).find(opt => opt.short === lastArgument);
                
            if (recognizedFlag) {
                // Suggest choices for that argument
                const choices = recognizedFlag.choices || [];
                choices.forEach(choice => {
                    const listItem = document.createElement('li'); // Create a list item for each choice
                    listItem.textContent = choice; // Set the text to the choice
                    listItem.addEventListener('click', () => {
                        const newInput = `${inputParts.join(' ')} ${choice}`; // Keep the entire command intact
                        document.getElementById('commandInput').value = newInput; 
                        suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                    });
                    suggestionsList.appendChild(listItem); // Append the item to the suggestions list
                });
                suggestionsList.style.display = 'block'; // Show the suggestions list
            }
        }
    } else {
        // Log if the command is not recognized
        console.log(`Unrecognized command: "${command}"`);
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
