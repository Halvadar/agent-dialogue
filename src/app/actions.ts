"use server";

import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  getDocs,
  query,
  orderBy,
  arrayUnion,
  documentId,
  where,
} from "firebase/firestore";
import { revalidateTag } from "next/cache";
import { getDecodedTokenServerside } from "./lib/getDecodedTokenServerside";

export async function createAgent(formData: FormData) {
  try {
    const decodedToken = await getDecodedTokenServerside();
    const userId = decodedToken.uid;
    const userName = decodedToken.name || decodedToken.email;
    const name = formData.get("name");
    const instructions = formData.get("instructions");
    const date = Timestamp.now();
    const agentData = {
      name,
      instructions,
      userId,
      creator: userName,
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
    const docRef = await addDoc(conversationsRef, {
      agent1Id,
      agent2Id,
      userId,
      creator,
      firstMessage,
      messages: [{ content: firstMessage, agentId: agent1Id, createdAt: date }],
      createdAt: date,
    });
    revalidateTag("conversations");
    return {
      success: true,
      message: "Conversation created successfully",
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, message: "Failed to create agent" };
  }
}

export async function addMessageToConversation(formData: FormData) {
  try {
    await getDecodedTokenServerside();
    const conversationId = formData.get("conversationId");

    if (!conversationId) {
      return { success: false, message: "Conversation ID is required" };
    }

    const content = formData.get("content");
    const agentId = formData.get("agentId");
    const date = Timestamp.now();

    const convoDoc = await getDocs(
      query(
        collection(db, "conversations"),
        where(documentId(), "==", conversationId),
        orderBy("createdAt", "desc")
      )
    );
    console.log(conversationId);
    if (convoDoc.docs.length === 0) {
      return { success: false, message: "Conversation not found" };
    }

    const doc = convoDoc.docs[0];
    const convoRef = doc.ref;
    await updateDoc(convoRef, {
      messages: arrayUnion({ content, agentId, createdAt: date }),
    });

    return { success: true, message: "Message added successfully" };
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    return { success: false, message: "Failed to add message to conversation" };
  }
}
