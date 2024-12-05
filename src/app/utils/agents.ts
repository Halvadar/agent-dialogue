"use server";

import { Agent } from "../types/agents";
import { db } from "@/app/lib/firebase";

import { collection, getDocs, query, where } from "firebase/firestore";
import { getDecodedTokenServerside } from "../lib/getDecodedTokenServerside";
import { Conversation } from "../types/agents";

export async function getAgents(): Promise<Agent[]> {
  const agentsSnapshot = await getDocs(collection(db, "agents"));
  const agents = agentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
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
  const conversations = conversationsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
  return conversations;
}
