const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const publicDir = path.join(__dirname);

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0].split('#')[0] || '/';
  const safePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.join(publicDir, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  console.log('request:', req.url, '=>', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('readFile error', err.code, err.path || filePath, err.message);
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 - Halaman tidak ditemukan');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('500 - Terjadi kesalahan server');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

let activePort = Number(port);
const maxPort = activePort + 10;

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`Server berjalan di http://localhost:${portToTry}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    if (activePort < maxPort) {
      console.warn(`Port ${activePort} sudah dipakai, mencoba port ${activePort + 1}`);
      activePort += 1;
      startServer(activePort);
      return;
    }
    console.warn('Semua port 8000-8010 sibuk, memakai port acak');
    server.listen(0);
    return;
  }
  console.error('Server error', err);
  process.exit(1);
});

startServer(activePort);
