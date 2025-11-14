"""
METAVERSE CORE ENGINE
A hyper-realistic virtual world where you can be anything you want.
Built with advanced simulation, economics, and social systems.
"""

import json
import uuid
import time
import random
import math
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Tuple
from collections import defaultdict


# ============================================================================
# CORE ENUMS AND CONSTANTS
# ============================================================================

class PropertyType(Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    LUXURY = "luxury"
    BEACHFRONT = "beachfront"
    PENTHOUSE = "penthouse"
    OFFICE = "office"
    RETAIL = "retail"
    LAND = "land"
    MANSION = "mansion"


class ZoneType(Enum):
    DOWNTOWN = "downtown"
    SUBURBAN = "suburban"
    INDUSTRIAL = "industrial"
    RESORT = "resort"
    BUSINESS = "business"
    NATURE = "nature"


class WeatherType(Enum):
    SUNNY = "sunny"
    CLOUDY = "cloudy"
    RAINY = "rainy"
    STORMY = "stormy"
    SNOWY = "snowy"
    FOGGY = "foggy"


class ProfessionType(Enum):
    REAL_ESTATE_AGENT = "real_estate_agent"
    ARCHITECT = "architect"
    DEVELOPER = "developer"
    INVESTOR = "investor"
    BUSINESS_OWNER = "business_owner"
    ARTIST = "artist"
    ENTERTAINER = "entertainer"
    TEACHER = "teacher"
    SCIENTIST = "scientist"
    EXPLORER = "explorer"


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class Vector3:
    """3D position in the metaverse"""
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    
    def distance_to(self, other: 'Vector3') -> float:
        return math.sqrt(
            (self.x - other.x)**2 + 
            (self.y - other.y)**2 + 
            (self.z - other.z)**2
        )


@dataclass
class Avatar:
    """User's virtual representation"""
    user_id: str
    name: str
    appearance: Dict = field(default_factory=dict)
    position: Vector3 = field(default_factory=Vector3)
    level: int = 1
    experience: int = 0
    reputation: float = 100.0
    skills: Dict[str, int] = field(default_factory=dict)
    inventory: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        if not self.appearance:
            self.appearance = {
                "height": 1.75,
                "body_type": "athletic",
                "style": "professional",
                "customizations": []
            }


@dataclass
class User:
    """User account in the metaverse"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    username: str = ""
    avatar: Optional[Avatar] = None
    wallet_balance: float = 10000.0  # Starting currency
    professions: List[ProfessionType] = field(default_factory=list)
    owned_properties: List[str] = field(default_factory=list)
    achievements: List[str] = field(default_factory=list)
    joined_date: str = field(default_factory=lambda: datetime.now().isoformat())
    last_active: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def __post_init__(self):
        if self.avatar is None:
            self.avatar = Avatar(
                user_id=self.id,
                name=self.username
            )


@dataclass
class Property:
    """Virtual real estate property"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    property_type: PropertyType = PropertyType.RESIDENTIAL
    zone: ZoneType = ZoneType.SUBURBAN
    position: Vector3 = field(default_factory=Vector3)
    size: float = 100.0  # Square meters
    price: float = 50000.0
    owner_id: Optional[str] = None
    for_sale: bool = True
    features: List[str] = field(default_factory=list)
    quality_rating: float = 7.5
    appreciation_rate: float = 1.02  # 2% annual appreciation
    last_transaction_date: Optional[str] = None
    transaction_history: List[Dict] = field(default_factory=list)
    
    def calculate_value(self, market_multiplier: float = 1.0) -> float:
        """Calculate current market value"""
        base_value = self.price
        quality_bonus = (self.quality_rating / 10) * 1.2
        zone_multiplier = {
            ZoneType.DOWNTOWN: 2.0,
            ZoneType.BUSINESS: 1.8,
            ZoneType.RESORT: 1.6,
            ZoneType.SUBURBAN: 1.0,
            ZoneType.NATURE: 1.3,
            ZoneType.INDUSTRIAL: 0.8
        }.get(self.zone, 1.0)
        
        return base_value * quality_bonus * zone_multiplier * market_multiplier


@dataclass
class Transaction:
    """Real estate transaction"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    property_id: str = ""
    seller_id: Optional[str] = None
    buyer_id: str = ""
    agent_id: Optional[str] = None
    price: float = 0.0
    commission_rate: float = 0.05  # 5% commission
    commission_amount: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    status: str = "pending"  # pending, completed, failed
    
    def calculate_commission(self) -> float:
        self.commission_amount = self.price * self.commission_rate
        return self.commission_amount


@dataclass
class RealEstateAgent:
    """Real estate agent profession data"""
    user_id: str
    license_level: int = 1
    total_sales: int = 0
    total_volume: float = 0.0
    total_commissions: float = 0.0
    active_listings: List[str] = field(default_factory=list)
    commission_rate: float = 0.05  # 5% base rate
    reputation: float = 100.0
    specializations: List[PropertyType] = field(default_factory=list)
    
    def level_up(self):
        """Increase agent level based on performance"""
        if self.total_sales >= self.license_level * 10:
            self.license_level += 1
            self.commission_rate = min(0.08, 0.05 + (self.license_level * 0.005))


@dataclass
class WorldState:
    """Current state of the metaverse"""
    time: datetime = field(default_factory=datetime.now)
    day_cycle: float = 0.0  # 0-24 hours
    weather: WeatherType = WeatherType.SUNNY
    temperature: float = 22.0  # Celsius
    market_conditions: float = 1.0  # Economic multiplier
    active_users: int = 0
    total_transactions_today: int = 0


# ============================================================================
# METAVERSE ENGINE
# ============================================================================

class MetaverseEngine:
    """Main engine for the virtual world"""
    
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.properties: Dict[str, Property] = {}
        self.transactions: Dict[str, Transaction] = {}
        self.agents: Dict[str, RealEstateAgent] = {}
        self.world_state = WorldState()
        self.simulation_running = False
        
        # Initialize the world
        self._initialize_world()
    
    def _initialize_world(self):
        """Create the initial world with properties"""
        print("🌍 Initializing Metaverse...")
        
        # Create diverse zones
        zones = [
            (ZoneType.DOWNTOWN, Vector3(0, 0, 0), 50),
            (ZoneType.SUBURBAN, Vector3(100, 0, 0), 100),
            (ZoneType.RESORT, Vector3(-100, 0, 100), 30),
            (ZoneType.BUSINESS, Vector3(50, 0, -50), 40),
            (ZoneType.NATURE, Vector3(-100, 0, -100), 60),
        ]
        
        property_templates = [
            (PropertyType.RESIDENTIAL, 75000, 100, 7.5, []),
            (PropertyType.COMMERCIAL, 250000, 300, 8.0, ["parking", "elevator"]),
            (PropertyType.LUXURY, 500000, 250, 9.5, ["pool", "gym", "concierge"]),
            (PropertyType.BEACHFRONT, 750000, 200, 9.0, ["ocean_view", "private_beach"]),
            (PropertyType.PENTHOUSE, 1000000, 300, 9.8, ["panoramic_view", "terrace", "luxury_finishes"]),
            (PropertyType.OFFICE, 350000, 400, 8.5, ["parking", "conference_rooms"]),
            (PropertyType.RETAIL, 200000, 150, 7.8, ["street_facing", "storage"]),
            (PropertyType.LAND, 30000, 500, 7.0, ["undeveloped"]),
        ]
        
        # Generate properties
        for zone, center_pos, count in zones:
            for i in range(count):
                prop_type, base_price, size, quality, features = random.choice(property_templates)
                
                # Random position within zone
                pos = Vector3(
                    center_pos.x + random.uniform(-50, 50),
                    random.uniform(0, 100),
                    center_pos.z + random.uniform(-50, 50)
                )
                
                # Price variation
                price = base_price * random.uniform(0.8, 1.3)
                
                prop = Property(
                    property_type=prop_type,
                    zone=zone,
                    position=pos,
                    size=size * random.uniform(0.8, 1.2),
                    price=price,
                    quality_rating=quality + random.uniform(-0.5, 0.5),
                    features=features.copy()
                )
                
                self.properties[prop.id] = prop
        
        print(f"✅ Created {len(self.properties)} properties across {len(zones)} zones")
    
    def create_user(self, username: str, starting_profession: Optional[ProfessionType] = None) -> User:
        """Create a new user in the metaverse"""
        user = User(username=username)
        
        if starting_profession:
            user.professions.append(starting_profession)
            
            # If they want to be a real estate agent, create their agent profile
            if starting_profession == ProfessionType.REAL_ESTATE_AGENT:
                agent = RealEstateAgent(user_id=user.id)
                self.agents[user.id] = agent
                user.achievements.append("Real Estate License Acquired")
        
        self.users[user.id] = user
        print(f"👤 User '{username}' joined the metaverse!")
        
        return user
    
    def become_real_estate_agent(self, user_id: str) -> RealEstateAgent:
        """Allow a user to become a real estate agent"""
        if user_id not in self.users:
            raise ValueError("User not found")
        
        user = self.users[user_id]
        
        if ProfessionType.REAL_ESTATE_AGENT not in user.professions:
            user.professions.append(ProfessionType.REAL_ESTATE_AGENT)
        
        if user_id not in self.agents:
            agent = RealEstateAgent(user_id=user_id)
            self.agents[user_id] = agent
            user.achievements.append("Became a Real Estate Agent")
            print(f"🏢 {user.username} is now a licensed real estate agent!")
        
        return self.agents[user_id]
    
    def list_property_for_sale(self, property_id: str, agent_id: str, price: Optional[float] = None) -> bool:
        """Agent lists a property for sale"""
        if property_id not in self.properties:
            return False
        
        if agent_id not in self.agents:
            return False
        
        prop = self.properties[property_id]
        agent = self.agents[agent_id]
        
        if price:
            prop.price = price
        
        prop.for_sale = True
        if property_id not in agent.active_listings:
            agent.active_listings.append(property_id)
        
        print(f"🏠 Property listed for ${prop.price:,.2f} by Agent {self.users[agent_id].username}")
        return True
    
    def search_properties(
        self,
        property_type: Optional[PropertyType] = None,
        zone: Optional[ZoneType] = None,
        max_price: Optional[float] = None,
        min_size: Optional[float] = None,
        for_sale_only: bool = True
    ) -> List[Property]:
        """Search for properties matching criteria"""
        results = []
        
        for prop in self.properties.values():
            if for_sale_only and not prop.for_sale:
                continue
            if property_type and prop.property_type != property_type:
                continue
            if zone and prop.zone != zone:
                continue
            if max_price and prop.calculate_value(self.world_state.market_conditions) > max_price:
                continue
            if min_size and prop.size < min_size:
                continue
            
            results.append(prop)
        
        # Sort by price
        results.sort(key=lambda p: p.calculate_value(self.world_state.market_conditions))
        return results
    
    def purchase_property(
        self,
        property_id: str,
        buyer_id: str,
        agent_id: Optional[str] = None
    ) -> Optional[Transaction]:
        """Execute a property purchase"""
        if property_id not in self.properties:
            print("❌ Property not found")
            return None
        
        if buyer_id not in self.users:
            print("❌ Buyer not found")
            return None
        
        prop = self.properties[property_id]
        buyer = self.users[buyer_id]
        
        if not prop.for_sale:
            print("❌ Property not for sale")
            return None
        
        final_price = prop.calculate_value(self.world_state.market_conditions)
        
        if buyer.wallet_balance < final_price:
            print(f"❌ Insufficient funds. Need ${final_price:,.2f}, have ${buyer.wallet_balance:,.2f}")
            return None
        
        # Create transaction
        transaction = Transaction(
            property_id=property_id,
            seller_id=prop.owner_id,
            buyer_id=buyer_id,
            agent_id=agent_id,
            price=final_price
        )
        
        # Calculate commission
        commission = transaction.calculate_commission()
        
        # Execute transaction
        buyer.wallet_balance -= final_price
        
        # Pay seller if there is one
        if prop.owner_id and prop.owner_id in self.users:
            seller = self.users[prop.owner_id]
            seller.wallet_balance += (final_price - commission)
            seller.owned_properties.remove(property_id)
        
        # Pay agent commission
        if agent_id and agent_id in self.agents:
            agent = self.agents[agent_id]
            agent_user = self.users[agent_id]
            
            agent_user.wallet_balance += commission
            agent.total_commissions += commission
            agent.total_sales += 1
            agent.total_volume += final_price
            agent.reputation += 1.0
            
            if property_id in agent.active_listings:
                agent.active_listings.remove(property_id)
            
            # Level up check
            agent.level_up()
            
            print(f"💰 Agent {agent_user.username} earned ${commission:,.2f} commission!")
        
        # Transfer ownership
        prop.owner_id = buyer_id
        prop.for_sale = False
        prop.last_transaction_date = datetime.now().isoformat()
        buyer.owned_properties.append(property_id)
        
        # Record transaction
        prop.transaction_history.append(asdict(transaction))
        transaction.status = "completed"
        self.transactions[transaction.id] = transaction
        
        print(f"✅ Property purchased by {buyer.username} for ${final_price:,.2f}")
        
        return transaction
    
    def get_agent_stats(self, agent_id: str) -> Optional[Dict]:
        """Get statistics for a real estate agent"""
        if agent_id not in self.agents:
            return None
        
        agent = self.agents[agent_id]
        user = self.users[agent_id]
        
        return {
            "username": user.username,
            "license_level": agent.license_level,
            "total_sales": agent.total_sales,
            "total_volume": agent.total_volume,
            "total_commissions_earned": agent.total_commissions,
            "current_commission_rate": f"{agent.commission_rate * 100}%",
            "active_listings": len(agent.active_listings),
            "reputation": agent.reputation,
            "wallet_balance": user.wallet_balance
        }
    
    def simulate_time(self, hours: float = 1.0):
        """Advance world time and simulate effects"""
        self.world_state.time += timedelta(hours=hours)
        self.world_state.day_cycle = (self.world_state.day_cycle + hours) % 24
        
        # Weather changes
        if random.random() < 0.1:
            self.world_state.weather = random.choice(list(WeatherType))
        
        # Market fluctuations
        self.world_state.market_conditions *= random.uniform(0.98, 1.02)
        self.world_state.market_conditions = max(0.5, min(2.0, self.world_state.market_conditions))
    
    def get_world_state(self) -> Dict:
        """Get current world state"""
        return {
            "time": self.world_state.time.strftime("%Y-%m-%d %H:%M:%S"),
            "day_cycle": f"{self.world_state.day_cycle:.1f}:00",
            "weather": self.world_state.weather.value,
            "temperature": f"{self.world_state.temperature}°C",
            "market_conditions": f"{self.world_state.market_conditions:.2f}x",
            "total_users": len(self.users),
            "total_properties": len(self.properties),
            "properties_for_sale": sum(1 for p in self.properties.values() if p.for_sale),
            "total_transactions": len(self.transactions)
        }
    
    def save_state(self, filename: str = "metaverse_state.json"):
        """Save the metaverse state to a file"""
        state = {
            "users": {k: asdict(v) for k, v in self.users.items()},
            "properties": {k: asdict(v) for k, v in self.properties.items()},
            "transactions": {k: asdict(v) for k, v in self.transactions.items()},
            "agents": {k: asdict(v) for k, v in self.agents.items()},
            "world_state": asdict(self.world_state)
        }
        
        with open(filename, 'w') as f:
            json.dump(state, f, indent=2, default=str)
        
        print(f"💾 Metaverse state saved to {filename}")


# ============================================================================
# MAIN DEMO
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("🌟 WELCOME TO THE METAVERSE - BE What You Want To Be! 🌟")
    print("=" * 70)
    print()
    
    # Create the metaverse
    metaverse = MetaverseEngine()
    
    # Create yourself as a real estate agent
    print("\n--- YOUR JOURNEY BEGINS ---")
    you = metaverse.create_user("YourName", ProfessionType.REAL_ESTATE_AGENT)
    agent = metaverse.agents[you.id]
    
    print(f"\n💼 Starting balance: ${you.wallet_balance:,.2f}")
    print(f"📜 Commission rate: {agent.commission_rate * 100}%")
    
    # Create some other users
    buyer1 = metaverse.create_user("WealthyInvestor")
    buyer2 = metaverse.create_user("FirstTimeBuyer")
    buyer3 = metaverse.create_user("BusinessMogul")
    
    # Give them more money to buy properties
    buyer1.wallet_balance = 500000
    buyer2.wallet_balance = 100000
    buyer3.wallet_balance = 1500000
    
    print(f"\n🌍 World Status:")
    for key, value in metaverse.get_world_state().items():
        print(f"  {key}: {value}")
    
    # List some properties for sale
    print("\n\n--- LISTING PROPERTIES ---")
    available_properties = [p for p in metaverse.properties.values() if p.owner_id is None]
    
    # List diverse properties
    listings = []
    for prop_type in [PropertyType.RESIDENTIAL, PropertyType.LUXURY, 
                      PropertyType.COMMERCIAL, PropertyType.PENTHOUSE]:
        for prop in available_properties:
            if prop.property_type == prop_type and len(listings) < 10:
                metaverse.list_property_for_sale(prop.id, you.id)
                listings.append(prop)
    
    # Show your listings
    print(f"\n📋 Your Active Listings: {len(agent.active_listings)}")
    for i, prop_id in enumerate(agent.active_listings[:5], 1):
        prop = metaverse.properties[prop_id]
        price = prop.calculate_value(metaverse.world_state.market_conditions)
        print(f"  {i}. {prop.property_type.value.title()} in {prop.zone.value.title()}")
        print(f"     ${price:,.2f} | {prop.size:.0f}m² | Quality: {prop.quality_rating}/10")
        print(f"     Features: {', '.join(prop.features) if prop.features else 'Standard'}")
    
    # Make some sales
    print("\n\n--- MAKING SALES ---")
    
    # Sale 1: Residential
    residential_props = [p for p in listings if p.property_type == PropertyType.RESIDENTIAL]
    if residential_props:
        trans1 = metaverse.purchase_property(residential_props[0].id, buyer2.id, you.id)
    
    # Sale 2: Luxury or any high-value property
    luxury_props = [p for p in listings if p.property_type == PropertyType.LUXURY]
    if not luxury_props:
        luxury_props = sorted(listings, key=lambda p: p.calculate_value(metaverse.world_state.market_conditions), reverse=True)[:3]
    if luxury_props:
        trans2 = metaverse.purchase_property(luxury_props[0].id, buyer1.id, you.id)
    
    # Sale 3: Penthouse or any premium property
    penthouse_props = [p for p in listings if p.property_type == PropertyType.PENTHOUSE]
    if not penthouse_props:
        penthouse_props = sorted(listings, key=lambda p: p.calculate_value(metaverse.world_state.market_conditions), reverse=True)[:1]
    if penthouse_props:
        trans3 = metaverse.purchase_property(penthouse_props[0].id, buyer3.id, you.id)
    
    # Show your stats
    print("\n\n--- YOUR AGENT STATISTICS ---")
    stats = metaverse.get_agent_stats(you.id)
    for key, value in stats.items():
        print(f"  {key.replace('_', ' ').title()}: {value}")
    
    # Simulate some time passing
    print("\n\n--- TIME PASSES ---")
    for i in range(5):
        metaverse.simulate_time(hours=24)  # Advance one day
        print(f"Day {i+1}: Market conditions: {metaverse.world_state.market_conditions:.2f}x, Weather: {metaverse.world_state.weather.value}")
    
    # Search functionality
    print("\n\n--- PROPERTY SEARCH EXAMPLES ---")
    
    print("\n🔍 Luxury properties under $600,000:")
    results = metaverse.search_properties(
        property_type=PropertyType.LUXURY,
        max_price=600000
    )
    for prop in results[:3]:
        price = prop.calculate_value(metaverse.world_state.market_conditions)
        print(f"  • {prop.zone.value.title()} | ${price:,.2f} | {prop.size:.0f}m²")
    
    print("\n🔍 Commercial properties in Business district:")
    results = metaverse.search_properties(
        property_type=PropertyType.COMMERCIAL,
        zone=ZoneType.BUSINESS
    )
    for prop in results[:3]:
        price = prop.calculate_value(metaverse.world_state.market_conditions)
        print(f"  • ${price:,.2f} | {prop.size:.0f}m² | Quality: {prop.quality_rating}/10")
    
    # Save the state
    print("\n\n--- SAVING METAVERSE ---")
    metaverse.save_state()
    
    print("\n" + "=" * 70)
    print("🎉 YOUR REAL ESTATE EMPIRE AWAITS! 🎉")
    print("=" * 70)
    print(f"\n💰 Total Commissions Earned: ${agent.total_commissions:,.2f}")
    print(f"🏆 Reputation: {agent.reputation}")
    print(f"📈 License Level: {agent.license_level}")
    print(f"💵 Current Balance: ${you.wallet_balance:,.2f}")
    print("\nThe metaverse is yours to conquer! Keep selling, keep earning! 🚀")
