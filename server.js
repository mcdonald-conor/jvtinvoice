const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// MIME type mapping
const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Log incoming requests in production to help debug mobile issues
    if (process.env.NODE_ENV === 'production') {
      console.log(`Request: ${req.method} ${pathname} - User Agent: ${req.headers['user-agent'] || 'Unknown'}`);
    }

    // Set proper MIME types for static files
    const ext = path.extname(pathname);
    if (ext && mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }

    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Set CORS headers to allow all origins (helpful for mobile)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  }).listen(PORT, HOSTNAME, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${HOSTNAME}:${PORT}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    console.log(`> Hostname: ${HOSTNAME}`);
  });
});
