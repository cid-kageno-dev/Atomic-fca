# Deployment & Configuration Guide (ATOMIC FCA 3.0)

This guide shows how to use ATOMIC FCA as an npm package, configure it via file and environment variables, deploy safely on platforms like Render, and avoid the “you couldn't create multiple sessions” warning.

---
## 1) Using as an npm package

Install:

```bash
npm install atomic-fca
```

Basic appstate usage:

```js
const login = require('atomic-fca');

(async () => {
  const api = await login({ appState: require('./appstate.json') });
  api.listen((err, evt) => {
    if (err) return console.error(err);
    if (evt.body) api.sendMessage('Echo: ' + evt.body, evt.threadID);
  });
})();
```

---
## 2) Configuration options

You can control behavior via:
- Programmatic options: `api.setOptions({ ... })`
- Config file: `fca-config.json` (auto-created on first run)
- Environment variables (recommended for hosting)

### 2.1 Programmatic options (common)
```js
api.setOptions({
  autoReconnect: true,
  updatePresence: false,
  selfListen: false,
  logLevel: 'warn',           // npmlog level: silly|verbose|info|warn|error
  userAgent: '...Chrome/...',
  proxy: 'http://user:pass@host:port',
});
```

### 2.2 Config file: `fca-config.json`
A default file is stored at project root and merged with internal defaults. You can keep project-wide settings here:

```json
{
  "autoUpdate": true,
  "mqtt": { "enabled": true, "reconnectInterval": 3600 },
  "logLevel": "warn",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "proxy": "http://user:pass@host:port"
}
```

Note: For secrets and deployment toggles, prefer environment variables below.

### 2.3 Environment variables (hosting-friendly)
These are read at runtime and override defaults:

- Storage & persistence
  - `ATOMIC_DATA_DIR` → base directory for persistent files
  - `ATOMIC_APPSTATE_PATH` → path to `appstate.json`
  - `ATOMIC_DEVICE_FILE` → path to `persistent-device.json`
  - `ATOMIC_BACKUP_PATH` → directory for appstate backups
  - `ATOMIC_PERSISTENT_DEVICE` → `true|false` (keep same device fingerprint)

- Networking & headers
  - `ATOMIC_PROXY` (or `HTTPS_PROXY` / `HTTP_PROXY`) → Proxy URL
  - `ATOMIC_ACCEPT_LANGUAGE` → e.g. `en-US,en;q=0.9`
  - `ATOMIC_UA` → override User-Agent
  - `ATOMIC_REGION` → force MQTT region (e.g., `HIL`)

- Stability & preflight
  - `ATOMIC_DISABLE_PREFLIGHT` → `true|false` (skip heavy session preflight)
  - `ATOMIC_ONLINE` → `true|false`
  - `ATOMIC_VERBOSE_MQTT` → `true|false` (extra MQTT logs only when needed)

Example (Render):
```
ATOMIC_DATA_DIR=/var/data/atomic-fca
ATOMIC_APPSTATE_PATH=/var/data/atomic-fca/appstate.json
ATOMIC_DEVICE_FILE=/var/data/atomic-fca/persistent-device.json
ATOMIC_BACKUP_PATH=/var/data/atomic-fca/backups
ATOMIC_PERSISTENT_DEVICE=true

ATOMIC_ACCEPT_LANGUAGE=en-US,en;q=0.9
ATOMIC_UA=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36
ATOMIC_DISABLE_PREFLIGHT=true
ATOMIC_ONLINE=false
# Optional region & proxy
# ATOMIC_REGION=HIL
# ATOMIC_PROXY=http://user:pass@host:port
```

---
## 3) Deploying on Render (or other PaaS)

1) Persistent disk
- Mount a disk and point `ATOMIC_DATA_DIR` to it.
- Ensure `appstate.json` and `persistent-device.json` live on this disk.

2) Single instance per account
- Run only one service instance for a given account.
- Disable autoscaling/replicas for this worker.

3) Environment hardening
- Set `ATOMIC_PERSISTENT_DEVICE=true` to anchor device fingerprint.
- Set `ATOMIC_DISABLE_PREFLIGHT=true` to reduce heavy checks.
- Optionally use a reputable residential/mobile proxy via `ATOMIC_PROXY`.

4) Keep your appstate fresh
- Generate appstate locally on a trusted network, then deploy it.
- Avoid frequent credential logins from the server itself.

---
## 4) "You couldn't create multiple sessions" – what it means and fixes

This warning typically appears when Facebook detects concurrent or rapidly rotating logins for the same account, often from:
- Multiple bots/instances using the same account at the same time
- Different IPs or device fingerprints in quick succession
- Frequent logouts/re-logins (or unstable appstate)

How to avoid:
- Run exactly one bot instance per account.
- Reuse the same `appstate.json` and `persistent-device.json` (set `ATOMIC_PERSISTENT_DEVICE=true`).
- Avoid logging in with username/password from multiple places—generate appstate once and reuse it.
- Use a stable IP. If your PaaS IPs rotate or look like a datacenter bot, use a reputable residential/mobile proxy.
- Keep preflight light on PaaS (`ATOMIC_DISABLE_PREFLIGHT=true`).

Recovery steps when you see the warning:
- Stop all other running instances for the same account.
- Log in manually in a browser, pass any checkpoint, verify recent logins.
- Regenerate a fresh appstate (locally), deploy, and keep it persistent.

---
## 5) Minimal config-first example

`fca-config.json` (project root):
```json
{
  "logLevel": "warn",
  "mqtt": { "enabled": true, "reconnectInterval": 3600 },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36"
}
```

Bot code:
```js
const login = require('atomic-fca');
(async () => {
  const api = await login({ appState: require(process.env.ATOMIC_APPSTATE_PATH || './appstate.json') });
  // Optional fine-tuning
  api.setOptions({
    autoReconnect: true,
    updatePresence: false,
    proxy: process.env.ATOMIC_PROXY,
  });
  api.listen((err, evt) => {
    if (err) return console.error(err);
    if (evt.body) api.sendMessage('Echo: ' + evt.body, evt.threadID);
  });
})();
```

---
## 6) Troubleshooting quick tips
- Rapid cookie expiry: ensure persistence paths are on mounted disk; set `ATOMIC_PERSISTENT_DEVICE=true`.
- Frequent reconnect warnings: let adaptive backoff work; keep `autoReconnect=true`.
- No replies sent: check proxy/network egress; use delivery metrics via `api.getHealthMetrics()`.
- Noisy logs: avoid `ATOMIC_VERBOSE_MQTT` unless debugging; prefer `logLevel=warn`.

For full API details, see `DOCS.md` and other files in `docs/`.
