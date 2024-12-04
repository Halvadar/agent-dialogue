"use server";

import { getAgents, getMyAgents } from "@/app/utils/agents";
import { AgentsProvider } from "../../../../app/context/AgentsContext";

export default async function AgentsData({
  children,
}: {
  children: React.ReactNode;
}) {
  const agents = await getAgents();
  const myAgents = await getMyAgents();
  return (
    <AgentsProvider myAgents={myAgents} agents={agents}>
      {children}
    </AgentsProvider>
  );
}
