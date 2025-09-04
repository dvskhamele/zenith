const http = require('http');
const net = require('net');

// Create a simple TCP proxy
const server = http.createServer((req, res) => {
  // Forward HTTP requests to local Next.js server
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500);
    res.end('Proxy error');
  });
});

server.listen(80, '49.43.3.243', () => {
  console.log('Proxy server running on 49.43.3.243:80');
  console.log('Forwarding to localhost:3001');
});