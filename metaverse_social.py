"""
METAVERSE SOCIAL SYSTEMS
Social interactions, relationships, communities, and events
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set
from datetime import datetime, timedelta
from enum import Enum
import uuid


class RelationshipType(Enum):
    FRIEND = "friend"
    BUSINESS_PARTNER = "business_partner"
    MENTOR = "mentor"
    MENTEE = "mentee"
    RIVAL = "rival"
    ACQUAINTANCE = "acquaintance"


class MessageType(Enum):
    TEXT = "text"
    VOICE = "voice"
    VIDEO = "video"
    PROPERTY_SHARE = "property_share"
    MEETING_INVITE = "meeting_invite"


class EventType(Enum):
    AUCTION = "auction"
    OPEN_HOUSE = "open_house"
    NETWORKING = "networking"
    CONCERT = "concert"
    CONFERENCE = "conference"
    PARTY = "party"
    WORKSHOP = "workshop"


@dataclass
class Message:
    """Private message between users"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str = ""
    recipient_id: str = ""
    message_type: MessageType = MessageType.TEXT
    content: str = ""
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    read: bool = False
    metadata: Dict = field(default_factory=dict)


@dataclass
class Relationship:
    """Relationship between two users"""
    user1_id: str
    user2_id: str
    relationship_type: RelationshipType = RelationshipType.ACQUAINTANCE
    strength: float = 50.0  # 0-100
    established_date: str = field(default_factory=lambda: datetime.now().isoformat())
    interactions: int = 0
    
    def strengthen(self, amount: float = 5.0):
        """Increase relationship strength"""
        self.strength = min(100.0, self.strength + amount)
        self.interactions += 1
    
    def weaken(self, amount: float = 5.0):
        """Decrease relationship strength"""
        self.strength = max(0.0, self.strength - amount)


@dataclass
class Community:
    """User-created community/group"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    founder_id: str = ""
    members: Set[str] = field(default_factory=set)
    moderators: Set[str] = field(default_factory=set)
    created_date: str = field(default_factory=lambda: datetime.now().isoformat())
    member_count: int = 0
    community_type: str = "general"  # general, professional, hobby, business
    tags: List[str] = field(default_factory=list)
    
    def add_member(self, user_id: str):
        """Add member to community"""
        self.members.add(user_id)
        self.member_count = len(self.members)
    
    def remove_member(self, user_id: str):
        """Remove member from community"""
        if user_id in self.members:
            self.members.remove(user_id)
            self.member_count = len(self.members)


@dataclass
class Event:
    """Virtual event in the metaverse"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    organizer_id: str = ""
    event_type: EventType = EventType.NETWORKING
    start_time: datetime = field(default_factory=datetime.now)
    end_time: datetime = field(default_factory=lambda: datetime.now() + timedelta(hours=2))
    location_id: Optional[str] = None  # Property ID
    attendees: Set[str] = field(default_factory=set)
    max_attendees: int = 100
    is_public: bool = True
    entry_fee: float = 0.0
    rewards: List[str] = field(default_factory=list)
    
    def register_attendee(self, user_id: str) -> bool:
        """Register user for event"""
        if len(self.attendees) >= self.max_attendees:
            return False
        self.attendees.add(user_id)
        return True


@dataclass
class Achievement:
    """User achievement"""
    id: str
    name: str
    description: str
    icon: str
    points: int
    rarity: str = "common"  # common, rare, epic, legendary
    
    
@dataclass
class SocialProfile:
    """Extended social profile for users"""
    user_id: str
    bio: str = ""
    interests: List[str] = field(default_factory=list)
    looking_for: List[str] = field(default_factory=list)  # e.g., "investment opportunities", "business partners"
    social_links: Dict[str, str] = field(default_factory=dict)
    preferred_contact: str = "message"
    privacy_settings: Dict[str, bool] = field(default_factory=lambda: {
        "show_online_status": True,
        "show_properties": True,
        "show_wealth": False,
        "allow_friend_requests": True
    })
    online_status: str = "online"  # online, away, busy, offline
    last_seen: str = field(default_factory=lambda: datetime.now().isoformat())


class SocialSystem:
    """Manages all social interactions"""
    
    def __init__(self):
        self.relationships: Dict[str, Relationship] = {}
        self.messages: Dict[str, Message] = {}
        self.communities: Dict[str, Community] = {}
        self.events: Dict[str, Event] = {}
        self.social_profiles: Dict[str, SocialProfile] = {}
        self.achievements_catalog: Dict[str, Achievement] = {}
        
        self._initialize_achievements()
    
    def _initialize_achievements(self):
        """Create achievement catalog"""
        achievements = [
            Achievement("first_sale", "First Sale", "Complete your first property sale", "🏆", 100, "common"),
            Achievement("millionaire", "Millionaire", "Accumulate $1,000,000 in wealth", "💰", 500, "rare"),
            Achievement("top_agent", "Top Agent", "Become a level 5 real estate agent", "⭐", 1000, "epic"),
            Achievement("property_mogul", "Property Mogul", "Own 10 properties", "🏰", 750, "rare"),
            Achievement("social_butterfly", "Social Butterfly", "Make 50 friends", "🦋", 300, "common"),
            Achievement("community_leader", "Community Leader", "Found a community with 100+ members", "👥", 800, "epic"),
            Achievement("event_organizer", "Event Organizer", "Host 10 successful events", "🎉", 400, "rare"),
            Achievement("networking_pro", "Networking Pro", "Attend 25 events", "🤝", 350, "rare"),
            Achievement("luxury_lifestyle", "Luxury Lifestyle", "Own a penthouse and luxury villa", "✨", 900, "epic"),
            Achievement("market_master", "Market Master", "Complete 100 transactions", "📈", 1200, "legendary"),
        ]
        
        for achievement in achievements:
            self.achievements_catalog[achievement.id] = achievement
    
    def create_social_profile(self, user_id: str) -> SocialProfile:
        """Create social profile for user"""
        profile = SocialProfile(user_id=user_id)
        self.social_profiles[user_id] = profile
        return profile
    
    def update_profile(self, user_id: str, **kwargs) -> Optional[SocialProfile]:
        """Update user's social profile"""
        if user_id not in self.social_profiles:
            self.create_social_profile(user_id)
        
        profile = self.social_profiles[user_id]
        
        for key, value in kwargs.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        return profile
    
    def send_message(self, sender_id: str, recipient_id: str, content: str, 
                    message_type: MessageType = MessageType.TEXT,
                    metadata: Optional[Dict] = None) -> Message:
        """Send message between users"""
        message = Message(
            sender_id=sender_id,
            recipient_id=recipient_id,
            message_type=message_type,
            content=content,
            metadata=metadata or {}
        )
        
        self.messages[message.id] = message
        
        # Strengthen relationship
        rel_key = self._get_relationship_key(sender_id, recipient_id)
        if rel_key in self.relationships:
            self.relationships[rel_key].strengthen(1.0)
        
        return message
    
    def get_messages(self, user_id: str, unread_only: bool = False) -> List[Message]:
        """Get messages for a user"""
        messages = []
        for msg in self.messages.values():
            if msg.recipient_id == user_id:
                if unread_only and msg.read:
                    continue
                messages.append(msg)
        
        messages.sort(key=lambda m: m.timestamp, reverse=True)
        return messages
    
    def _get_relationship_key(self, user1_id: str, user2_id: str) -> str:
        """Get consistent relationship key"""
        return f"{min(user1_id, user2_id)}:{max(user1_id, user2_id)}"
    
    def create_relationship(self, user1_id: str, user2_id: str, 
                          rel_type: RelationshipType = RelationshipType.FRIEND) -> Relationship:
        """Create relationship between users"""
        rel_key = self._get_relationship_key(user1_id, user2_id)
        
        if rel_key in self.relationships:
            return self.relationships[rel_key]
        
        relationship = Relationship(
            user1_id=user1_id,
            user2_id=user2_id,
            relationship_type=rel_type
        )
        
        self.relationships[rel_key] = relationship
        return relationship
    
    def get_relationships(self, user_id: str, 
                         rel_type: Optional[RelationshipType] = None) -> List[Relationship]:
        """Get user's relationships"""
        relationships = []
        
        for rel in self.relationships.values():
            if user_id in (rel.user1_id, rel.user2_id):
                if rel_type is None or rel.relationship_type == rel_type:
                    relationships.append(rel)
        
        return relationships
    
    def create_community(self, name: str, description: str, founder_id: str,
                        community_type: str = "general") -> Community:
        """Create a new community"""
        community = Community(
            name=name,
            description=description,
            founder_id=founder_id,
            community_type=community_type
        )
        
        community.add_member(founder_id)
        community.moderators.add(founder_id)
        
        self.communities[community.id] = community
        return community
    
    def join_community(self, community_id: str, user_id: str) -> bool:
        """Join a community"""
        if community_id not in self.communities:
            return False
        
        community = self.communities[community_id]
        community.add_member(user_id)
        return True
    
    def get_user_communities(self, user_id: str) -> List[Community]:
        """Get communities user is member of"""
        communities = []
        for community in self.communities.values():
            if user_id in community.members:
                communities.append(community)
        return communities
    
    def create_event(self, name: str, description: str, organizer_id: str,
                    event_type: EventType, start_time: datetime,
                    location_id: Optional[str] = None,
                    max_attendees: int = 100,
                    entry_fee: float = 0.0) -> Event:
        """Create a new event"""
        event = Event(
            name=name,
            description=description,
            organizer_id=organizer_id,
            event_type=event_type,
            start_time=start_time,
            location_id=location_id,
            max_attendees=max_attendees,
            entry_fee=entry_fee
        )
        
        event.register_attendee(organizer_id)
        self.events[event.id] = event
        return event
    
    def register_for_event(self, event_id: str, user_id: str) -> bool:
        """Register user for an event"""
        if event_id not in self.events:
            return False
        
        event = self.events[event_id]
        return event.register_attendee(user_id)
    
    def get_upcoming_events(self, limit: int = 10) -> List[Event]:
        """Get upcoming public events"""
        now = datetime.now()
        upcoming = [
            event for event in self.events.values()
            if event.is_public and event.start_time > now
        ]
        
        upcoming.sort(key=lambda e: e.start_time)
        return upcoming[:limit]
    
    def award_achievement(self, user_id: str, achievement_id: str) -> Optional[Achievement]:
        """Award achievement to user"""
        if achievement_id in self.achievements_catalog:
            return self.achievements_catalog[achievement_id]
        return None
    
    def get_friend_recommendations(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get friend recommendations based on interests and connections"""
        recommendations = []
        
        if user_id not in self.social_profiles:
            return recommendations
        
        user_profile = self.social_profiles[user_id]
        user_interests = set(user_profile.interests)
        
        # Get user's existing friends
        existing_friends = set()
        for rel in self.get_relationships(user_id, RelationshipType.FRIEND):
            other_id = rel.user2_id if rel.user1_id == user_id else rel.user1_id
            existing_friends.add(other_id)
        
        # Find users with similar interests
        for other_id, other_profile in self.social_profiles.items():
            if other_id == user_id or other_id in existing_friends:
                continue
            
            other_interests = set(other_profile.interests)
            common_interests = user_interests & other_interests
            
            if len(common_interests) > 0:
                recommendations.append({
                    'user_id': other_id,
                    'common_interests': list(common_interests),
                    'match_score': len(common_interests) / max(len(user_interests), 1)
                })
        
        # Sort by match score
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return recommendations[:limit]


# ============================================================================
# AI NPC SYSTEM
# ============================================================================

@dataclass
class NPC:
    """Non-player character with AI behavior"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    personality: str = "friendly"  # friendly, professional, quirky, serious
    occupation: str = "resident"
    wealth_level: str = "middle"  # low, middle, high, ultra_high
    interests: List[str] = field(default_factory=list)
    dialogue_tree: Dict = field(default_factory=dict)
    properties_owned: List[str] = field(default_factory=list)
    property_preferences: Dict = field(default_factory=dict)
    
    def generate_dialogue(self, context: str = "greeting") -> str:
        """Generate contextual dialogue"""
        dialogues = {
            "greeting": [
                f"Hello! I'm {self.name}. Welcome to the metaverse!",
                f"Hi there! Nice to see you in the neighborhood.",
                f"Greetings! I'm {self.name}, a {self.occupation}."
            ],
            "property_inquiry": [
                "I'm looking for a nice property. What do you have available?",
                "I heard you're a real estate agent. I might be interested in buying.",
                "Do you have any properties in the downtown area?"
            ],
            "small_talk": [
                "Beautiful day in the metaverse, isn't it?",
                "Have you been to the new event at the plaza?",
                "The market seems to be doing well lately."
            ]
        }
        
        import random
        options = dialogues.get(context, dialogues["greeting"])
        return random.choice(options)


class NPCSystem:
    """Manages AI NPCs in the metaverse"""
    
    def __init__(self):
        self.npcs: Dict[str, NPC] = {}
        self._initialize_npcs()
    
    def _initialize_npcs(self):
        """Create initial NPCs"""
        npc_templates = [
            ("Sarah Chen", "friendly", "investor", "high", ["real estate", "art", "technology"]),
            ("Marcus Johnson", "professional", "business_owner", "ultra_high", ["luxury", "yachts", "golf"]),
            ("Emma Rodriguez", "quirky", "artist", "middle", ["art", "music", "nature"]),
            ("Dr. James Wilson", "serious", "scientist", "middle", ["technology", "research", "education"]),
            ("Isabella Rossi", "friendly", "restaurateur", "middle", ["food", "hospitality", "community"]),
            ("David Park", "professional", "architect", "high", ["design", "architecture", "sustainability"]),
            ("Olivia Taylor", "friendly", "teacher", "middle", ["education", "books", "community"]),
            ("Michael Chen", "professional", "developer", "ultra_high", ["real estate", "investment", "technology"]),
        ]
        
        for name, personality, occupation, wealth, interests in npc_templates:
            npc = NPC(
                name=name,
                personality=personality,
                occupation=occupation,
                wealth_level=wealth,
                interests=interests
            )
            self.npcs[npc.id] = npc
    
    def get_npc(self, npc_id: str) -> Optional[NPC]:
        """Get NPC by ID"""
        return self.npcs.get(npc_id)
    
    def get_all_npcs(self) -> List[NPC]:
        """Get all NPCs"""
        return list(self.npcs.values())
    
    def npc_interest_in_property(self, npc_id: str, property_data: Dict) -> float:
        """Calculate NPC's interest level in a property (0-1)"""
        if npc_id not in self.npcs:
            return 0.0
        
        npc = self.npcs[npc_id]
        interest = 0.5  # Base interest
        
        # Wealth matching
        price = property_data.get('price', 0)
        if npc.wealth_level == "ultra_high" and price > 500000:
            interest += 0.3
        elif npc.wealth_level == "high" and 100000 < price < 500000:
            interest += 0.2
        elif npc.wealth_level == "middle" and price < 150000:
            interest += 0.2
        
        # Random factor
        import random
        interest += random.uniform(-0.1, 0.1)
        
        return max(0.0, min(1.0, interest))


if __name__ == "__main__":
    print("🌐 METAVERSE SOCIAL SYSTEMS INITIALIZED")
    
    # Demo
    social = SocialSystem()
    npc_system = NPCSystem()
    
    print(f"\n✅ {len(social.achievements_catalog)} achievements available")
    print(f"✅ {len(npc_system.npcs)} NPCs generated")
    
    print("\n👥 Sample NPCs:")
    for npc in list(npc_system.npcs.values())[:3]:
        print(f"  • {npc.name} - {npc.occupation.replace('_', ' ').title()} ({npc.personality})")
        print(f"    Interests: {', '.join(npc.interests)}")
        print(f"    Says: '{npc.generate_dialogue()}'")
