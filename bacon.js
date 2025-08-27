const Bacon = require('baconjs');
const { fetchWebsiteTitle, generateHtmlResponse, createHandler } = require('./utils');

// SIMPLEST Bacon.js implementation - easy to understand
const handleTitlesWithBacon = async (addresses) => {
    const results = [];
    
    // Create a stream from the addresses array
    const stream = Bacon.fromArray(addresses);
    
    // Process each address and collect results
    await new Promise((resolve) => {
        stream.onValue(async (address) => {
            const result = await fetchWebsiteTitle(address);
            results.push(result);
            
            // When we have all results, resolve
            if (results.length === addresses.length) {
                resolve();
            }
        });
    });
    
    return results;
};

// Create handler using the shared handler function
const handler = createHandler(handleTitlesWithBacon);

module.exports = handler;
module.exports.handleTitlesWithBacon = handleTitlesWithBacon;
