export type AgentType = 'CONCIERGE' | 'MYSTERY_SHOPPER';

export interface AgentPersonality {
  name: string;
  type: AgentType;
  tone: string;
  background: string;
  goals: string[];
}

export interface AgentState {
  id: string;
  personality: AgentPersonality;
  currentParcelId?: string;
  currentAction: 'IDLE' | 'PATROLLING' | 'CONVERSING' | 'REPORTING';
  lastInteractionAt?: Date;
}
