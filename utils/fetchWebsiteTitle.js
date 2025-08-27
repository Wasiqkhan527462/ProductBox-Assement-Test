const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const zlib = require('zlib');

// Fix URL and upgrade to HTTPS for secure sites
const fixUrl = url => {
    if (url.startsWith('http')) return url;
    
    // Sites that need HTTPS
    const secureSites = ['facebook.com', 'instagram.com', 'linkedin.com', 'github.com'];
    if (secureSites.some(site => url.includes(site))) {
        return `https://${url}`;
    }
    
    return `http://${url}`;
};

// Browser headers to avoid blocking
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'DNT': '1',
    'Connection': 'keep-alive'
};

// Get domain name as fallback
const getDomain = url => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
};

// Get title from HTML
const getTitle = html => {
    const $ = cheerio.load(html);
    
    // Try title tag
    let title = $('title').text().trim();
    if (title && title.length >= 3) return title;
    
    // Try meta tags
    title = $('meta[property="og:title"]').attr('content') || 
            $('meta[name="twitter:title"]').attr('content');
    if (title && title.length >= 3) return title;
    
    return null;
};

// Make HTTP request
const fetchPage = url => {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const urlObj = new URL(url);
        
        const req = protocol.request({
            hostname: urlObj.hostname,
            port: urlObj.port || (url.startsWith('https') ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers,
            timeout: 10000
        }, res => {
            // Follow redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = res.headers.location.startsWith('http') 
                    ? res.headers.location 
                    : `${urlObj.protocol}//${urlObj.host}${res.headers.location}`;
                return fetchPage(redirectUrl).then(resolve).catch(reject);
            }

            // Handle compressed content
            let stream = res;
            if (res.headers['content-encoding'] === 'gzip') {
                stream = res.pipe(zlib.createGunzip());
            } else if (res.headers['content-encoding'] === 'deflate') {
                stream = res.pipe(zlib.createInflate());
            } else if (res.headers['content-encoding'] === 'br') {
                stream = res.pipe(zlib.createBrotliDecompress());
            }
            
            // Get page content
            let data = '';
            stream.setEncoding('utf8');
            stream.on('data', chunk => data += chunk);
            stream.on('end', () => resolve({ status: res.statusCode, data }));
            stream.on('error', reject);
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
        
        req.end();
    });
};

// Main function
const fetchWebsiteTitle = async (address) => {
    try {
        const url = fixUrl(address);
        const response = await fetchPage(url);
        
        if (response.status !== 200) {
            return { address, title: 'NO RESPONSE' };
        }
        
        let title = getTitle(response.data);
        
        // Use domain name if no title or blocked
        if (!title || title.length < 3 || response.data.includes('Something went wrong')) {
            title = getDomain(address);
        }
        
        return { address, title: title || 'No title found' };
        
    } catch (error) {
        return { address, title: 'NO RESPONSE' };
    }
};

module.exports = { normalizeUrl: fixUrl, fetchWebsiteTitle };
