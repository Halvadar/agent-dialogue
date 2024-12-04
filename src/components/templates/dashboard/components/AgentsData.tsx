"use server";

import { db } from "@/app/lib/firebase";

import { collection, getDocs } from "firebase/firestore";
import Agents from "./Agents";

type Agent = {
  id: string;
  name: string;
  instructions: string;
  creator: string;
};

async function getAgents(): Promise<Agent[]> {
  const agentsSnapshot = await getDocs(collection(db, "agents"));
  const agents = agentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Agent[];
  return agents;
}

export default async function AgentsData() {
  const agents = await getAgents();
  return <Agents agents={agents} />;
}
