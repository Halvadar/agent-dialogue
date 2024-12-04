"use server";

import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";
import { getDecodedTokenServerside } from "./lib/getDecodedTokenServerside";

export async function createAgent(formData: FormData) {
  console.log("Creating agent");
  try {
    const decodedToken = await getDecodedTokenServerside();
    const userId = decodedToken.uid;

    const name = formData.get("name");
    const instructions = formData.get("instructions");

    const agentData = {
      name,
      instructions,
      userId,
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
