const async = require('async');
const { fetchWebsiteTitle, generateHtmlResponse } = require('./utils');

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

// Main route handler for /I/want/title
const handler = async (req, res) => {
    try {
        const addresses = req.query.address;
        if (!addresses) return res.status(400).send('No addresses provided');
        
        const results = await handleTitlesWithAsync(Array.isArray(addresses) ? addresses : [addresses]);
        res.setHeader('Content-Type', 'text/html');
        res.send(generateHtmlResponse(results));
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = handler;
