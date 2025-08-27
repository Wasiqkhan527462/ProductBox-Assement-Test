const { generateHtmlResponse } = require('./generateHtmlResponse');

// Shared handler function that can be used by all implementations
const createHandler = (implementationFunction) => {
    return async (req, res) => {
        try {
            const addresses = req.query.address;
            if (!addresses) return res.status(400).send('No addresses provided');
            
            // Use the provided implementation function
            const results = await implementationFunction(Array.isArray(addresses) ? addresses : [addresses]);
            
            // Send response
            res.setHeader('Content-Type', 'text/html');
            res.send(generateHtmlResponse(results));
            
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    };
};

module.exports = { createHandler };
