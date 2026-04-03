# ATOMIC FCA v1.1.0

## Overview
ATOMIC FCA is an advanced, unofficial Facebook Messenger API for Node.js. Designed for building chatbots and automation tools with a focus on speed, stability, and security (anti-detection/account safety).

**Author:** Cid kageno (cid-kageno-dev)

## Project Structure
- `index.js` — Main library entry point (login, API initialization)
- `server.js` — Simple web status server (port 5000)
- `src/` — API method implementations (sendMessage, getUserInfo, etc.)
- `lib/` — Core internal architecture:
  - `auth/` — Credential-based login and session management
  - `safety/` — Anti-detection mechanisms (StealthMode, FacebookSafety)
  - `network/` — Proxy management, user-agent handling
  - `database/` — Sequelize models and SQLite persistence
  - `mqtt/` — Real-time MQTT messaging
  - `performance/` — Optimization managers and metrics
- `Fca_Database/` — SQLite database files
- `examples/` — Sample bots (basic-bot.js, advanced-bot.js, echo-test.js)
- `docs/` — Comprehensive API documentation
- `fca-config.json` — Library configuration (autoUpdate, mqtt settings)

## Runtime
- **Language:** Node.js 20
- **Package manager:** npm
- **Port:** 5000 (status web server)

## Key Dependencies
- `axios`, `got` — HTTP requests
- `mqtt` — Real-time Facebook MQTT connection
- `sequelize`, `sqlite3` — Local data persistence
- `tough-cookie` — Session/cookie management
- `cheerio` — HTML parsing

## Workflow
- **Start application** — `node server.js` on port 5000 (webview)

## Usage
This is a Node.js library meant to be required/imported in bot projects:
```js
const login = require('atomic-fca');
login({ appState: [...] }, (err, api) => {
  api.sendMessage('Hello!', threadID);
});
```

Credentials can be provided via:
1. `appstate.json` file in the project root
2. `EMAIL` and `PASSWORD` environment variables
