# 🚀 ATOMIC FCA 3.1 - NEW FEATURES GUIDE

## 🎉 What's New in ATOMIC FCA 3.1

We've just added **MAJOR FEATURES** to make ATOMIC FCA even better! Now with advanced authentication, comprehensive proxy support, and intelligent user agent management - all built on our proven stability foundation. ATOMIC FCA is the **BEST, SAFEST, and MOST STABLE FCA**! 🏆

---

## ✨ New Features Overview

### 1. 🔐 Email/Password Login Support
- **Login with Facebook email and password** (not just cookies!)
- Facebook API authentication method
- Automatic session cookie generation
- Full integration with existing bot features

### 2. 🌐 Advanced Proxy Support
- **HTTP/HTTPS/SOCKS5 proxy support**
- Works with ALL connections (HTTP + WebSocket + MQTT)
- Environment variable configuration
- Automatic proxy testing

### 3. 🎭 Random User Agent System
- **14+ realistic user agents** (Chrome, Edge, Firefox, Safari)
- Windows, macOS, Linux support
- Automatic rotation to avoid detection
- Latest browser versions (up to Chrome 131!)

### 4. ⚙️ Enhanced Configuration Options
- `autoMarkRead` - Auto mark messages as read
- `emitReady` - Emit ready event on login
- `randomUserAgent` - Enable random UA rotation
- `bypassRegion` - Bypass region restrictions
- All options configurable via environment variables

---

## 📖 Usage Examples

### 1. Email/Password Login

#### Basic Example
```javascript
const login = require('atomic-fca');

// Login with email and password
login({
    email: 'your-email@example.com',
    password: 'your-password'
}, {
    autoReconnect: true,
    online: true
}, (err, api) => {
    if (err) return console.error(err);
    
    console.log('✅ Logged in successfully!');
    
    api.listen((err, message) => {
        if (err) return console.error(err);
        
        api.sendMessage(`Echo: ${message.body}`, message.threadID);
    });
});
```

#### With Options
```javascript
login({
    email: 'your-email@example.com',
    password: 'your-password'
}, {
    autoReconnect: true,
    autoMarkRead: true,
    emitReady: true,
    online: true,
    userAgent: 'custom user agent' // Optional
}, callback);
```

#### Environment Variable Support
```bash
# Set credentials via environment
ATOMIC_EMAIL=your-email@example.com
ATOMIC_PASSWORD=your-password

# Then use in code
login({
    email: process.env.ATOMIC_EMAIL,
    password: process.env.ATOMIC_PASSWORD
}, callback);
```

---

### 2. Proxy Support

#### Using HTTP/HTTPS Proxy
```javascript
const login = require('atomic-fca');

login({ appState: cookies }, {
    proxy: 'http://proxy.example.com:8080',
    autoReconnect: true
}, (err, api) => {
    if (err) return console.error(err);
    console.log('✅ Logged in via proxy!');
});
```

#### Using SOCKS5 Proxy
```javascript
login({ appState: cookies }, {
    proxy: 'socks5://127.0.0.1:1080',
    autoReconnect: true
}, callback);
```

#### Proxy with Authentication
```javascript
login({ appState: cookies }, {
    proxy: 'http://username:password@proxy.example.com:8080'
}, callback);
```

#### Environment Variable
```bash
# Set proxy via environment
ATOMIC_PROXY=http://proxy.example.com:8080
# OR
HTTP_PROXY=http://proxy.example.com:8080
HTTPS_PROXY=http://proxy.example.com:8080
```

---

### 3. Random User Agent

#### Enable Random UA
```javascript
login({ appState: cookies }, {
    randomUserAgent: true,
    autoReconnect: true
}, (err, api) => {
    if (err) return console.error(err);
    console.log('✅ Using random user agent!');
});
```

#### Environment Variable
```bash
# Enable random user agent
ATOMIC_RANDOM_USER_AGENT=true
```

#### Custom User Agent
```javascript
login({ appState: cookies }, {
    userAgent: 'Mozilla/5.0 (Custom Browser)',
    autoReconnect: true
}, callback);
```

#### Use Specific Browser/OS
```javascript
const { UserAgentManager } = require('atomic-fca');

const uaManager = new UserAgentManager({ random: true });

// Get Chrome on Windows
const ua = uaManager.getRandomUserAgent({ 
    browser: 'Chrome', 
    os: 'Windows' 
});

login({ appState: cookies }, {
    userAgent: ua,
    autoReconnect: true
}, callback);
```

---

### 4. Advanced Configuration

#### All New Options
```javascript
login({ appState: cookies }, {
    // NEW Options
    autoMarkRead: true,          // Auto mark messages as read
    emitReady: true,             // Emit ready event on login
    randomUserAgent: true,       // Random user agent rotation
    proxy: 'http://proxy:8080',  // Proxy support
    bypassRegion: 'ASH',         // Bypass region restriction
    
    // Existing Options
    selfListen: false,
    listenEvents: true,
    updatePresence: true,
    forceLogin: true,
    autoReconnect: true,
    online: true,
    logLevel: 'info'
}, callback);
```

#### Environment Variables
```bash
# Authentication
ATOMIC_EMAIL=your-email@example.com
ATOMIC_PASSWORD=your-password

# Network
ATOMIC_PROXY=http://proxy.example.com:8080
ATOMIC_RANDOM_USER_AGENT=true
ATOMIC_USER_AGENT=custom-user-agent

# Configuration
ATOMIC_ONLINE=true
ATOMIC_BYPASS_REGION=ASH
ATOMIC_ACCEPT_LANGUAGE=en-US,en;q=0.9

# Session
ATOMIC_SESSION_LOCK_ENABLED=true

# Cookie Management
ATOMIC_COOKIE_REFRESH_ENABLED=true
ATOMIC_COOKIE_REFRESH_INTERVAL=1800000  # 30 minutes
ATOMIC_COOKIE_EXPIRY_DAYS=90
ATOMIC_COOKIE_BACKUP_ENABLED=true

# MQTT
ATOMIC_MQTT_TIMEOUT=300000              # 5 minutes
ATOMIC_MQTT_MIN_BACKOFF=1000           # 1 second
ATOMIC_MQTT_MAX_BACKOFF=300000         # 5 minutes
ATOMIC_MQTT_BACKOFF_MULTIPLIER=2.0
```

---

## 🔧 Advanced Usage

### Combining Email/Password + Proxy + Random UA
```javascript
const login = require('atomic-fca');

login({
    email: 'your-email@example.com',
    password: 'your-password'
}, {
    // Network security
    proxy: 'socks5://127.0.0.1:1080',
    randomUserAgent: true,
    
    // Bot configuration
    autoReconnect: true,
    autoMarkRead: true,
    emitReady: true,
    online: true,
    
    // Safety features
    bypassRegion: 'PRN',
    updatePresence: false
}, (err, api) => {
    if (err) return console.error('Login failed:', err);
    
    console.log('✅ Super secure login successful!');
    console.log(`✅ Logged in as: ${api.getCurrentUserID()}`);
    
    // Ready event
    api.on('ready', () => {
        console.log('🚀 Bot is ready!');
    });
    
    // Listen for messages
    api.listen((err, message) => {
        if (err) return console.error(err);
        
        if (message.type === 'message') {
            console.log(`📩 Message from ${message.senderID}: ${message.body}`);
            
            // Auto-reply
            api.sendMessage(`Received: ${message.body}`, message.threadID);
        }
    });
});
```

### Using ProxyManager Directly
```javascript
const { ProxyManager } = require('atomic-fca');

// Create proxy manager
const proxyManager = new ProxyManager('http://proxy.example.com:8080');

// Test proxy
proxyManager.testProxy().then(working => {
    if (working) {
        console.log('✅ Proxy is working!');
    } else {
        console.log('❌ Proxy connection failed');
    }
});

// Get proxy info
console.log(proxyManager.getInfo());
// { enabled: true, type: 'http', host: 'proxy.example.com', port: '8080' }

// Get axios config with proxy
const axiosConfig = proxyManager.getAxiosConfig();

// Use with axios
const axios = require('axios');
axios.get('https://www.facebook.com', axiosConfig);
```

### Using UserAgentManager Directly
```javascript
const { UserAgentManager } = require('atomic-fca');

// Create UA manager
const uaManager = new UserAgentManager({ random: true });

// Get random user agent
const ua = uaManager.getUserAgent();
console.log(ua);
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...

// Get info
console.log(uaManager.getInfo());
// { browser: 'Chrome', os: 'Windows', version: '131', randomEnabled: true }

// Rotate to new UA
uaManager.rotate();

// Get available browsers
console.log(uaManager.getAvailableBrowsers());
// ['Chrome', 'Edge', 'Firefox', 'Safari']

// Get available OS
console.log(uaManager.getAvailableOS());
// ['Windows', 'macOS', 'Linux']

// Filter by browser/OS
const chromeUA = uaManager.getRandomUserAgent({ 
    browser: 'Chrome', 
    os: 'macOS' 
});
```

### Using EmailPasswordLogin Directly
```javascript
const { EmailPasswordLogin } = require('atomic-fca');
const utils = require('./utils');

const emailLogin = new EmailPasswordLogin();
const jar = utils.getJar();

// Validate credentials first
const validation = emailLogin.validateCredentials(
    'your-email@example.com', 
    'your-password'
);

if (!validation.valid) {
    console.error('Invalid credentials:', validation.errors);
    process.exit(1);
}

// Perform login
emailLogin.login('your-email@example.com', 'your-password', jar)
    .then(result => {
        console.log('✅ Login successful!');
        console.log('User ID:', result.uid);
        console.log('Session Key:', result.session_key);
        
        // Cookies are now in jar
        const cookies = jar.getCookiesSync('https://www.facebook.com');
        console.log(`Got ${cookies.length} cookies`);
    })
    .catch(err => {
        console.error('❌ Login failed:', err.message);
    });
```

---

## 🎯 Why These Features Make ATOMIC FCA the BEST

### 1. **Industry-Leading Feature Set** ✅

| Feature Category | ATOMIC FCA 3.1 |
|------------------|---------------|
| **Authentication** | ✅ Email/Password + AppState + Secure API |
| **Network** | ✅ HTTP/HTTPS/SOCKS5 Proxy Support |
| **Detection Avoidance** | ✅ 14+ Random User Agents |
| **Stability** | ✅ Proactive Cookie Refresh (30min) |
| **MQTT** | ✅ 5min Timeout + Adaptive Recovery |
| **Security** | ✅ Built-in Session Lock Protection |
| **Documentation** | ✅ Extensive Guides + Examples |
| **Error Recovery** | ✅ Proactive Prevention System |

### 2. **Complete Solution** 🌟

✅ **Advanced Features** - Email/password auth, proxy support, random UA rotation  
✅ **Proven Stability** - Cookie management, MQTT recovery, session protection  
✅ **Production Ready** - Comprehensive docs, real-world examples, battle-tested

### 3. **Production Ready** 💪

- ✅ Environment variable configuration
- ✅ Error handling and recovery
- ✅ Comprehensive logging
- ✅ Backwards compatible
- ✅ TypeScript support
- ✅ Full documentation

---

## 🚨 Important Notes

### Email/Password Login
- ⚠️ **Less secure than appState** - Store credentials safely
- ⚠️ **May trigger security checks** - Use appState for production
- ✅ **Good for development** - Quick testing without browser extension
- ✅ **Automatic cookie generation** - Creates appState for you

### Proxy Support
- ✅ **Works with all connections** - HTTP, WebSocket, MQTT
- ✅ **Automatic testing** - Tests proxy before use
- ⚠️ **May be slower** - Proxy adds latency
- ✅ **Good for privacy** - Hides your real IP

### Random User Agent
- ✅ **Reduces detection** - Looks like different browsers
- ✅ **14+ realistic UAs** - Always up-to-date
- ⚠️ **Changes fingerprint** - Use consistent UA for same session
- ✅ **Environment configurable** - Easy to enable/disable

---

## 📊 Comparison: Old vs New

### Before (ATOMIC FCA 3.0)
```javascript
// Only appState login
login({ 
    appState: JSON.parse(fs.readFileSync('appstate.json')) 
}, callback);

// Fixed user agent
// No proxy support (manual setup needed)
// Basic configuration
```

### After (ATOMIC FCA 3.1)
```javascript
// Email/password OR appState
login({ 
    email: 'user@example.com', 
    password: 'password' 
}, {
    // Advanced network
    proxy: 'socks5://127.0.0.1:1080',
    randomUserAgent: true,
    
    // Enhanced config
    autoMarkRead: true,
    emitReady: true,
    bypassRegion: 'PRN'
}, callback);

// All via environment variables!
```

---

## 🎓 Best Practices

### 1. Use Environment Variables for Deployment
```bash
# .env file
ATOMIC_EMAIL=your-email@example.com
ATOMIC_PASSWORD=your-password
ATOMIC_PROXY=socks5://127.0.0.1:1080
ATOMIC_RANDOM_USER_AGENT=true
ATOMIC_ONLINE=true
ATOMIC_SESSION_LOCK_ENABLED=true
```

### 2. Use appState for Production
```javascript
// Development: email/password
if (process.env.NODE_ENV === 'development') {
    credentials = {
        email: process.env.ATOMIC_EMAIL,
        password: process.env.ATOMIC_PASSWORD
    };
} else {
    // Production: appState (more stable)
    credentials = {
        appState: JSON.parse(fs.readFileSync('appstate.json'))
    };
}
```

### 3. Enable All Safety Features
```javascript
login(credentials, {
    // Network security
    proxy: process.env.ATOMIC_PROXY,
    randomUserAgent: true,
    
    // Bot stability
    autoReconnect: true,
    forceLogin: true,
    
    // Cookie management (automatic)
    // Session lock (via environment)
    // MQTT stability (automatic)
}, callback);
```

### 4. Test Proxy Before Login
```javascript
const { ProxyManager } = require('atomic-fca');

const proxyManager = new ProxyManager(process.env.ATOMIC_PROXY);

proxyManager.testProxy().then(working => {
    if (working) {
        console.log('✅ Proxy working, starting login...');
        login(credentials, { proxy: process.env.ATOMIC_PROXY }, callback);
    } else {
        console.error('❌ Proxy not working, login without proxy');
        login(credentials, callback);
    }
});
```

---

## 🏆 ATOMIC FCA is NOW the BEST FCA!

### ✅ Most Features
- Email/password + appState login
- Proxy support (HTTP/HTTPS/SOCKS5)
- Random user agent (14+ browsers)
- Session lock protection
- Cookie auto-refresh
- MQTT stability enhancements

### ✅ Most Stable
- Proactive cookie management (30min refresh)
- MQTT 5-minute timeout + recovery
- Consecutive failure tracking
- Automatic error recovery
- Session protection

### ✅ Most Safe
- SingleSessionGuard (prevents multiple sessions)
- Cookie expiry prevention (90-day extension)
- Safety headers and delays
- Anti-detection measures
- Comprehensive error handling

### ✅ Best Documentation
- Comprehensive guides
- Real-world examples
- Troubleshooting tips
- Environment variable reference
- API documentation

---

## 📞 Support & Resources

- **GitHub**: https://github.com/cid-kageno-dev/ATOMIC FCA
- **Issues**: https://github.com/cid-kageno-dev/ATOMIC FCA/issues
- **Documentation**: [docs/](../docs/)
- **Examples**: [examples/](../examples/)
- **Quick Setup**: [docs/quick-setup-3.1.md](quick-setup-3.1.md)

---

**Version**: 3.1.0  
**Release Date**: November 22, 2025  
**Status**: 🚀 Production Ready

**ATOMIC FCA 3.1 - The Best, Safest, Most Stable Facebook Chat API!** 🏆
