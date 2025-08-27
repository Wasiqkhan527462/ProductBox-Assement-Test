// Generate HTML response
const generateHtmlResponse = results => `<!DOCTYPE html>
<html>
<head>
    <title>Website Titles</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333; 
            text-align: center;
            margin-bottom: 30px;
        }
        ul { 
            list-style-type: none; 
            padding: 0; 
        }
        li { 
            padding: 15px; 
            margin: 10px 0; 
            background-color: #f8f9fa; 
            border-radius: 8px;
            border-left: 4px solid #007bff;
            transition: all 0.3s ease;
        }
        li:hover {
            background-color: #e9ecef;
            transform: translateX(5px);
        }
        .url {
            font-weight: bold;
            color: #007bff;
        }
        .title {
            color: #28a745;
            font-style: italic;
        }
        .no-response {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Following are the titles of given websites:</h1>
        <ul>
            ${results.map(result => {
                const titleClass = result.title === 'NO RESPONSE' ? 'no-response' : 'title';
                return `<li>
                    <span class="url">${result.address}</span> - 
                    <span class="${titleClass}">"${result.title}"</span>
                </li>`;
            }).join('\n            ')}
        </ul>
    </div>
</body>
</html>`;

module.exports = { generateHtmlResponse };
