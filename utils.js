const axios = require('axios');
const cheerio = require('cheerio');

// Add http:// if protocol missing
const normalizeUrl = url => url.startsWith('http') ? url : `http://${url}`;

// Fetch website and extract title
const fetchWebsiteTitle = async address => {
    try {
        const response = await axios.get(normalizeUrl(address), {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            maxRedirects: 5
        });
        
        const $ = cheerio.load(response.data);
        
        // Get title from various sources
        let title = $('title').text().trim() || 
                   $('meta[property="og:title"]').attr('content') ||
                   $('meta[name="twitter:title"]').attr('content') ||
                   $('h1').first().text().trim() ||
                   $('h2').first().text().trim();
        
        // Fallback to body text
        if (!title) {
            const text = $('body').text().trim();
            if (text.length > 10) {
                const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 5);
                title = lines[0]?.substring(0, 50);
            }
        }
        
        return { address, title: title || 'No title found' };
        
    } catch (error) {
        return { address, title: 'NO RESPONSE', error: error.message };
    }
};

// Generate HTML response
const generateHtmlResponse = results => `<!DOCTYPE html>
<html>
<head>
    <title>Website Titles</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { padding: 10px; margin: 5px 0; background-color: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Following are the titles of given websites:</h1>
    <ul>
        ${results.map(result => `<li>${result.address} - "${result.title}"</li>`).join('\n        ')}
    </ul>
</body>
</html>`;

module.exports = { normalizeUrl, fetchWebsiteTitle, generateHtmlResponse };
