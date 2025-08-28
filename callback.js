const { fetchWebsiteTitle, generateHtmlResponse } = require('./utils');

// Traditional callback-based implementation
const handleTitlesWithCallbacks = (addresses, callback) => {
    const results = [];
    let completed = 0;

    // Handle the case where no addresses are provided
    if (!Array.isArray(addresses) || addresses.length === 0) {
        return callback(null, results);
    }

    // Fire all requests simultaneously and track completion
    addresses.forEach((address, index) => {
        fetchWebsiteTitle(address)
            .then(result => {
                // Extract the title from the result object
                results[index] = { address, title: result.title };
                if (++completed === addresses.length) {
                    callback(null, results); // Traditional callback pattern
                }
            })
            .catch(error => {
                results[index] = { address, title: 'NO RESPONSE', error: error.message };
                if (++completed === addresses.length) {
                    callback(null, results); // Traditional callback pattern
                }
            });
    });
};

// Custom handler that works with callbacks (no promises)
const handler = (req, res) => {
    try {
        const addresses = req.query.address;
        if (!addresses) return res.status(400).send('No addresses provided');
        
        // Use callback pattern directly
        handleTitlesWithCallbacks(
            Array.isArray(addresses) ? addresses : [addresses],
            (error, results) => {
                if (error) {
                    res.status(500).send('Internal Server Error');
                } else {
                    // Send response
                    res.setHeader('Content-Type', 'text/html');
                    res.send(generateHtmlResponse(results));
                }
            }
        );
        
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

module.exports = handler;
