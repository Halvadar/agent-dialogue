"use server";

import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { revalidateTag } from "next/cache";
import { getDecodedTokenServerside } from "./lib/getDecodedTokenServerside";

export async function createAgent(formData: FormData) {
  console.log("Creating agent");
  try {
    const decodedToken = await getDecodedTokenServerside();
    const userId = decodedToken.uid;

    const name = formData.get("name");
    const instructions = formData.get("instructions");
    const date = Timestamp.now();
    const agentData = {
      name,
      instructions,
      userId,
      createdAt: date,
    };

    const agentsRef = collection(db, "agents");
    await addDoc(agentsRef, agentData);
    revalidateTag("agents");
    return { success: true, message: "Agent created successfully" };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, message: "Failed to create agent" };
  }
}

export async function createConversation(formData: FormData) {
  try {
    console.log("Creating conversation");
    const decodedToken = await getDecodedTokenServerside();
    const creator = decodedToken.name || decodedToken.email;
    const userId = decodedToken.uid;
    const agent1Id = formData.get("agent1Id");
    const agent2Id = formData.get("agent2Id");
    const firstMessage = formData.get("firstMessage");
    const date = Timestamp.now();

    const conversationsRef = collection(db, "conversations");
    await addDoc(conversationsRef, {
      agent1Id,
      agent2Id,
      userId,
      creator,
      firstMessage,
      createdAt: date,
    });
    revalidateTag("conversations");
    return { success: true, message: "Message box created successfully" };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, message: "Failed to create agent" };
  }
}
