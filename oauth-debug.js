const http = require('http');
const url = require('url');
const fs = require('fs');

// Create a simple debugging server to capture OAuth redirects
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log('Request received:', req.method, req.url);
  console.log('Query parameters:', parsedUrl.query);
  
  // Log all headers
  console.log('Headers:', req.headers);
  
  // If this is a callback request, log the query parameters
  if (parsedUrl.pathname === '/auth/callback') {
    console.log('=== FACEBOOK OAUTH CALLBACK ===');
    console.log('Full URL:', req.url);
    console.log('Query parameters:', parsedUrl.query);
    
    // Save to file for analysis
    const logEntry = {
      timestamp: new Date().toISOString(),
      url: req.url,
      query: parsedUrl.query,
      headers: req.headers
    };
    
    fs.appendFileSync('oauth-debug.log', JSON.stringify(logEntry, null, 2) + '\n\n');
  }
  
  // Serve a simple response
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <body>
        <h1>Debug Server</h1>
        <p>Request received: ${req.method} ${req.url}</p>
        <p>Check the console and oauth-debug.log for details</p>
      </body>
    </html>
  `);
});

server.listen(9999, 'localhost', () => {
  console.log('Debug server running on http://localhost:9999');
  console.log('This will capture and log all OAuth callbacks');
  console.log('Check the console and oauth-debug.log for details');
});