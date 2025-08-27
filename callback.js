const { fetchWebsiteTitle, generateHtmlResponse, createHandler } = require('./utils');

// Traditional callback-based implementation
const handleTitlesWithCallbacks = (addresses, callback) => {
    const results = [];
    let completed = 0;
    
    if (addresses.length === 0) return callback(null, results);
    
    // Fire all requests simultaneously and track completion
    addresses.forEach((address, index) => {
        fetchWebsiteTitle(address)
            .then(result => {
                results[index] = result;
                if (++completed === addresses.length) {
                    callback(null, results);
                }
            })
            .catch(error => {
                results[index] = { address, title: 'NO RESPONSE', error: error.message };
                if (++completed === addresses.length) {
                    callback(null, results);
                }
            });
    });
};

// Create handler using the shared handler function
const handler = createHandler(handleTitlesWithCallbacks);

module.exports = handler;
