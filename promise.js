const { fetchWebsiteTitle, generateHtmlResponse } = require('./utils');

// Modern async/await implementation using Promise.allSettled
// Handles both successful and failed requests gracefully
const handleTitlesWithPromises = async addresses => {
    const results = await Promise.allSettled(addresses.map(fetchWebsiteTitle));
    return results.map((result, index) => 
        result.status === 'fulfilled' ? result.value : 
        { address: addresses[index], title: 'NO RESPONSE' }
    );
};

// Main route handler for /I/want/title
const handler = async (req, res) => {
    try {
        const addresses = req.query.address;
        if (!addresses) return res.status(400).send('No addresses provided');
        
        const results = await handleTitlesWithPromises(Array.isArray(addresses) ? addresses : [addresses]);
        res.setHeader('Content-Type', 'text/html');
        res.send(generateHtmlResponse(results));
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = handler;
