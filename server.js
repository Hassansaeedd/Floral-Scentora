// Simple Static File Server for Al-Qadsiya Khushbuu Mahal
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

http.createServer((req, res) => {
  // Decode URL to handle spaces or special characters in filenames
  let decodedUrl = decodeURIComponent(req.url);
  
  // Strip query parameters or hashes
  const cleanUrl = decodedUrl.split('?')[0].split('#')[0];
  
  let filePath = path.join(__dirname, cleanUrl);
  
  // If requesting root or directory, serve index.html
  if (req.url === '/' || req.url.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 File Not Found</h1><p>The requested URL was not found on this server.</p>', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}).listen(PORT, () => {
  console.log(`Boutique server running at http://localhost:${PORT}/`);
});
