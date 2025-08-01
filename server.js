const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const storiesFile = path.join(__dirname, 'stories.json');

function loadStories() {
  try {
    return JSON.parse(fs.readFileSync(storiesFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveStories(data) {
  fs.writeFileSync(storiesFile, JSON.stringify(data, null, 2));
}

function serveFile(filePath, res, contentType = 'text/html') {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/api/stories')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');
    const data = loadStories();
    const stories = user && data[user] ? data[user] : [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(stories));
  }

  if (req.method === 'POST' && req.url === '/api/stories') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { user, story } = JSON.parse(body);
        if (!user || !story) throw new Error('Missing fields');
        const data = loadStories();
        if (!data[user]) data[user] = [];
        data[user].push(story);
        saveStories(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  if (req.method === 'DELETE' && req.url.startsWith('/api/stories')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');
    if (user) {
      const data = loadStories();
      delete data[user];
      saveStories(data);
    }
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    return serveFile(path.join(__dirname, 'index.html'), res);
  }

  // Static assets (css, js, images)
  if (req.method === 'GET') {
    const filePath = path.join(__dirname, req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
      };
      const contentType = contentTypeMap[ext] || 'application/octet-stream';
      return serveFile(filePath, res, contentType);
    }
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
