import express from 'express';
import cors from 'cors';
import { AgentManager } from './services/agent.manager';

const app = express();
app.use(cors());
app.use(express.json());

const agentManager = new AgentManager();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-agent-service' });
});

app.get('/agents', (req, res) => {
  res.json(agentManager.getAgents());
});

app.post('/agents/:id/interact', async (req, res) => {
  const { id } = req.params;
  const { userId, message } = req.body;
  
  try {
    const response = await agentManager.handleInteraction(id, userId, message);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/agents/:id/location', (req, res) => {
  const { id } = req.params;
  const { parcelId } = req.body;
  
  try {
    agentManager.updateAgentLocation(id, parcelId);
    res.json({ status: 'updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
