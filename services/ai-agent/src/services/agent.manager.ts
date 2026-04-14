import { AgentState, AgentPersonality } from '../models/agent';
import { LLMService } from './llm.service';

export class AgentManager {
  private agents: Map<string, AgentState> = new Map();

  constructor() {
    // Initialize with some default agents
    this.createAgent('agent-1', {
      name: 'Diamond Dave',
      type: 'CONCIERGE',
      tone: 'Helpful and slightly eccentric',
      background: 'A veteran of the Diamond District who knows all the best spots.',
      goals: ['Welcome newcomers', 'Explain the gambling rules']
    });

    this.createAgent('agent-2', {
      name: 'Shadow',
      type: 'MYSTERY_SHOPPER',
      tone: 'Observant and critical',
      background: 'A former urban planner who now critiques metaverse parcels.',
      goals: ['Evaluate parcel quality', 'Generate reports for the DAO']
    });
  }

  createAgent(id: string, personality: AgentPersonality): AgentState {
    const agent: AgentState = {
      id,
      personality,
      currentAction: 'IDLE',
    };
    this.agents.set(id, agent);
    return agent;
  }

  async handleInteraction(agentId: string, userId: string, message: string): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error('Agent not found');

    agent.currentAction = 'CONVERSING';
    agent.lastInteractionAt = new Date();

    const personalityStr = `${agent.personality.name} (${agent.personality.type}). Tone: ${agent.personality.tone}. Background: ${agent.personality.background}`;
    const response = await LLMService.generateResponse(message, personalityStr);
    
    agent.currentAction = 'IDLE';
    return response;
  }

  getAgents(): AgentState[] {
    return Array.from(this.agents.values());
  }

  updateAgentLocation(agentId: string, parcelId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.currentParcelId = parcelId;
    }
  }
}
