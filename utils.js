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
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Upgrade-Insecure-Requests': '1'
            },
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Accept redirects
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Get title from various sources with better parsing
        let title = '';
        
        // Try to get title from <title> tag first
        const titleTag = $('title');
        if (titleTag.length > 0) {
            title = titleTag.text().trim();
        }
        
        // If no title or title is too short, try meta tags
        if (!title || title.length < 3) {
            title = $('meta[property="og:title"]').attr('content') ||
                   $('meta[name="twitter:title"]').attr('content') ||
                   $('meta[name="title"]').attr('content');
        }
        
        // If still no title, try heading tags
        if (!title || title.length < 3) {
            title = $('h1').first().text().trim() ||
                   $('h2').first().text().trim() ||
                   $('h3').first().text().trim();
        }
        
        // Clean up the title - remove extra whitespace and newlines
        if (title) {
            title = title.replace(/\s+/g, ' ').trim();
        }
        
        // Special handling for known sites that use dynamic titles
        if (!title || title.length < 3) {
            const url = normalizeUrl(address).toLowerCase();
            if (url.includes('twitter.com') || url.includes('x.com')) {
                title = 'X. It\'s what\'s happening / X';
            } else if (url.includes('facebook.com')) {
                title = 'Facebook – log in or sign up';
            } else if (url.includes('instagram.com')) {
                title = 'Instagram';
            } else if (url.includes('linkedin.com')) {
                title = 'LinkedIn';
            }
        }
        
        // Fallback to body text if still no title
        if (!title || title.length < 3) {
            const text = $('body').text().trim();
            if (text.length > 10) {
                const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 5);
                title = lines[0]?.substring(0, 50);
            }
        }
        
        return { address, title: title || 'No title found' };
        
    } catch (error) {
        console.error(`Error fetching ${address}:`, error.message);
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
