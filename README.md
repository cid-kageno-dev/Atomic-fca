 <p align="center">
  <img src="Assets/iam-atomic.gif" alt="ATOMIC FCA" width="520" />
</p>

# ATOMIC-fca v1.1.0 💥 

> **Ultra-Fast, Secure & Stable Facebook Messenger API**  
> *Engineered for Speed, Stability & Zero Detection*

## 🔥 Version 1.1.0 
- **⚡ Parallel Message Sending**: Send up to 5 messages concurrently with `setParallelSend()` - 3x faster response times!
- **🚀 Fast Send Mode**: Bypass queue completely with `setFastSend(true)` for instant replies (competition-level speed).
- **📊 Configurable Queue System**: Fine-tune with `enableGroupQueue()` and `setGroupQueueCapacity()` for your needs.
- **🧠 Smart Concurrency**: Default 3 parallel sends - balanced speed and safety out of the box.
- **🛡️ Retained Safety Features**: All security mechanisms preserved - toggle speed vs safety as needed.
- **📈 Benchmarked Performance**: Matches fca-unofficial speed while maintaining superior stability.

---
## ✅ Core Value
| Pillar | What You Get |
|--------|--------------|
| **⚡ Ultra-Fast Messaging** | Parallel sends (up to 5x), Fast Send mode, instant response times |
| Integrated Secure Login | Username / Password / TOTP 2FA → stable appstate generation & reuse |
| Session Resilience | Anchored User‑Agent continuity, adaptive safe refresh, lightweight token poke, periodic recycle |
| Connection Stability | Adaptive MQTT backoff, idle & ghost detection, layered post-refresh health probes, synthetic keepalives |
| Delivery Reliability | Multi-path message send fallback (MQTT → HTTP → direct) + delivery receipt timeout suppression |
| Memory Guard | Bounded queues, edit TTL sweeps, controlled resend limits |
| Observability | Health + memory + delivery metrics (`api.getHealthMetrics()`, `api.getMemoryMetrics()`) |
| Edit Safety | Pending edit buffer, ACK watchdog, p95 ACK latency tracking |
| Type Definitions | First-class `index.d.ts` with modern Promise signatures |

---
## ⚡ Speed vs Safety - Your Choice!
```js
// MAXIMUM SPEED - Bypass queue (like fca-unofficial)
api.setFastSend(true);

// BALANCED (Default) - 3 concurrent sends  
api.setParallelSend(3);

// MORE SPEED - Up to 5 concurrent
api.setParallelSend(5);

// MAXIMUM SAFETY - Sequential queue
api.setParallelSend(1);
api.setFastSend(false);
```

---
## 🚀 Quick Start

### Option 1: AppState Login (Recommended )
```js
const login = require('atomic-fca');

(async () => {
  const api = await login({ appState: require('./appstate.json') }, {
    autoReconnect: true,
    randomUserAgent: true  // NEW!
  });
  console.log('Logged in as', api.getCurrentUserID());
  api.listen((err, evt) => {
    if (err) return console.error('Listen error:', err);
    if (evt.body) api.sendMessage('Echo: ' + evt.body, evt.threadID);
  });
})();
```

### Option 2: Email/Password Login 
```js
const login = require('atomic-fca');

(async () => {
  const api = await login({
    email: 'your-email@example.com',  // NEW!
    password: 'your-password'          // NEW!
  }, {
    autoReconnect: true,
    randomUserAgent: true,             // NEW!
    proxy: 'socks5://127.0.0.1:1080'  // NEW!
  });
  console.log('✅ Logged in!');
  api.listen((err, msg) => {
    if (err) return console.error(err);
    if (msg.body === 'ping') api.sendMessage('pong', msg.threadID);
  });
})();
```

### Option 3: With Proxy + Random UA 
```js
const login = require('atomic-fca');

(async () => {
  const api = await login({ appState: require('./appstate.json') }, {
    proxy: 'http://proxy.example.com:8080',  // NEW!
    randomUserAgent: true,                    // NEW!
    autoMarkRead: true,                       // NEW!
    emitReady: true,                          // NEW!
    bypassRegion: 'PRN'                       // NEW!
  });
  
  api.on('ready', () => console.log('🚀 Bot ready!'));
  api.listen((err, msg) => {
    if (err) return console.error(err);
    if (msg.body) api.sendMessage('Echo: ' + msg.body, msg.threadID);
  });
})();
```

---
## 🧪 Key Runtime APIs
```js
api.setEditOptions({ maxPendingEdits, editTTLms, ackTimeoutMs, maxResendAttempts });
api.setBackoffOptions({ base, factor, max, jitter });
api.enableLazyPreflight(true);       // Skip heavy validation if recent success
api.getHealthMetrics();              // uptime, reconnects, ack latency, delivery stats
api.getMemoryMetrics();              // queue sizes & guard counters
```

### Monitoring Snippet
```js
setInterval(() => {
  const h = api.getHealthMetrics();
  const m = api.getMemoryMetrics();
  console.log('[HEALTH]', h?.status, 'acks', h?.ackCount, 'p95Ack', h?.p95AckLatencyMs);
  console.log('[DELIVERY]', {
    attempts: h?.deliveryAttempts,
    success: h?.deliverySuccess,
    failed: h?.deliveryFailed,
    timeouts: h?.deliveryTimeouts,
    disabledSince: h?.deliveryDisabledSince
  });
  console.log('[MEM]', m);
}, 60000);
```

---
## 🛡️ Safety & Stability Architecture
| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| UA Continuity | Single anchored fingerprint | Avoid heuristic expiry & drift |
| Adaptive Refresh | Risk-aware timing bands | Token longevity without bursts |
| Lightweight Poke | Subtle `fb_dtsg` renewal | Keeps session warm quietly |
| Collision Guard | 45m spacing window | Prevent clustered maintenance events |
| Idle / Ghost Probe | Timed silent detection | Force reconnect on stale sockets |
| Periodic Recycle | Randomized (~6h ±30m) | Pre-empt silent degradation |
| Backoff Strategy | Exponential + jitter | Graceful network recovery |
| Delivery Suppression | Disable after repeated timeouts | Preserve send latency |

Disable heavy preflight if embedding inside a framework already doing checks:
```js
await login({ appState }, { disablePreflight: true });
```

---
## 🛰️ MQTT Enhancements (Since 3.1.x)
- **Smart Recovery**: Fetches fresh Sequence ID before reconnecting on errors (prevents stale token loops)
- **Lifecycle Management**: Proactive randomized reconnects (26-60m) to avoid long-session forced disconnects
- Adaptive reconnect curve (caps 5m)
- Layered post-refresh probes (1s / 10s / 30s)
- Synthetic randomized keepalives (55–75s)
- Structured error classification feeding metrics

---
## ✉️ Delivery Reliability
- Multi-path send fallback (MQTT publish → HTTP send → direct fallback)
- Per-attempt timeout & retry for message delivery receipts
- Automatic classification of transient timeouts (ETIMEDOUT / ECONNRESET / EAI_AGAIN)
- Adaptive suppression of delivery receipt calls when environment unstable (protects primary send throughput)

---
## 🧠 Long Session Best Practices
1. Prefer appstate reuse (minimal credential logins).
2. Preserve `persistent-device.json` (only delete if forced challenge).
3. Don’t manually rotate User-Agent – built-in continuity handles it.
4. Inspect metrics before forcing reconnect; let backoff work.
5. Keep dependencies updated; review CHANGELOG for operational notes.

---
## 🐐 Using with GoatBot V2 (Summary)
| Goal | Steps |
|------|-------|
| Generate appstate | Run credential login script → save `appstate.json` → configure GoatBot |
| Full replacement | Install `atomic-fca` → shim `fb-chat-api/index.js` exporting module |
| Direct require swap | Replace `require('fb-chat-api')` with `require('atomic-fca')` |

Minimal example:
```js
const login = require('atomic-fca');
(async () => {
  const api = await login({ appState: require('./appstate.json') });
  api.listen((err, event) => {
    if (err) return console.error(err);
    if (event.body === '!ping') api.sendMessage('pong', event.threadID);
  });
})();
```

---
## 📚 Documentation Map
| Resource | Location |
|----------|----------|
| **Usage Guide (Examples)** | `USAGE-GUIDE.md` |
| Full API Reference | `DOCS.md` |
| Feature Guides | `docs/*.md` |
| Configuration Reference | `docs/configuration-reference.md` |
| Safety Details | `docs/account-safety.md` |
| Examples | `examples/` |

---
## ⚠️ Disclaimer
Not affiliated with Facebook. Use responsibly and comply with platform terms & local laws.

---
## 🤝 Contributing
Focused PRs improving stability, safety heuristics, protocol coverage, or typings are welcome.

---
## 📜 License
[Cid kageno](https://www.facebook.com/mritunjoy.mondol.535402)

MIT © 2026 Cid kageno (cid-kageno-dev)
This project is based on [ws3-fca](https://github.com/NethWs3Dev/ws3-fca.git)
And use [Nexus-fca](https://github.com/Nexus-016/-Nexus-fCA.git) configuration 
