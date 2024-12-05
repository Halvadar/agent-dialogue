import { Timestamp } from "firebase/firestore";

export type Agent = {
  id: string;
  name: string;
  instructions: string;
  creator: string;
  createdAt: Timestamp;
  userId: String;
};

export type Conversation = {
  id: string;
  agent1Id: string;
  agent2Id: string;
  lastMessage?: string;
  createdAt: Timestamp;
  userId: string;
  creator: string;
};
