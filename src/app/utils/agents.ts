"use server";

import { Agent } from "../types/agentTypes";
import { db } from "@/app/lib/firebase";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getDecodedTokenServerside } from "../lib/getDecodedTokenServerside";
import { Conversation } from "../types/messageTypes";

export async function getAgents(): Promise<Agent[]> {
  const agentsSnapshot = await getDocs(collection(db, "agents"));
  const agents = agentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.get("createdAt")?.toDate().getTime(),
  })) as Agent[];
  return agents;
}

export async function getMyAgents(): Promise<Agent[]> {
  const decodedToken = await getDecodedTokenServerside();
  const agentsSnapshot = await getDocs(
    query(collection(db, "agents"), where("userId", "==", decodedToken.uid))
  );
  const agents = agentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.get("createdAt")?.toDate().getTime(),
  })) as Agent[];
  return agents;
}

export async function getConversations(): Promise<Conversation[]> {
  const decodedToken = await getDecodedTokenServerside();

  const conversationsSnapshot = await getDocs(
    query(
      collection(db, "conversations"),
      where("userId", "==", decodedToken.uid)
    )
  );
  const docs = conversationsSnapshot.docs;
  if (docs.length === 0) {
    return [];
  }

  const agentIds = [
    ...new Set(
      docs.reduce<string[]>((acc, conversation) => {
        return [
          ...acc,
          conversation.get("agent1Id"),
          conversation.get("agent2Id"),
        ];
      }, [])
    ),
  ];
  console.log(agentIds);
  const agentsSnapshot = await getDocs(
    query(collection(db, "agents"), where(documentId(), "in", agentIds))
  );

  const agentsMap = new Map<string, Agent>();
  agentsSnapshot.docs.forEach((agent) => {
    agentsMap.set(agent.id, agent.data() as Agent);
  });

  const conversations = conversationsSnapshot.docs.map((conversation) => {
    return {
      id: conversation.id,
      ...conversation.data(),
      agent1: agentsMap.get(conversation.data().agent1Id),
      agent2: agentsMap.get(conversation.data().agent2Id),
      createdAt: conversation.get("createdAt")?.toDate().getTime(),
    };
  }) as Conversation[];

  return conversations;
}
