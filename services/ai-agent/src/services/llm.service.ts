import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

export class LLMService {
  static async generateResponse(prompt: string, personality: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return `[MOCK RESPONSE for ${personality}] I am an AI agent, but no API key is provided. You said: ${prompt}`;
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: `You are an AI agent in the Meta_The_World metaverse. Your personality is: ${personality}` },
          { role: 'user', content: prompt }
        ],
      });

      return response.choices[0].message.content || 'I am sorry, I cannot respond at the moment.';
    } catch (error) {
      console.error('LLM Error:', error);
      return 'Beep boop. System error.';
    }
  }
}
