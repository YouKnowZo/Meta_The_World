// MetaWorld Social Features
// Handles chat, friends, and social interactions

class SocialSystem {
    constructor(app) {
        this.app = app;
        this.ws = null;
        this.connected = false;
        this.onlineUsers = [];
        this.chatMessages = [];
        this.friends = [];
        this.setupWebSocket();
        this.createSocialUI();
    }

    setupWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('Connected to MetaWorld multiplayer server');
                this.connected = true;
                this.updateConnectionStatus(true);
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
            this.ws.onclose = () => {
                console.log('Disconnected from server');
                this.connected = false;
                this.updateConnectionStatus(false);
                // Attempt reconnection after 5 seconds
                setTimeout(() => this.setupWebSocket(), 5000);
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
        }
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'welcome':
                this.userId = data.userId;
                this.sendUserUpdate();
                this.requestOnlineUsers();
                break;
                
            case 'chat':
                this.addChatMessage(data.message);
                break;
                
            case 'onlineUsers':
                this.updateOnlineUsers(data.users);
                break;
                
            case 'userUpdated':
                this.updateUserInList(data.userId, data.user);
                break;
                
            case 'userLeft':
                this.removeUserFromList(data.userId);
                break;
                
            case 'propertyPurchased':
                this.app.showNotification(
                    `Someone just purchased a property!`,
                    'info'
                );
                break;
        }
    }

    sendUserUpdate() {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'userUpdate',
                user: {
                    name: this.app.user.name,
                    level: this.app.user.level,
                    profession: this.app.user.profession,
                    properties: this.app.user.ownedProperties.length
                }
            }));
        }
    }

    requestOnlineUsers() {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'getOnlineUsers'
            }));
        }
    }

    sendChatMessage(message) {
        if (!this.connected) {
            this.app.showNotification('Not connected to server', 'warning');
            return;
        }
        
        if (this.ws) {
            this.ws.send(JSON.stringify({
                type: 'chat',
                userName: this.app.user.name,
                message: message
            }));
        }
    }

    addChatMessage(message) {
        this.chatMessages.push(message);
        
        const chatBox = document.getElementById('chat-messages');
        if (chatBox) {
            const msgElement = document.createElement('div');
            msgElement.className = 'chat-message';
            msgElement.innerHTML = `
                <div class="chat-message-header">
                    <span class="chat-user">${message.userName}</span>
                    <span class="chat-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="chat-message-content">${this.escapeHtml(message.message)}</div>
            `;
            chatBox.appendChild(msgElement);
            chatBox.scrollTop = chatBox.scrollHeight;
            
            // Limit to last 50 messages
            while (chatBox.children.length > 50) {
                chatBox.removeChild(chatBox.firstChild);
            }
        }
    }

    updateOnlineUsers(users) {
        this.onlineUsers = users;
        const usersList = document.getElementById('online-users-list');
        if (usersList) {
            usersList.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'online-user';
                userElement.innerHTML = `
                    <div class="user-avatar">👤</div>
                    <div class="user-info">
                        <div class="user-name">${user.name}</div>
                        <div class="user-details">
                            Level ${user.level} ${user.profession ? `• ${user.profession}` : ''}
                        </div>
                    </div>
                `;
                usersList.appendChild(userElement);
            });
            
            document.getElementById('online-count').textContent = users.length;
        }
    }

    updateUserInList(userId, user) {
        const index = this.onlineUsers.findIndex(u => u.id === userId);
        if (index !== -1) {
            this.onlineUsers[index] = user;
        } else {
            this.onlineUsers.push(user);
        }
        this.updateOnlineUsers(this.onlineUsers);
    }

    removeUserFromList(userId) {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== userId);
        this.updateOnlineUsers(this.onlineUsers);
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = connected ? '🟢 Online' : '🔴 Offline';
            statusElement.style.color = connected ? '#4ade80' : '#ef4444';
        }
    }

    createSocialUI() {
        const socialPanel = document.createElement('div');
        socialPanel.id = 'social-panel';
        socialPanel.className = 'hud';
        socialPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 350px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            color: #fff;
            max-height: 400px;
            display: flex;
            flex-direction: column;
        `;
        
        socialPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid rgba(102, 126, 234, 0.5);">
                <div class="panel-title" style="margin: 0;">💬 Social</div>
                <div id="connection-status" style="font-size: 12px; color: #4ade80;">🔴 Connecting...</div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button onclick="social.switchTab('chat')" id="tab-chat" class="social-tab active" style="flex: 1; padding: 8px; font-size: 12px;">
                    Chat
                </button>
                <button onclick="social.switchTab('users')" id="tab-users" class="social-tab" style="flex: 1; padding: 8px; font-size: 12px;">
                    Users (<span id="online-count">0</span>)
                </button>
            </div>
            
            <div id="chat-tab" class="social-tab-content">
                <div id="chat-messages" style="
                    height: 200px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    font-size: 13px;
                "></div>
                <div style="display: flex; gap: 10px;">
                    <input
                        id="chat-input"
                        type="text"
                        placeholder="Type a message..."
                        style="
                            flex: 1;
                            padding: 10px;
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            color: #fff;
                            font-size: 13px;
                        "
                        onkeypress="if(event.key==='Enter') social.sendMessage()"
                    />
                    <button onclick="social.sendMessage()" style="padding: 10px 20px; margin: 0; font-size: 13px;">
                        Send
                    </button>
                </div>
            </div>
            
            <div id="users-tab" class="social-tab-content" style="display: none;">
                <div id="online-users-list" style="
                    height: 250px;
                    overflow-y: auto;
                    padding: 5px;
                "></div>
            </div>
        `;
        
        document.getElementById('ui-overlay').appendChild(socialPanel);
        
        // Add CSS for chat messages
        const style = document.createElement('style');
        style.textContent = `
            .chat-message {
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                border-left: 3px solid #667eea;
            }
            
            .chat-message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 11px;
            }
            
            .chat-user {
                color: #667eea;
                font-weight: 600;
            }
            
            .chat-time {
                color: #888;
            }
            
            .chat-message-content {
                color: #fff;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .online-user {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                transition: all 0.3s;
            }
            
            .online-user:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(5px);
            }
            
            .user-avatar {
                font-size: 24px;
            }
            
            .user-info {
                flex: 1;
            }
            
            .user-name {
                font-weight: 600;
                color: #fff;
                font-size: 14px;
            }
            
            .user-details {
                font-size: 11px;
                color: #888;
                margin-top: 2px;
            }
            
            .social-tab {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .social-tab.active {
                background: linear-gradient(45deg, #667eea, #764ba2);
                border: 1px solid #667eea;
            }
        `;
        document.head.appendChild(style);
    }

    switchTab(tab) {
        document.getElementById('chat-tab').style.display = tab === 'chat' ? 'block' : 'none';
        document.getElementById('users-tab').style.display = tab === 'users' ? 'block' : 'none';
        
        document.getElementById('tab-chat').classList.toggle('active', tab === 'chat');
        document.getElementById('tab-users').classList.toggle('active', tab === 'users');
        
        if (tab === 'users') {
            this.requestOnlineUsers();
        }
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.sendChatMessage(message);
            input.value = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global function for HTML event handlers
function initSocial(app) {
    window.social = new SocialSystem(app);
}

window.SocialSystem = SocialSystem;
window.initSocial = initSocial;
