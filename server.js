const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ATOMIC FCA v${pkg.version}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 40px 48px;
      max-width: 720px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .badge {
      display: inline-block;
      background: linear-gradient(90deg, #7f5af0, #2cb67d);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2.4rem;
      font-weight: 800;
      background: linear-gradient(90deg, #7f5af0, #2cb67d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #a8a8b3;
      font-size: 1rem;
      margin-bottom: 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .stat-label { font-size: 0.75rem; color: #a8a8b3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .stat-value { font-size: 1.1rem; font-weight: 600; color: #e0e0e0; }
    .features { list-style: none; margin-bottom: 32px; }
    .features li {
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .features li:last-child { border-bottom: none; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #2cb67d; flex-shrink: 0; }
    .links { display: flex; gap: 12px; flex-wrap: wrap; }
    .link-btn {
      display: inline-block;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .link-btn:hover { opacity: 0.85; }
    .btn-primary { background: linear-gradient(90deg, #7f5af0, #2cb67d); color: #fff; }
    .btn-secondary { background: rgba(255,255,255,0.1); color: #e0e0e0; border: 1px solid rgba(255,255,255,0.2); }
    .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #2cb67d; margin-right: 6px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Library Ready</div>
    <h1>ATOMIC FCA v${pkg.version}</h1>
    <p class="subtitle">Ultra-Fast, Secure &amp; Stable Facebook Messenger API</p>

    <div class="grid">
      <div class="stat">
        <div class="stat-label">Version</div>
        <div class="stat-value">${pkg.version}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Status</div>
        <div class="stat-value"><span class="status-dot"></span>Running</div>
      </div>
      <div class="stat">
        <div class="stat-label">Node.js</div>
        <div class="stat-value">${process.version}</div>
      </div>
      <div class="stat">
        <div class="stat-label">License</div>
        <div class="stat-value">${pkg.license}</div>
      </div>
    </div>

    <ul class="features">
      <li><span class="dot"></span>Parallel Message Sending (up to 5x concurrent)</li>
      <li><span class="dot"></span>Integrated Secure Login (Email / Password / 2FA / AppState)</li>
      <li><span class="dot"></span>MQTT Real-Time Messaging</li>
      <li><span class="dot"></span>Session Resilience &amp; Auto-Cookie Refresh</li>
      <li><span class="dot"></span>SQLite Database via Sequelize</li>
      <li><span class="dot"></span>Anti-Detection &amp; Stealth Mode</li>
      <li><span class="dot"></span>TypeScript Definitions Included</li>
    </ul>

    <div class="links">
      <a class="link-btn btn-primary" href="${pkg.homepage}" target="_blank">GitHub Repository</a>
      <a class="link-btn btn-secondary" href="${pkg.homepage}/blob/main/README.md" target="_blank">Documentation</a>
    </div>
    <p style="margin-top:24px;font-size:0.8rem;color:#a8a8b3;">By <strong style="color:#e0e0e0;">${pkg.author}</strong></p>
  </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: pkg.version, uptime: process.uptime() }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`ATOMIC FCA v${pkg.version} server running at http://${HOST}:${PORT}`);
});
