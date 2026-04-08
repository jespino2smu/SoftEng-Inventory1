const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const FRONTEND_PORT = 5173;
const BACKEND_PORT = 1337;
const PROXY_PORT = 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url.startsWith('/api')) {
    proxy.web(req, res, { target: `http://localhost:${BACKEND_PORT}` });
  } 

  else {
    proxy.web(req, res, { target: `http://localhost:${FRONTEND_PORT}` });
  }
});

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: Connection refused.');
});

console.log(`Proxy running on http://localhost:${PROXY_PORT}`);
server.listen(PROXY_PORT);