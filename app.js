// MetaWorld - Main Application
// Handles game logic, economy, and user interactions

class MetaWorld {
    constructor() {
        this.worldEngine = new WorldEngine();
        this.user = {
            id: 'user_' + Date.now(),
            name: 'Virtual You',
            balance: 1000000,
            level: 1,
            experience: 0,
            profession: null,
            ownedProperties: [],
            totalEarnings: 0,
            commissionEarned: 0,
            transactions: []
        };
        this.currentTransaction = null;
        this.commissionRate = 0.05; // 5% commission for real estate agents
    }

    async init() {
        console.log('Initializing MetaWorld...');
        
        // Initialize 3D world
        this.worldEngine.init();

        // Setup UI
        this.setupUI();
        this.updateUI();

        // Load properties into market
        this.loadMarketProperties();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize social features
        if (typeof initSocial !== 'undefined') {
            initSocial(this);
        }

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            this.showNotification('Welcome to MetaWorld! Your new virtual life begins now.', 'success');
            this.showNotification('💡 Tip: Become a Real Estate Agent to earn 5% commission on every sale!', 'info');
        }, 2000);
    }

    setupUI() {
        document.getElementById('username').textContent = this.user.name;
    }

    setupEventListeners() {
        window.addEventListener('propertySelected', (e) => {
            this.handlePropertySelection(e.detail);
        });
    }

    loadMarketProperties() {
        const properties = this.worldEngine.getProperties();
        const listContainer = document.getElementById('properties-list');
        listContainer.innerHTML = '';

        // Show only properties that are not owned
        const availableProperties = properties.filter(p => !p.owner);

        availableProperties.forEach(property => {
            const card = this.createPropertyCard(property);
            listContainer.appendChild(card);
        });
    }

    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <h3>${property.name}</h3>
            <div class="price">$${property.price.toLocaleString()}</div>
            <div class="details">
                📍 ${property.location}<br>
                ${property.features.slice(0, 3).join(' • ')}
            </div>
            ${property.owner ? 
                `<button disabled>Owned by ${property.owner === this.user.id ? 'You' : 'Someone'}</button>` :
                `<button onclick="app.initiateTransaction('${property.id}')">
                    ${this.user.profession === 'realtor' ? 'Show Property' : 'Buy Property'}
                </button>`
            }
        `;

        card.addEventListener('click', () => {
            this.worldEngine.selectProperty(property);
        });

        return card;
    }

    handlePropertySelection(property) {
        this.showNotification(`Selected: ${property.name} - $${property.price.toLocaleString()}`, 'info');
    }

    initiateTransaction(propertyId) {
        const property = this.worldEngine.getProperties().find(p => p.id === propertyId);
        if (!property) return;

        if (property.owner) {
            this.showNotification('This property is already owned!', 'warning');
            return;
        }

        if (this.user.balance < property.price) {
            this.showNotification('Insufficient funds! You need more money.', 'warning');
            return;
        }

        this.currentTransaction = {
            property: property,
            buyer: this.user.id,
            price: property.price,
            commission: 0
        };

        // Calculate commission if user is a realtor
        if (this.user.profession === 'realtor') {
            this.currentTransaction.commission = Math.floor(property.price * this.commissionRate);
        }

        this.showTransactionModal();
    }

    showTransactionModal() {
        const modal = document.getElementById('transaction-modal');
        const details = document.getElementById('transaction-details');
        const trans = this.currentTransaction;

        let commissionText = '';
        if (trans.commission > 0) {
            commissionText = `
                <div class="stat-row">
                    <span class="label">Your Commission (5%)</span>
                    <span class="value" style="color: #4ade80;">+$${trans.commission.toLocaleString()}</span>
                </div>
            `;
        }

        details.innerHTML = `
            <div style="margin: 20px 0;">
                <h3 style="color: #667eea; margin-bottom: 15px;">${trans.property.name}</h3>
                <div class="stat-row">
                    <span class="label">Property Price</span>
                    <span class="value">$${trans.price.toLocaleString()}</span>
                </div>
                ${commissionText}
                <div class="stat-row" style="border-top: 2px solid #667eea; margin-top: 10px; padding-top: 10px;">
                    <span class="label">Total Cost</span>
                    <span class="value" style="font-size: 20px; color: #f59e0b;">
                        $${(trans.price - trans.commission).toLocaleString()}
                    </span>
                </div>
                <div class="stat-row">
                    <span class="label">Your Balance After</span>
                    <span class="value">$${(this.user.balance - trans.price + trans.commission).toLocaleString()}</span>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; font-size: 13px; line-height: 1.6;">
                    <strong>Features:</strong><br>
                    ${trans.property.features.map(f => `• ${f}`).join('<br>')}
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    confirmTransaction() {
        if (!this.currentTransaction) return;

        const trans = this.currentTransaction;
        const netCost = trans.price - trans.commission;

        if (this.user.balance < netCost) {
            this.showNotification('Insufficient funds!', 'warning');
            this.closeModal();
            return;
        }

        // Process transaction
        this.user.balance -= netCost;
        
        if (trans.commission > 0) {
            this.user.commissionEarned += trans.commission;
            this.user.totalEarnings += trans.commission;
        }

        // Transfer ownership
        trans.property.owner = this.user.id;
        this.user.ownedProperties.push(trans.property.id);

        // Update world
        this.worldEngine.updatePropertyOwner(trans.property.id, this.user.id);

        // Add to transaction history
        this.user.transactions.push({
            date: new Date(),
            type: 'purchase',
            property: trans.property.name,
            amount: trans.price,
            commission: trans.commission
        });

        // Add experience
        this.addExperience(Math.floor(trans.price / 10000));

        // Update UI
        this.updateUI();
        this.loadMarketProperties();
        this.updateOwnedProperties();

        // Show success notification
        let message = `Successfully purchased ${trans.property.name}!`;
        if (trans.commission > 0) {
            message += ` Earned $${trans.commission.toLocaleString()} commission!`;
        }
        this.showNotification(message, 'success');

        this.closeModal();
        this.currentTransaction = null;
    }

    addExperience(exp) {
        this.user.experience += exp;
        const expForNextLevel = this.user.level * 1000;
        
        if (this.user.experience >= expForNextLevel) {
            this.user.level++;
            this.user.experience = 0;
            this.showNotification(`🎉 Level Up! You are now Level ${this.user.level}!`, 'success');
            
            // Level up bonus
            const bonus = this.user.level * 50000;
            this.user.balance += bonus;
            this.showNotification(`Received $${bonus.toLocaleString()} level up bonus!`, 'success');
        }
    }

    updateOwnedProperties() {
        const container = document.getElementById('owned-properties');
        
        if (this.user.ownedProperties.length === 0) {
            container.innerHTML = '<p style="color: #888; font-size: 14px;">You don\'t own any properties yet.</p>';
            return;
        }

        container.innerHTML = '';
        this.user.ownedProperties.forEach(propId => {
            const property = this.worldEngine.getProperties().find(p => p.id === propId);
            if (property) {
                const card = document.createElement('div');
                card.className = 'property-card';
                card.style.background = 'rgba(74, 222, 128, 0.1)';
                card.style.borderColor = '#4ade80';
                card.innerHTML = `
                    <h3>${property.name}</h3>
                    <div class="price">$${property.price.toLocaleString()}</div>
                    <div class="details">
                        📍 ${property.location}<br>
                        <span style="color: #4ade80;">✓ Owned</span>
                    </div>
                `;
                card.addEventListener('click', () => {
                    this.worldEngine.selectProperty(property);
                });
                container.appendChild(card);
            }
        });
    }

    changeProfession(profession) {
        const professionNames = {
            'realtor': 'Real Estate Agent',
            'architect': 'Architect',
            'developer': 'Property Developer',
            'investor': 'Professional Investor',
            'designer': 'Interior Designer',
            'banker': 'Virtual Banker'
        };

        if (profession && professionNames[profession]) {
            this.user.profession = profession;
            this.showNotification(`You are now a ${professionNames[profession]}!`, 'success');
            
            // Give profession-specific bonuses
            if (profession === 'realtor') {
                this.showNotification('You now earn 5% commission on all property sales!', 'info');
            }
            
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('balance').textContent = `$${this.user.balance.toLocaleString()}`;
        document.getElementById('level').textContent = `Level ${this.user.level}`;
        
        const professionNames = {
            'realtor': 'Real Estate Agent',
            'architect': 'Architect',
            'developer': 'Property Developer',
            'investor': 'Professional Investor',
            'designer': 'Interior Designer',
            'banker': 'Virtual Banker'
        };
        
        document.getElementById('profession').textContent = 
            this.user.profession ? professionNames[this.user.profession] : 'None';

        document.getElementById('owned-count').textContent = this.user.ownedProperties.length;
        
        const investmentValue = this.user.ownedProperties.reduce((sum, propId) => {
            const prop = this.worldEngine.getProperties().find(p => p.id === propId);
            return sum + (prop ? prop.price : 0);
        }, 0);
        
        document.getElementById('investment-value').textContent = `$${investmentValue.toLocaleString()}`;
        document.getElementById('total-earnings').textContent = `$${this.user.totalEarnings.toLocaleString()}`;
        document.getElementById('commission-earned').textContent = `$${this.user.commissionEarned.toLocaleString()}`;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 4000);
    }

    closeModal() {
        document.getElementById('transaction-modal').classList.remove('active');
    }
}

// Global functions for HTML event handlers
function changeProfession(profession) {
    app.changeProfession(profession);
}

function confirmTransaction() {
    app.confirmTransaction();
}

function closeModal() {
    app.closeModal();
}

// Initialize the application
const app = new MetaWorld();
window.app = app;

// Start the application when page loads
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
