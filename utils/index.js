// Main utils index file - exports all utility functions
const { normalizeUrl, fetchWebsiteTitle } = require('./fetchWebsiteTitle');
const { generateHtmlResponse } = require('./generateHtmlResponse');
const { createHandler } = require('./sharedHandler');

module.exports = {
    normalizeUrl,
    fetchWebsiteTitle,
    generateHtmlResponse,
    createHandler
};
