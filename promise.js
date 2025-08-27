const { fetchWebsiteTitle, generateHtmlResponse, createHandler } = require('./utils');

// Modern async/await implementation using Promise.allSettled
// Handles both successful and failed requests gracefully
const handleTitlesWithPromises = async addresses => {
    const results = await Promise.allSettled(addresses.map(fetchWebsiteTitle));
    return results.map((result, index) => 
        result.status === 'fulfilled' ? result.value : 
        { address: addresses[index], title: 'NO RESPONSE' }
    );
};

// Create handler using the shared handler function
const handler = createHandler(handleTitlesWithPromises);

module.exports = handler;
