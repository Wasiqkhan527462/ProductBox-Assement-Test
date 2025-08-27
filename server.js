const express = require('express');
const readline = require('readline');

// Available implementations with their details
const impls = {
    1: { name: 'Callback Implementation', file: './callback', desc: 'Traditional callback-based approach' },
    2: { name: 'Async.js Implementation', file: './async', desc: 'Async.js with concurrency control' },
    3: { name: 'Promise Implementation', file: './promise', desc: 'Modern promises with Promise.allSettled' },
    4: { name: 'Bacon.js Implementation', file: './bacon', desc: 'Reactive programming with Bacon.js' }
};

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display the menu with all available options
const showMenu = () => {
    console.log('\n' + '='.repeat(60));
    console.log('WEBSITE TITLE FETCHER - IMPLEMENTATION SELECTOR');
    console.log('='.repeat(60));
    console.log('\nChoose an implementation to run:');
    
    // Show each implementation option
    Object.entries(impls).forEach(([key, impl]) => {
        console.log(`  ${key}. ${impl.name}`);
        console.log(`     ${impl.desc}`);
    });
    
    console.log('  0. Exit');
    console.log('\n' + '='.repeat(60));
};

// Start the Express server with selected implementation
const startServer = (choice) => {
    const impl = impls[choice];
    
    // Show server info
    console.log(`\nStarting server with: ${impl.name}`);
    console.log(`Server: http://localhost:3000`);
    console.log(`Test: http://localhost:3000/I/want/title?address=https://www.google.com`);
    
    // Create Express app and load the selected implementation
    const app = express();
    const handler = require(impl.file);
    
    // Set up routes
    app.get('/I/want/title', handler);  // Main endpoint
    app.use((req, res) => res.status(404).send('404 Not Found'));  // 404 handler
    
    // Start server on port 3000
    const server = app.listen(3000, () => {
        console.log(`\nServer running with ${impl.name}!`);
        console.log('Press Ctrl+C to stop\n');
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => server.close(() => rl.close()));
};

// Process user input and take appropriate action
const handleInput = (answer) => {
    const choice = parseInt(answer.trim());
    
    if (choice === 0) {
        rl.close();  // Exit
    } else if (choice >= 1 && choice <= 4) {
        startServer(choice);  // Start server with selected implementation
    } else {
        // Invalid choice - show menu again after 1 second
        setTimeout(() => {
            showMenu();
            rl.question('Enter your choice (0-4): ', handleInput);
        }, 1000);
    }
};

// Start the application
showMenu();
rl.question('Enter your choice (0-4): ', handleInput);
