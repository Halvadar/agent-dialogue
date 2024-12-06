"use client";
import React, { createContext, useState, ReactNode } from "react";
import { Agent } from "../types/agentTypes";
import { Conversation } from "../types/messageTypes";

// Define the shape of the context state
interface AgentsContextType {
  agents: Agent[];
  myAgents: Agent[];
  selectedAgents: { [key: string]: Agent };
  conversations: Conversation[];
  setSelectedAgent: (agent: Agent) => void;
  chatIsActive: boolean;
  setChatIsActive: (isActive: boolean) => void;
}

// Create the context with a default value
const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

// Create a provider component
export const AgentsProvider: React.FC<{
  agents: Agent[];
  myAgents: Agent[];
  conversations: Conversation[];
  children: ReactNode;
}> = ({ agents, myAgents, conversations, children }) => {
  const [selectedAgents, setSelectedAgents] = useState<{
    [key: string]: Agent;
  }>({});
  const [chatIsActive, setChatIsActive] = useState(false);
  const setSelectedAgent = (agent: Agent) => {
    // if 2 agents are selected, remove the first one
    setSelectedAgents((prev) => {
      const prevKeys = Object.keys(prev);
      if (prev[agent.id]) {
        const { [agent.id]: existing, ...newState } = prev;
        return newState;
      }
      if (prevKeys.length >= 2) {
        const { [prevKeys[0]]: firstEl, ...newState } = prev;
        return { ...newState, [agent.id]: agent };
      }
      return { ...prev, [agent.id]: agent };
    });
  };

  return (
    <AgentsContext.Provider
      value={{
        selectedAgents,
        setSelectedAgent,
        agents,
        myAgents,
        conversations,
        chatIsActive,
        setChatIsActive,
      }}
    >
      {children}
    </AgentsContext.Provider>
  );
};

// Custom hook to use the AgentsContext
export const useAgents = () => {
  const context = React.useContext(AgentsContext);
  if (!context) {
    throw new Error("useAgents must be used within a AgentsProvider");
  }
  return context;
};
