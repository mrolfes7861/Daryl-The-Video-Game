/* Tiny static server for local preview. There is no build step; this exists
   only so the game can be opened over http:// instead of file://.
   Run it with: node scripts/serve.js   then visit http://localhost:5177 */
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 5177;
const MIME = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css',
              '.svg':'image/svg+xml', '.md':'text/plain', '.json':'application/json'};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.resolve(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Daryl running at http://localhost:${PORT}`));
