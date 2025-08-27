const express = require('express');
const app = express();

// Choose implementation: callback-impl, async-impl, or promise-impl

// First implementation - Callback
// const handler = require('./callback.js'); // Traditional callbacks

// Second implementation - Async.js
// const handler = require('./async.js'); // Async.js with concurrency control

// Third implementation - Promise
// const handler = require('./promise'); // Promise implementation

// Fourth implementation - Bacon.js
const handler = require('./bacon'); // Bacon.js for functional reactive programming

app.get('/I/want/title', handler);

// 404 handler for all other routes
app.use((req, res) => res.status(404).send('404 Not Found'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
