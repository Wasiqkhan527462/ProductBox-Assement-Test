const async = require('async');
const { fetchWebsiteTitle, generateHtmlResponse, createHandler } = require('./utils');

// Async.js implementation with controlled concurrency
// Limits to 5 concurrent requests to avoid overwhelming servers
const handleTitlesWithAsync = addresses => new Promise((resolve, reject) => {
    async.mapLimit(
        addresses,
        5, // Limit concurrent requests
        async address => {
            try {
                return await fetchWebsiteTitle(address);
            } catch (error) {
                return { address, title: 'NO RESPONSE', error: error.message };
            }
        },
        (error, results) => error ? reject(error) : resolve(results)
    );
});

// Create handler using the shared handler function
const handler = createHandler(handleTitlesWithAsync);

module.exports = handler;
