/**
 * ATOMIC FCA 3.1 - Advanced Features Demo
 * Demonstrates email/password login, proxy support, and random user agent
 */

const login = require('../index.js');
const fs = require('fs');

// Configuration
const CONFIG = {
    // Option 1: Email/Password Login (Quick testing)
    useEmailPassword: false,
    email: 'your-email@example.com',
    password: 'your-password',
    
    // Option 2: AppState Login (Production - more stable)
    useAppState: true,
    appStatePath: './appstate.json',
    
    // Network Features
    useProxy: false,
    proxy: 'socks5://127.0.0.1:1080', // or http://proxy.example.com:8080
    useRandomUserAgent: true,
    
    // Bot Options
    autoMarkRead: true,
    emitReady: true,
    online: true,
    autoReconnect: true
};

// Main function
async function main() {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║       ATOMIC FCA 3.1 - Advanced Features Demo        ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    
    // Prepare credentials
    let credentials;
    
    if (CONFIG.useEmailPassword) {
        console.log('🔐 Login Method: Email/Password');
        credentials = {
            email: CONFIG.email,
            password: CONFIG.password
        };
    } else if (CONFIG.useAppState) {
        console.log('🔐 Login Method: AppState (Cookies)');
        
        if (!fs.existsSync(CONFIG.appStatePath)) {
            console.error('❌ appstate.json not found!');
            console.error('   Please provide appstate.json or use email/password login');
            process.exit(1);
        }
        
        credentials = {
            appState: JSON.parse(fs.readFileSync(CONFIG.appStatePath, 'utf8'))
        };
    } else {
        console.error('❌ No login method configured!');
        process.exit(1);
    }
    
    // Prepare options
    const options = {
        // Network features
        randomUserAgent: CONFIG.useRandomUserAgent,
        
        // Bot configuration
        autoMarkRead: CONFIG.autoMarkRead,
        emitReady: CONFIG.emitReady,
        online: CONFIG.online,
        autoReconnect: CONFIG.autoReconnect,
        
        // Logging
        logLevel: 'info',
        
        // Listen options
        selfListen: false,
        listenEvents: true,
        updatePresence: false
    };
    
    // Add proxy if enabled
    if (CONFIG.useProxy) {
        options.proxy = CONFIG.proxy;
        console.log(`🌐 Proxy: ${CONFIG.proxy}`);
    }
    
    // Show configuration
    console.log('\n📋 Configuration:');
    console.log(`   - Random User Agent: ${CONFIG.useRandomUserAgent ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Proxy: ${CONFIG.useProxy ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Auto Mark Read: ${CONFIG.autoMarkRead ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Auto Reconnect: ${CONFIG.autoReconnect ? '✅ Enabled' : '❌ Disabled'}`);
    console.log('\n🚀 Starting login...\n');
    
    // Login
    login(credentials, options, (err, api) => {
        if (err) {
            console.error('❌ Login failed:', err.message);
            return process.exit(1);
        }
        
        console.log('✅ Login successful!');
        console.log(`✅ Logged in as: ${api.getCurrentUserID()}`);
        
        // Get user info
        api.getUserInfo(api.getCurrentUserID(), (err, user) => {
            if (!err && user) {
                const userData = user[api.getCurrentUserID()];
                console.log(`✅ Name: ${userData.name}`);
                console.log(`✅ Profile: https://www.facebook.com/${api.getCurrentUserID()}`);
            }
        });
        
        // Ready event (if emitReady is true)
        if (CONFIG.emitReady) {
            api.on('ready', () => {
                console.log('\n🎉 Bot is ready to receive messages!');
            });
        }
        
        console.log('\n📩 Listening for messages...');
        console.log('   Send a message to test the bot\n');
        
        // Listen for messages
        api.listen((err, message) => {
            if (err) {
                console.error('❌ Listen error:', err.message);
                return;
            }
            
            // Handle different message types
            switch (message.type) {
                case 'message':
                    handleMessage(api, message);
                    break;
                    
                case 'event':
                    handleEvent(api, message);
                    break;
                    
                case 'typ':
                    // Typing indicator
                    console.log(`⌨️  ${message.from} is typing...`);
                    break;
                    
                case 'read_receipt':
                    // Message read
                    console.log(`👁️  ${message.reader} read the message`);
                    break;
                    
                default:
                    console.log(`📬 Received ${message.type}:`, message);
            }
        });
    });
}

// Handle incoming messages
function handleMessage(api, message) {
    const senderID = message.senderID;
    const threadID = message.threadID;
    const body = message.body || '';
    
    console.log(`\n📩 Message from ${senderID}:`);
    console.log(`   Thread: ${threadID}`);
    console.log(`   Body: ${body}`);
    
    // Ignore messages from self
    if (senderID === api.getCurrentUserID()) {
        return;
    }
    
    // Simple command handling
    if (body.toLowerCase().startsWith('/ping')) {
        api.sendMessage('🏓 Pong!', threadID);
        console.log('   ↳ Replied: 🏓 Pong!');
    } 
    else if (body.toLowerCase().startsWith('/help')) {
        const helpMessage = `
🤖 ATOMIC FCA 3.1 Bot Commands:

/ping - Test bot response
/help - Show this help message
/info - Show bot information
/echo <text> - Echo back your message
/time - Show current time

Bot Features:
✅ Email/Password Login
✅ Proxy Support  
✅ Random User Agent
✅ Auto Cookie Refresh
✅ MQTT Stability
✅ Session Protection
        `.trim();
        
        api.sendMessage(helpMessage, threadID);
        console.log('   ↳ Sent help message');
    }
    else if (body.toLowerCase().startsWith('/info')) {
        const info = `
🤖 Bot Information:

📦 Version: ATOMIC FCA 3.1
🆔 Bot ID: ${api.getCurrentUserID()}
🌟 Features:
   - Email/Password Login
   - Proxy Support
   - Random User Agent
   - Auto Cookie Refresh (30min)
   - MQTT Stability (5min timeout)
   - Session Lock Protection
   - Comprehensive Error Handling

🏆 Most Stable FCA!
        `.trim();
        
        api.sendMessage(info, threadID);
        console.log('   ↳ Sent bot info');
    }
    else if (body.toLowerCase().startsWith('/echo ')) {
        const text = body.substring(6);
        api.sendMessage(`Echo: ${text}`, threadID);
        console.log(`   ↳ Echoed: ${text}`);
    }
    else if (body.toLowerCase().startsWith('/time')) {
        const now = new Date();
        api.sendMessage(`🕐 Current time: ${now.toLocaleString()}`, threadID);
        console.log('   ↳ Sent current time');
    }
    else {
        // Default: echo the message
        api.sendMessage(`📬 Received: "${body}"`, threadID);
        console.log('   ↳ Echoed message');
    }
}

// Handle events
function handleEvent(api, event) {
    console.log(`\n📌 Event: ${event.logMessageType}`);
    
    switch (event.logMessageType) {
        case 'log:subscribe':
            // Someone added to group
            console.log(`   👥 ${event.addedParticipants.length} user(s) added to group`);
            api.sendMessage('👋 Welcome to the group!', event.threadID);
            break;
            
        case 'log:unsubscribe':
            // Someone left or was removed
            console.log(`   👋 User left the group`);
            break;
            
        case 'log:thread-name':
            // Group name changed
            console.log(`   ✏️  Group name changed to: ${event.threadName}`);
            break;
            
        default:
            console.log(`   ℹ️  ${event.logMessageType}`);
    }
}

// Error handling
process.on('uncaughtException', (err) => {
    console.error('\n❌ Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ Unhandled Rejection:', reason);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down gracefully...');
    process.exit(0);
});

// Run
main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
