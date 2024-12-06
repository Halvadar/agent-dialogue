import { Agent } from "./agentTypes";

export type Message = {
  content: string;
  agentId: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  agent1Id: string;
  agent2Id: string;
  agent1: Agent;
  agent2: Agent;
  firstMessage?: string;
  createdAt: number;
  userId: string;
  creator: string;
  messages: Message[];
};
