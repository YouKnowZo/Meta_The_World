#!/usr/bin/env python3
"""
INTERACTIVE METAVERSE DEMO
Experience the metaverse through an interactive command-line interface
"""

import os
import sys
import time
from metaverse_core import (
    MetaverseEngine, ProfessionType, PropertyType, ZoneType
)
from metaverse_social import SocialSystem, NPCSystem, RelationshipType, EventType
from datetime import datetime, timedelta


class MetaverseDemo:
    def __init__(self):
        self.metaverse = MetaverseEngine()
        self.social = SocialSystem()
        self.npcs = NPCSystem()
        self.current_user = None
        
    def clear_screen(self):
        os.system('clear' if os.name != 'nt' else 'cls')
    
    def print_header(self, text):
        print("\n" + "=" * 70)
        print(f"  {text}")
        print("=" * 70 + "\n")
    
    def print_section(self, text):
        print(f"\n{'─' * 70}")
        print(f"  {text}")
        print('─' * 70)
    
    def animate_text(self, text, delay=0.03):
        for char in text:
            print(char, end='', flush=True)
            time.sleep(delay)
        print()
    
    def welcome_sequence(self):
        self.clear_screen()
        print("\n\n")
        self.animate_text("  🌟  W E L C O M E   T O   T H E   M E T A V E R S E  🌟", 0.05)
        time.sleep(0.5)
        print("\n")
        self.animate_text("      A world where you can be anything you want to be...", 0.04)
        time.sleep(1)
        print("\n")
    
    def create_character(self):
        self.print_header("CHARACTER CREATION")
        
        print("What would you like to be called in the metaverse?")
        username = input("Your name: ").strip() or "Adventurer"
        
        print(f"\nGreetings, {username}!")
        print("\nWhat profession calls to you?")
        print("  1. 🏢 Real Estate Agent - Earn commissions from property sales")
        print("  2. 🏗️  Architect - Design amazing buildings")
        print("  3. 💼 Investor - Build wealth through smart investments")
        print("  4. 🎨 Artist - Create and sell virtual art")
        print("  5. 🔬 Scientist - Research and innovate")
        print("  6. 🗺️  Explorer - Discover new territories")
        
        choice = input("\nChoose your path (1-6): ").strip()
        
        profession_map = {
            '1': ProfessionType.REAL_ESTATE_AGENT,
            '2': ProfessionType.ARCHITECT,
            '3': ProfessionType.INVESTOR,
            '4': ProfessionType.ARTIST,
            '5': ProfessionType.SCIENTIST,
            '6': ProfessionType.EXPLORER
        }
        
        profession = profession_map.get(choice, ProfessionType.REAL_ESTATE_AGENT)
        
        self.current_user = self.metaverse.create_user(username, profession)
        self.social.create_social_profile(self.current_user.id)
        
        time.sleep(0.5)
        print(f"\n✨ Welcome to the metaverse, {username}!")
        print(f"💰 Starting balance: ${self.current_user.wallet_balance:,.2f}")
        print(f"🎯 Profession: {profession.value.replace('_', ' ').title()}")
        
        if profession == ProfessionType.REAL_ESTATE_AGENT:
            agent = self.metaverse.agents[self.current_user.id]
            print(f"📜 Real Estate License: Level {agent.license_level}")
            print(f"💵 Commission Rate: {agent.commission_rate * 100}%")
        
        input("\nPress Enter to enter the metaverse...")
    
    def show_main_menu(self):
        while True:
            self.clear_screen()
            self.print_header(f"🌍 METAVERSE - {self.current_user.username}'s Dashboard")
            
            # Show quick stats
            print(f"💰 Wallet: ${self.current_user.wallet_balance:,.2f}")
            print(f"🏠 Properties Owned: {len(self.current_user.owned_properties)}")
            print(f"⭐ Level: {self.current_user.avatar.level}")
            print(f"🎯 Reputation: {self.current_user.avatar.reputation:.1f}")
            
            if self.current_user.id in self.metaverse.agents:
                agent = self.metaverse.agents[self.current_user.id]
                print(f"📊 Total Sales: {agent.total_sales}")
                print(f"💵 Commissions Earned: ${agent.total_commissions:,.2f}")
            
            self.print_section("MAIN MENU")
            print("  1. 🏠 Browse Properties")
            print("  2. 💼 My Real Estate Business")
            print("  3. 👥 Social & Networking")
            print("  4. 🌍 Explore the World")
            print("  5. 📊 Statistics & Leaderboard")
            print("  6. ⏰ Advance Time")
            print("  7. 💾 Save & Exit")
            
            choice = input("\nWhat would you like to do? (1-7): ").strip()
            
            if choice == '1':
                self.browse_properties()
            elif choice == '2':
                self.real_estate_business()
            elif choice == '3':
                self.social_menu()
            elif choice == '4':
                self.explore_world()
            elif choice == '5':
                self.show_statistics()
            elif choice == '6':
                self.advance_time()
            elif choice == '7':
                self.save_and_exit()
                break
            else:
                print("Invalid choice!")
                time.sleep(1)
    
    def browse_properties(self):
        self.clear_screen()
        self.print_header("🏠 PROPERTY LISTINGS")
        
        print("Filter by:")
        print("  1. All Properties")
        print("  2. Residential")
        print("  3. Luxury")
        print("  4. Commercial")
        print("  5. Beachfront")
        
        choice = input("\nYour choice (1-5): ").strip()
        
        type_map = {
            '2': PropertyType.RESIDENTIAL,
            '3': PropertyType.LUXURY,
            '4': PropertyType.COMMERCIAL,
            '5': PropertyType.BEACHFRONT
        }
        
        prop_type = type_map.get(choice)
        
        properties = self.metaverse.search_properties(
            property_type=prop_type,
            for_sale_only=True
        )[:10]
        
        print(f"\n📋 Found {len(properties)} properties:\n")
        
        for i, prop in enumerate(properties, 1):
            price = prop.calculate_value(self.metaverse.world_state.market_conditions)
            print(f"{i}. {prop.property_type.value.title()} in {prop.zone.value.title()}")
            print(f"   💰 ${price:,.2f} | 📏 {prop.size:.0f}m² | ⭐ {prop.quality_rating:.1f}/10")
            if prop.features:
                print(f"   ✨ Features: {', '.join(prop.features)}")
            print()
        
        choice = input("View details (1-10) or 'B' to go back: ").strip()
        
        if choice.isdigit() and 1 <= int(choice) <= len(properties):
            self.view_property_details(properties[int(choice) - 1])
    
    def view_property_details(self, prop):
        self.clear_screen()
        self.print_header(f"🏠 {prop.property_type.value.title()}")
        
        price = prop.calculate_value(self.metaverse.world_state.market_conditions)
        
        print(f"Location: {prop.zone.value.title()}")
        print(f"Price: ${price:,.2f}")
        print(f"Size: {prop.size:.0f}m²")
        print(f"Quality Rating: {prop.quality_rating:.1f}/10")
        print(f"Features: {', '.join(prop.features) if prop.features else 'Standard'}")
        print(f"Position: ({prop.position.x:.1f}, {prop.position.y:.1f}, {prop.position.z:.1f})")
        
        if self.current_user.id in self.metaverse.agents:
            agent = self.metaverse.agents[self.current_user.id]
            commission = price * agent.commission_rate
            print(f"\n💰 Your Commission: ${commission:,.2f} ({agent.commission_rate * 100}%)")
        
        print("\nOptions:")
        print("  1. Purchase for myself")
        if self.current_user.id in self.metaverse.agents:
            print("  2. Find a buyer (simulate sale)")
        print("  3. Back to listings")
        
        choice = input("\nYour choice: ").strip()
        
        if choice == '1':
            if self.current_user.wallet_balance >= price:
                confirm = input(f"\nConfirm purchase for ${price:,.2f}? (y/n): ")
                if confirm.lower() == 'y':
                    trans = self.metaverse.purchase_property(
                        prop.id,
                        self.current_user.id
                    )
                    if trans:
                        print("\n✅ Congratulations! You are now a property owner!")
                        time.sleep(2)
            else:
                print(f"\n❌ Insufficient funds. You need ${price - self.current_user.wallet_balance:,.2f} more.")
                time.sleep(2)
        
        elif choice == '2' and self.current_user.id in self.metaverse.agents:
            # Simulate finding a buyer
            print("\n🔍 Searching for interested buyers...")
            time.sleep(1)
            
            interested_npcs = []
            for npc_id, npc in self.npcs.npcs.items():
                interest = self.npcs.npc_interest_in_property(npc_id, {'price': price})
                if interest > 0.6:
                    interested_npcs.append((npc, interest))
            
            if interested_npcs:
                npc, interest = interested_npcs[0]
                print(f"\n✨ {npc.name} is interested! (Interest level: {interest * 100:.0f}%)")
                
                # Create buyer
                buyer = self.metaverse.create_user(npc.name)
                buyer.wallet_balance = price * 2
                
                confirm = input("Proceed with sale? (y/n): ")
                if confirm.lower() == 'y':
                    trans = self.metaverse.purchase_property(
                        prop.id,
                        buyer.id,
                        self.current_user.id
                    )
                    
                    if trans:
                        print(f"\n💰 SALE COMPLETE!")
                        print(f"   Commission earned: ${trans.commission_amount:,.2f}")
                        print(f"   New balance: ${self.current_user.wallet_balance:,.2f}")
                        
                        agent = self.metaverse.agents[self.current_user.id]
                        if agent.total_sales % 10 == 0:
                            print(f"\n🎉 LEVEL UP! You're now Level {agent.license_level}!")
                        
                        time.sleep(3)
            else:
                print("\n😔 No interested buyers right now. Try again later!")
                time.sleep(2)
    
    def real_estate_business(self):
        if self.current_user.id not in self.metaverse.agents:
            self.clear_screen()
            self.print_header("🏢 BECOME A REAL ESTATE AGENT")
            print("You're not currently a licensed real estate agent.")
            print("\nWould you like to get your license?")
            choice = input("(y/n): ").strip().lower()
            
            if choice == 'y':
                self.metaverse.become_real_estate_agent(self.current_user.id)
                self.social.create_social_profile(self.current_user.id)
                print("\n✅ Congratulations! You're now a licensed real estate agent!")
                time.sleep(2)
            return
        
        agent = self.metaverse.agents[self.current_user.id]
        
        self.clear_screen()
        self.print_header("🏢 YOUR REAL ESTATE BUSINESS")
        
        print(f"License Level: {agent.license_level}")
        print(f"Commission Rate: {agent.commission_rate * 100}%")
        print(f"Total Sales: {agent.total_sales}")
        print(f"Sales Volume: ${agent.total_volume:,.2f}")
        print(f"Total Commissions: ${agent.total_commissions:,.2f}")
        print(f"Active Listings: {len(agent.active_listings)}")
        print(f"Reputation: {agent.reputation:.1f}")
        
        input("\nPress Enter to continue...")
    
    def social_menu(self):
        self.clear_screen()
        self.print_header("👥 SOCIAL & NETWORKING")
        
        print("  1. Meet NPCs")
        print("  2. View Relationships")
        print("  3. Create Community")
        print("  4. Upcoming Events")
        print("  5. Back")
        
        choice = input("\nYour choice (1-5): ").strip()
        
        if choice == '1':
            self.meet_npcs()
        elif choice == '2':
            self.view_relationships()
        elif choice == '4':
            self.view_events()
    
    def meet_npcs(self):
        self.clear_screen()
        self.print_header("👥 MEET PEOPLE IN THE METAVERSE")
        
        npcs = list(self.npcs.npcs.values())[:5]
        
        for i, npc in enumerate(npcs, 1):
            print(f"\n{i}. {npc.name}")
            print(f"   Occupation: {npc.occupation.replace('_', ' ').title()}")
            print(f"   Interests: {', '.join(npc.interests)}")
            print(f"   Says: '{npc.generate_dialogue()}'")
        
        input("\nPress Enter to continue...")
    
    def view_relationships(self):
        self.clear_screen()
        self.print_header("👥 YOUR RELATIONSHIPS")
        
        relationships = self.social.get_relationships(self.current_user.id)
        
        if relationships:
            for rel in relationships:
                other_id = rel.user2_id if rel.user1_id == self.current_user.id else rel.user1_id
                other_user = self.metaverse.users.get(other_id)
                
                print(f"\n• {other_user.username if other_user else 'Unknown'}")
                print(f"  Type: {rel.relationship_type.value}")
                print(f"  Strength: {rel.strength:.0f}/100")
        else:
            print("You haven't formed any relationships yet.")
            print("Meet people and make connections!")
        
        input("\nPress Enter to continue...")
    
    def view_events(self):
        self.clear_screen()
        self.print_header("📅 UPCOMING EVENTS")
        
        # Create some sample events
        if not self.social.events:
            events_data = [
                ("Property Auction", EventType.AUCTION, 2),
                ("Real Estate Networking Night", EventType.NETWORKING, 5),
                ("Open House Showcase", EventType.OPEN_HOUSE, 3),
            ]
            
            for name, event_type, hours in events_data:
                self.social.create_event(
                    name=name,
                    description=f"Join us for {name}!",
                    organizer_id=self.current_user.id,
                    event_type=event_type,
                    start_time=datetime.now() + timedelta(hours=hours),
                    max_attendees=50
                )
        
        events = self.social.get_upcoming_events()
        
        for i, event in enumerate(events, 1):
            print(f"\n{i}. {event.name}")
            print(f"   Type: {event.event_type.value.title()}")
            print(f"   When: {event.start_time.strftime('%Y-%m-%d %H:%M')}")
            print(f"   Attendees: {len(event.attendees)}/{event.max_attendees}")
        
        input("\nPress Enter to continue...")
    
    def explore_world(self):
        self.clear_screen()
        self.print_header("🌍 EXPLORE THE METAVERSE")
        
        zones = [
            ("Downtown", "The heart of the city with towering skyscrapers"),
            ("Business District", "Corporate hub with modern offices"),
            ("Suburban", "Peaceful neighborhoods with family homes"),
            ("Resort", "Vacation paradise with beachfront properties"),
            ("Nature Reserve", "Eco-friendly zone surrounded by nature"),
        ]
        
        for i, (zone, desc) in enumerate(zones, 1):
            print(f"\n{i}. {zone}")
            print(f"   {desc}")
        
        input("\nPress Enter to continue...")
    
    def show_statistics(self):
        self.clear_screen()
        self.print_header("📊 METAVERSE STATISTICS")
        
        world_state = self.metaverse.get_world_state()
        
        print("World Status:")
        for key, value in world_state.items():
            print(f"  {key.replace('_', ' ').title()}: {value}")
        
        if self.metaverse.agents:
            print("\n🏆 TOP AGENTS:")
            agents = []
            for agent_id, agent in self.metaverse.agents.items():
                user = self.metaverse.users[agent_id]
                agents.append((user.username, agent.total_commissions, agent.total_sales))
            
            agents.sort(key=lambda x: x[1], reverse=True)
            
            for i, (name, commissions, sales) in enumerate(agents[:5], 1):
                star = "⭐" if name == self.current_user.username else "  "
                print(f"  {star}{i}. {name} - ${commissions:,.2f} ({sales} sales)")
        
        input("\nPress Enter to continue...")
    
    def advance_time(self):
        self.clear_screen()
        self.print_header("⏰ TIME PASSAGE")
        
        print("How much time should pass?")
        print("  1. 1 hour")
        print("  2. 6 hours")
        print("  3. 1 day")
        print("  4. 1 week")
        
        choice = input("\nYour choice (1-4): ").strip()
        
        hours_map = {'1': 1, '2': 6, '3': 24, '4': 168}
        hours = hours_map.get(choice, 1)
        
        print(f"\n⏳ Time passes... {hours} hours go by...")
        time.sleep(1)
        
        self.metaverse.simulate_time(hours)
        
        print(f"\n✅ Time advanced!")
        print(f"   New time: {self.metaverse.world_state.time.strftime('%Y-%m-%d %H:%M')}")
        print(f"   Weather: {self.metaverse.world_state.weather.value}")
        print(f"   Market: {self.metaverse.world_state.market_conditions:.2f}x")
        
        input("\nPress Enter to continue...")
    
    def save_and_exit(self):
        self.clear_screen()
        self.print_header("💾 SAVING YOUR PROGRESS")
        
        print("Saving metaverse state...")
        self.metaverse.save_state()
        
        print("\n✅ Progress saved!")
        print(f"\n👋 Goodbye, {self.current_user.username}!")
        print("Your journey continues next time you log in...")
        print("\n🌟 Thanks for experiencing the metaverse! 🌟")
        time.sleep(2)
    
    def run(self):
        try:
            self.welcome_sequence()
            self.create_character()
            self.show_main_menu()
        except KeyboardInterrupt:
            print("\n\n👋 Exiting metaverse...")
            time.sleep(1)
        except Exception as e:
            print(f"\n❌ Error: {e}")
            time.sleep(2)


if __name__ == "__main__":
    demo = MetaverseDemo()
    demo.run()
