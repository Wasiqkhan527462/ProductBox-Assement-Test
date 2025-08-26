const { fetchWebsiteTitle, generateHtmlResponse } = require('./utils');

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

// Main route handler for /I/want/title
const handler = (req, res) => {
    const addresses = req.query.address;
    if (!addresses) return res.status(400).send('No addresses provided');
    
    handleTitlesWithCallbacks(Array.isArray(addresses) ? addresses : [addresses], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        res.setHeader('Content-Type', 'text/html');
        res.send(generateHtmlResponse(results));
    });
};

module.exports = handler;
