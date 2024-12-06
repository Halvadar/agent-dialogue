import { Agent } from "./agentTypes";

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
};
