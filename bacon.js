const Bacon = require('baconjs');
const { fetchWebsiteTitle, generateHtmlResponse } = require('./utils');

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

// Main route handler - same as your other implementations
const handler = async (req, res) => {
    try {
        const addresses = req.query.address;
        if (!addresses) return res.status(400).send('No addresses provided');
        
        // Get results using Bacon.js
        const results = await handleTitlesWithBacon(Array.isArray(addresses) ? addresses : [addresses]);
        
        // Send response (same as before)
        res.setHeader('Content-Type', 'text/html');
        res.send(generateHtmlResponse(results));
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = handler;
module.exports.handleTitlesWithBacon = handleTitlesWithBacon;
