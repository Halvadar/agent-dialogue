"use server";

import { getAgents, getMyAgents, getConversations } from "@/app/utils/agents";
import { AgentsProvider } from "../../../../app/context/AgentsContext";

export default async function AgentsData({
  children,
}: {
  children: React.ReactNode;
}) {
  const agents = await getAgents();
  const myAgents = await getMyAgents();
  const conversations = await getConversations();
  return (
    <AgentsProvider
      myAgents={myAgents}
      agents={agents}
      conversations={conversations}
    >
      {children}
    </AgentsProvider>
  );
}
