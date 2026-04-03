<p align="center">
  <img src="Assets/iam-atomic.gif" alt="ATOMIC FCA" width="520" />
</p>

# ATOMIC-fca v1.1.0 💥

> **High-Performance, Resilient Facebook Messenger API**  
> Engineered for speed, stability, and adaptive safety

---

## 🔥 Version 1.1.0 Highlights

- ⚡ **Parallel Message Sending** — Up to 5 concurrent sends
- 🚀 **Fast Send Mode** — Optional queue bypass for ultra-low latency
- 📊 **Configurable Queue System** — Fine-tune throughput vs safety
- 🧠 **Smart Concurrency Defaults** — Balanced performance out of the box
- 🛡️ **Safety Systems Preserved** — Adaptive protections remain active
- 📈 **Performance Optimized** — Designed for low-latency messaging workflows

---

## ✅ Core Value

| Pillar | Description |
|--------|------------|
| ⚡ Performance | Parallel sending, reduced latency, configurable throughput |
| 🔐 Secure Login | AppState + credential login with 2FA support |
| 🔁 Session Resilience | Token lifecycle management + adaptive refresh |
| 🌐 Connection Stability | MQTT recovery, backoff strategies, keepalive system |
| 📬 Delivery Reliability | Multi-path fallback (MQTT → HTTP → direct) |
| 🧠 Memory Control | Queue limits, resend caps, TTL cleanup |
| 📊 Observability | Health & memory metrics APIs |
| ✏️ Edit Safety | Pending edit tracking + ACK monitoring |

---

## ⚡ Speed vs Safety Configuration

```js
// Maximum speed (higher risk)
api.setFastSend(true);

// Balanced (default)
api.setParallelSend(3);

// Higher throughput
api.setParallelSend(5);

// Maximum safety (sequential)
api.setParallelSend(1);
api.setFastSend(false);
---

# ⚠️ Note: FastSend disables queue protections and may increase:
Rate limiting risk
Temporary delivery failures
Account flagging probability
🧩 Architecture Overview
ATOMIC-fca operates across three core layers:
1. Transport Layer
MQTT (primary)
HTTP fallback
Direct send fallback
2. Session Layer
AppState reuse
Token lifecycle management
User-Agent continuity
3. Control Layer
Queue system
Parallel send engine
Safety limiter & backoff logic
🚀 Quick Start
Option 1: AppState Login (Recommended)
```js
const login = require('atomic-fca');

(async () => {
  const api = await login(
    { appState: require('./appstate.json') },
    {
      autoReconnect: true,
      randomUserAgent: true
    }
  );

  console.log('Logged in as', api.getCurrentUserID());

  api.listen((err, evt) => {
    if (err) return console.error(err);
    if (evt.body) {
      api.sendMessage('Echo: ' + evt.body, evt.threadID);
    }
  });
})();
Option 2: Email/Password Login
JavaScript
const login = require('atomic-fca');

(async () => {
  const api = await login(
    {
      email: 'your-email@example.com',
      password: 'your-password'
    },
    {
      autoReconnect: true,
      randomUserAgent: true,
      proxy: 'socks5://127.0.0.1:1080'
    }
  );

  console.log('✅ Logged in');

  api.listen((err, msg) => {
    if (err) return console.error(err);
    if (msg.body === 'ping') {
      api.sendMessage('pong', msg.threadID);
    }
  });
})();
---

Option 3: Advanced Setup
```js
const login = require('atomic-fca');

(async () => {
  const api = await login(
    { appState: require('./appstate.json') },
    {
      proxy: 'http://proxy.example.com:8080',
      randomUserAgent: true,
      autoMarkRead: true,
      emitReady: true,
      bypassRegion: 'PRN'
    }
  );

  api.on('ready', () => console.log('🚀 Bot ready'));

  api.listen((err, msg) => {
    if (err) return console.error(err);
    if (msg.body) {
      api.sendMessage('Echo: ' + msg.body, msg.threadID);
    }
  });
})();
---
🧪 Runtime APIs
```js
api.setEditOptions({ maxPendingEdits, editTTLms, ackTimeoutMs, maxResendAttempts });
api.setBackoffOptions({ base, factor, max, jitter });

api.enableLazyPreflight(true);

api.getHealthMetrics();
api.getMemoryMetrics();
---
📊 Monitoring Example
```js
setInterval(() => {
  const h = api.getHealthMetrics();
  const m = api.getMemoryMetrics();

  console.log('[HEALTH]', h?.status, 'acks', h?.ackCount);
  console.log('[DELIVERY]', {
    attempts: h?.deliveryAttempts,
    success: h?.deliverySuccess,
    failed: h?.deliveryFailed
  });
  console.log('[MEMORY]', m);
}, 60000);
---
⚙️ Internal Systems
🛰️ MQTT System
Smart reconnection with fresh sequence IDs
Randomized reconnect intervals (26–60 min)
Keepalive system (55–75 sec)
Error classification + metrics tracking
✉️ Delivery System
Multi-path fallback:
MQTT → HTTP → Direct
Retry + timeout handling
Adaptive suppression under unstable conditions
🛡️ Safety System
Layer
Mechanism
Purpose
UA Continuity
Stable fingerprint
Reduce session anomalies
Adaptive Refresh
Risk-based timing
Extend session lifespan
Lightweight Poke
Silent token renewal
Maintain activity
Backoff Strategy
Exponential + jitter
Prevent burst failures
Idle Detection
Ghost socket detection
Force recovery
📊 Example Benchmark (Local Testing)
Mode
Avg Latency
Throughput
Sequential
~220ms
~4–5 msg/s
Parallel (3)
~90ms
~10–12 msg/s
FastSend
~40ms
20+ msg/s
Results vary based on network and environment.
🧠 Best Practices
Use AppState instead of repeated logins
Preserve persistent-device.json
Avoid manual User-Agent rotation
Let backoff system handle reconnects
Monitor metrics before forcing resets
🔌 Integration Example (GoatBot V2)
JavaScript
const login = require('atomic-fca');

(async () => {
  const api = await login({ appState: require('./appstate.json') });

  api.listen((err, event) => {
    if (err) return console.error(err);

    if (event.body === '!ping') {
      api.sendMessage('pong', event.threadID);
    }
  });
})();

## 📚 Documentation

| Resource | Location |
|----------|----------|
| Usage Guide | `USAGE-GUIDE.md` |
| API Reference | `DOCS.md` |
| Config Reference | `docs/configuration-reference.md` |
| Safety Docs | `docs/account-safety.md` |
| Examples | `examples/` |

---

## ⚠️ Disclaimer

This project is not affiliated with Facebook.  
Use responsibly and comply with platform terms and applicable laws.

---

## 🤝 Contributing

PRs are welcome, especially for:
- Stability improvements
- Protocol updates
- Performance tuning
- Type definitions

---

## 📜 License

MIT © 2026 Cid Kageno  
https://github.com/cid-kageno-dev

---

## ⭐ Support

If you find this project useful:
- Star the repository ⭐
- Share with others
- Contribute improvements
