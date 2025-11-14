"""
METAVERSE REST API
Provides HTTP endpoints for interacting with the metaverse
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from metaverse_core import (
    MetaverseEngine, ProfessionType, PropertyType, ZoneType
)
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for web clients

# Global metaverse instance
metaverse = MetaverseEngine()

# Store active sessions
sessions = {}


# ============================================================================
# USER & AUTHENTICATION ENDPOINTS
# ============================================================================

@app.route('/api/user/create', methods=['POST'])
def create_user():
    """Create a new user account"""
    data = request.json
    username = data.get('username')
    profession = data.get('profession')
    
    if not username:
        return jsonify({'error': 'Username required'}), 400
    
    prof_type = None
    if profession:
        try:
            prof_type = ProfessionType[profession.upper()]
        except KeyError:
            pass
    
    user = metaverse.create_user(username, prof_type)
    
    # Create session
    session_token = user.id
    sessions[session_token] = user.id
    
    return jsonify({
        'success': True,
        'user_id': user.id,
        'username': user.username,
        'session_token': session_token,
        'wallet_balance': user.wallet_balance,
        'professions': [p.value for p in user.professions]
    })


@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    if user_id not in metaverse.users:
        return jsonify({'error': 'User not found'}), 404
    
    user = metaverse.users[user_id]
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'wallet_balance': user.wallet_balance,
        'professions': [p.value for p in user.professions],
        'owned_properties': user.owned_properties,
        'achievements': user.achievements,
        'joined_date': user.joined_date,
        'avatar': {
            'name': user.avatar.name,
            'level': user.avatar.level,
            'experience': user.avatar.experience,
            'reputation': user.avatar.reputation,
            'position': {
                'x': user.avatar.position.x,
                'y': user.avatar.position.y,
                'z': user.avatar.position.z
            }
        }
    })


# ============================================================================
# REAL ESTATE AGENT ENDPOINTS
# ============================================================================

@app.route('/api/agent/become', methods=['POST'])
def become_agent():
    """Become a real estate agent"""
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id or user_id not in metaverse.users:
        return jsonify({'error': 'Invalid user'}), 400
    
    agent = metaverse.become_real_estate_agent(user_id)
    
    return jsonify({
        'success': True,
        'license_level': agent.license_level,
        'commission_rate': agent.commission_rate,
        'message': 'Congratulations! You are now a licensed real estate agent!'
    })


@app.route('/api/agent/<agent_id>/stats', methods=['GET'])
def get_agent_stats(agent_id):
    """Get agent statistics"""
    stats = metaverse.get_agent_stats(agent_id)
    
    if not stats:
        return jsonify({'error': 'Agent not found'}), 404
    
    return jsonify(stats)


@app.route('/api/agent/<agent_id>/list', methods=['POST'])
def list_property(agent_id):
    """List a property for sale"""
    data = request.json
    property_id = data.get('property_id')
    price = data.get('price')
    
    success = metaverse.list_property_for_sale(property_id, agent_id, price)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Property listed successfully'
        })
    else:
        return jsonify({'error': 'Failed to list property'}), 400


# ============================================================================
# PROPERTY ENDPOINTS
# ============================================================================

@app.route('/api/properties/search', methods=['GET'])
def search_properties():
    """Search for properties"""
    property_type = request.args.get('type')
    zone = request.args.get('zone')
    max_price = request.args.get('max_price', type=float)
    min_size = request.args.get('min_size', type=float)
    for_sale_only = request.args.get('for_sale', 'true').lower() == 'true'
    limit = request.args.get('limit', 50, type=int)
    
    prop_type = None
    if property_type:
        try:
            prop_type = PropertyType[property_type.upper()]
        except KeyError:
            pass
    
    zone_type = None
    if zone:
        try:
            zone_type = ZoneType[zone.upper()]
        except KeyError:
            pass
    
    results = metaverse.search_properties(
        property_type=prop_type,
        zone=zone_type,
        max_price=max_price,
        min_size=min_size,
        for_sale_only=for_sale_only
    )
    
    # Limit results
    results = results[:limit]
    
    # Convert to JSON-serializable format
    properties = []
    for prop in results:
        properties.append({
            'id': prop.id,
            'type': prop.property_type.value,
            'zone': prop.zone.value,
            'position': {
                'x': prop.position.x,
                'y': prop.position.y,
                'z': prop.position.z
            },
            'size': prop.size,
            'price': prop.price,
            'current_value': prop.calculate_value(metaverse.world_state.market_conditions),
            'owner_id': prop.owner_id,
            'for_sale': prop.for_sale,
            'features': prop.features,
            'quality_rating': prop.quality_rating,
            'last_transaction_date': prop.last_transaction_date
        })
    
    return jsonify({
        'count': len(properties),
        'properties': properties
    })


@app.route('/api/properties/<property_id>', methods=['GET'])
def get_property(property_id):
    """Get detailed property information"""
    if property_id not in metaverse.properties:
        return jsonify({'error': 'Property not found'}), 404
    
    prop = metaverse.properties[property_id]
    
    return jsonify({
        'id': prop.id,
        'type': prop.property_type.value,
        'zone': prop.zone.value,
        'position': {
            'x': prop.position.x,
            'y': prop.position.y,
            'z': prop.position.z
        },
        'size': prop.size,
        'price': prop.price,
        'current_value': prop.calculate_value(metaverse.world_state.market_conditions),
        'owner_id': prop.owner_id,
        'for_sale': prop.for_sale,
        'features': prop.features,
        'quality_rating': prop.quality_rating,
        'appreciation_rate': prop.appreciation_rate,
        'last_transaction_date': prop.last_transaction_date,
        'transaction_history': prop.transaction_history
    })


@app.route('/api/properties/<property_id>/purchase', methods=['POST'])
def purchase_property(property_id):
    """Purchase a property"""
    data = request.json
    buyer_id = data.get('buyer_id')
    agent_id = data.get('agent_id')
    
    if not buyer_id or buyer_id not in metaverse.users:
        return jsonify({'error': 'Invalid buyer'}), 400
    
    transaction = metaverse.purchase_property(property_id, buyer_id, agent_id)
    
    if transaction:
        return jsonify({
            'success': True,
            'transaction_id': transaction.id,
            'price': transaction.price,
            'commission': transaction.commission_amount,
            'timestamp': transaction.timestamp
        })
    else:
        return jsonify({'error': 'Transaction failed'}), 400


# ============================================================================
# WORLD & SIMULATION ENDPOINTS
# ============================================================================

@app.route('/api/world/state', methods=['GET'])
def get_world_state():
    """Get current world state"""
    return jsonify(metaverse.get_world_state())


@app.route('/api/world/simulate', methods=['POST'])
def simulate_time():
    """Advance world time"""
    data = request.json
    hours = data.get('hours', 1.0)
    
    metaverse.simulate_time(hours)
    
    return jsonify({
        'success': True,
        'new_state': metaverse.get_world_state()
    })


@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get transaction history"""
    limit = request.args.get('limit', 50, type=int)
    
    transactions = []
    for trans in list(metaverse.transactions.values())[-limit:]:
        transactions.append({
            'id': trans.id,
            'property_id': trans.property_id,
            'seller_id': trans.seller_id,
            'buyer_id': trans.buyer_id,
            'agent_id': trans.agent_id,
            'price': trans.price,
            'commission': trans.commission_amount,
            'timestamp': trans.timestamp,
            'status': trans.status
        })
    
    return jsonify({
        'count': len(transactions),
        'transactions': transactions
    })


# ============================================================================
# STATISTICS & ANALYTICS
# ============================================================================

@app.route('/api/stats/overview', methods=['GET'])
def get_overview_stats():
    """Get overall metaverse statistics"""
    total_property_value = sum(
        prop.calculate_value(metaverse.world_state.market_conditions)
        for prop in metaverse.properties.values()
    )
    
    total_transactions_value = sum(
        trans.price
        for trans in metaverse.transactions.values()
    )
    
    total_commissions = sum(
        agent.total_commissions
        for agent in metaverse.agents.values()
    )
    
    return jsonify({
        'total_users': len(metaverse.users),
        'total_agents': len(metaverse.agents),
        'total_properties': len(metaverse.properties),
        'properties_for_sale': sum(1 for p in metaverse.properties.values() if p.for_sale),
        'total_property_value': total_property_value,
        'total_transactions': len(metaverse.transactions),
        'total_transaction_value': total_transactions_value,
        'total_commissions_paid': total_commissions,
        'market_conditions': metaverse.world_state.market_conditions,
        'active_time': metaverse.world_state.time.isoformat()
    })


@app.route('/api/leaderboard/agents', methods=['GET'])
def get_agent_leaderboard():
    """Get top performing agents"""
    agents_data = []
    
    for agent_id, agent in metaverse.agents.items():
        user = metaverse.users[agent_id]
        agents_data.append({
            'user_id': agent_id,
            'username': user.username,
            'total_sales': agent.total_sales,
            'total_volume': agent.total_volume,
            'total_commissions': agent.total_commissions,
            'license_level': agent.license_level,
            'reputation': agent.reputation
        })
    
    # Sort by total commissions
    agents_data.sort(key=lambda x: x['total_commissions'], reverse=True)
    
    return jsonify({
        'leaderboard': agents_data[:10]
    })


# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================

@app.route('/api/enums/property-types', methods=['GET'])
def get_property_types():
    """Get all property types"""
    return jsonify([pt.value for pt in PropertyType])


@app.route('/api/enums/zones', methods=['GET'])
def get_zones():
    """Get all zone types"""
    return jsonify([zt.value for zt in ZoneType])


@app.route('/api/enums/professions', methods=['GET'])
def get_professions():
    """Get all profession types"""
    return jsonify([pt.value for pt in ProfessionType])


@app.route('/api/save', methods=['POST'])
def save_metaverse():
    """Save metaverse state"""
    data = request.json
    filename = data.get('filename', 'metaverse_state.json')
    
    metaverse.save_state(filename)
    
    return jsonify({
        'success': True,
        'message': f'Metaverse saved to {filename}'
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    print("=" * 70)
    print("🌟 METAVERSE API SERVER STARTING 🌟")
    print("=" * 70)
    print("\nAPI Endpoints:")
    print("  - POST /api/user/create - Create new user")
    print("  - GET  /api/user/<id> - Get user info")
    print("  - POST /api/agent/become - Become real estate agent")
    print("  - GET  /api/agent/<id>/stats - Get agent statistics")
    print("  - POST /api/agent/<id>/list - List property for sale")
    print("  - GET  /api/properties/search - Search properties")
    print("  - POST /api/properties/<id>/purchase - Purchase property")
    print("  - GET  /api/world/state - Get world state")
    print("  - GET  /api/stats/overview - Get statistics")
    print("  - GET  /api/leaderboard/agents - Get top agents")
    print("\n" + "=" * 70)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
