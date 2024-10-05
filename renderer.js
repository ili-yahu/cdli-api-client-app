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

const periodChoices = [
    "\"Pre-Writing (ca. 8500-3500 BC)\"",
    "\"Uruk V (ca. 3500-3350 BC)\"",
    "\"Uruk IV (ca. 3350-3200 BC)\"",
    "\"Egyptian 0 (ca. 3300-3000 BC)\"",
    "\"Uruk III (ca. 3200-3000 BC)\"",
    "\"Proto-Elamite (ca. 3100-2900 BC)\"",
    "\"ED I-II (ca. 2900-2700 BC)\"",
    "\"ED IIIa (ca. 2600-2500 BC)\"",
    "\"ED IIIb (ca. 2500-2340 BC)\"",
    "\"Ebla (ca. 2350-2250 BC)\"",
    "\"Old Akkadian (ca. 2340-2200 BC)\"",
    "\"Old Elamite (c. 2600-1500 BC)\"",
    "\"Linear Elamite (ca. 2200 BC)\"",
    "\"Lagash II (ca. 2200-2100 BC)\"",
    "\"Harappan (ca. 2200-1900 BC)\"",
    "\"Ur III (ca. 2100-2000 BC)\"",
    "\"Early Old Babylonian (ca. 2000-1900 BC)\"",
    "\"Old Assyrian (ca. 1950-1850 BC)\"",
    "\"Old Babylonian (ca. 1900-1600 BC)\"",
    "\"Middle Hittite (ca. 1500-1100 BC)\"",
    "\"Middle Babylonian (ca. 1400-1100 BC)\"",
    "\"Middle Assyrian (ca. 1400-1000 BC)\"",
    "\"Middle Elamite (ca. 1500-1100 BC)\"",
    "\"Early Neo-Babylonian (ca. 1150-730 BC)\"",
    "\"Neo-Assyrian (ca. 911-612 BC)\"",
    "\"Neo-Elamite (ca. 770-539 BC)\"",
    "\"Neo-Babylonian (ca. 626-539 BC)\"",
    "\"Achaemenid (547-331 BC)\"",
    "\"Hellenistic (323-63 BC)\"",
    "\"Parthian (247 BC - 224 AD)\"",
    "\"Sassanian (224-641 AD)\"",
    "\"modern\"",
    "\"no value\""
];

// Capture user input and filter suggestions
document.getElementById('commandInput').addEventListener('input', (event) => {
    const input = event.target.value.trim(); // Get the current input value
    const inputParts = input.split(/\s+/); // Split the input by whitespace
    const command = inputParts[0]; // Get the command (first part)
    const lastArgument = inputParts.slice(-1)[0]; // Get the last argument
    const secondLastArgument = inputParts.slice(-2)[0]; // Get the second to last argument
    const suggestionsList = document.getElementById('suggestions'); // Get the suggestions element
    suggestionsList.innerHTML = ''; // Clear previous suggestions
    suggestionsList.style.display = 'none'; // Hide suggestions by default

    // Debugging: Add logs for input values
    console.log(`Input: "${input}"`);
    console.log(`Command: "${command}", Last Argument: "${lastArgument}", Second Last Argument: "${secondLastArgument}"`);

    // Check if the command exists in our commands object
    if (commands[command]) {
        const currentOptions = commands[command].options; // Get options for the current command
        console.log('Command recognized:', command);

        // Dynamic filtering for flags (suggest flags dynamically as you type)
        if (lastArgument.startsWith('--')) {
            console.log('Last argument starts with "--"');
            const filteredOptions = Object.keys(currentOptions).filter(option => option.startsWith(lastArgument));

            // Suggest the filtered flags
            filteredOptions.forEach(option => {
                const listItem = document.createElement('li'); // Create a list item for each option
                listItem.textContent = option; // Set the text to the option
                listItem.addEventListener('click', () => {
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${option}`; // Replace the last part with the selected option
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                });
                suggestionsList.appendChild(listItem); // Append the item to the suggestions list
            });

            // Only show suggestions if there are any filtered options
            if (filteredOptions.length > 0) {
                suggestionsList.style.display = 'block'; // Show the suggestions list
                console.log('Flag suggestions shown:', filteredOptions);
            }
        } 
        
        // Suggest filter value options when --filterField period is used
        else if ((secondLastArgument === '--filterField' || secondLastArgument === '--fk') && lastArgument === 'period') {
            console.log('Second last argument is "--filterField period"');
            const filterValueOptions = ['--fv', '--filterValue'];

            // Suggest filter value options
            filterValueOptions.forEach(option => {
                const listItem = document.createElement('li'); // Create a list item for each filter value option
                listItem.textContent = option; // Set the text to the option
                listItem.addEventListener('click', () => {
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${option}`; // Replace the last part with the selected option
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                });
                suggestionsList.appendChild(listItem); // Append the item to the suggestions list
            });
            suggestionsList.style.display = 'block'; // Show the suggestions list for filter value options
            console.log('Filter value suggestions shown:', filterValueOptions);
        } 
        
        // Suggest period choices when the user types --fv after --filterField period
        else if ((secondLastArgument === '--fv' || secondLastArgument === '--filterValue') && 
                 (lastArgument === '' || lastArgument.startsWith('"') || lastArgument.startsWith("'"))) {
            console.log('Period choices suggestions should be shown');

            // User input for filtering, removing quotes for comparison
            const userInputForFiltering = lastArgument.replace(/['"]/g, "").toLowerCase();

            const filteredPeriods = periodChoices.filter(choice => {
                const strippedChoice = choice.replace(/['"]/g, "").toLowerCase(); // Remove quotes from period choices
                return strippedChoice.includes(userInputForFiltering); // Compare without quotes
            });

            filteredPeriods.forEach(choice => {
                const listItem = document.createElement('li'); // Create a list item for each period choice
                listItem.textContent = choice; // Set the text to the choice
                listItem.addEventListener('click', () => {
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${choice}`; // Replace the last part with the selected choice
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                });
                suggestionsList.appendChild(listItem); // Append the item to the suggestions list
            });
            suggestionsList.style.display = 'block'; // Show the suggestions list for period choices
            console.log('Filtered period choices shown:', filteredPeriods);
        }

        // Check for recognized flags (short form) and dynamically filter them
        else if (currentOptions[lastArgument] || 
                   Object.values(currentOptions).some(opt => opt.short === lastArgument)) {
            const recognizedFlag = currentOptions[lastArgument] || 
                Object.values(currentOptions).find(opt => opt.short === lastArgument);
            if (recognizedFlag) {
                const choices = recognizedFlag.choices || [];
                const filteredChoices = choices.filter(choice => choice.toLowerCase().includes(lastArgument.toLowerCase()));
                
                filteredChoices.forEach(choice => {
                    const listItem = document.createElement('li'); // Create a list item for each choice
                    listItem.textContent = choice; // Set the text to the choice
                    listItem.addEventListener('click', () => {
                        const newInput = `${inputParts.slice(0, -1).join(' ')} ${choice}`; // Replace the last part with the selected choice
                        document.getElementById('commandInput').value = newInput; 
                        suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                    });
                    suggestionsList.appendChild(listItem); // Append the item to the suggestions list
                });
                suggestionsList.style.display = 'block'; // Show the suggestions list
                console.log('Filtered flag choices shown:', filteredChoices);
            }
        }
    } else {
        console.log('Unrecognized command:', command);
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
