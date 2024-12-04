"use server";

import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";
import { getDecodedTokenServerside } from "./lib/getDecodedTokenServerside";

export async function createAgent(formData: FormData) {
  try {
    // Get the current user
    const decodedToken = await getDecodedTokenServerside();
    const userId = decodedToken.uid;

    // Get the form data
    const name = formData.get("name");
    const instructions = formData.get("instructions");

    // Create the agent document
    const agentData = {
      name,
      instructions,
      userId,
    };

    // Add to Firestore
    const agentsRef = collection(db, "agents");
    const docRef = await addDoc(agentsRef, agentData);

    // Revalidate the agents page
    revalidateTag("agents");

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, error: "Failed to create agent" };
  }
}
