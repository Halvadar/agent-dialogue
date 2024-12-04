"use client";
import React, { createContext, useState, ReactNode } from "react";
import { Agent } from "../types/agents";

// Define the shape of the context state
interface AgentsContextType {
  agents: Agent[];
  myAgents: Agent[];
  selectedAgents: { [key: string]: Agent };
  setSelectedAgent: (agent: Agent) => void;
}

// Create the context with a default value
const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

// Create a provider component
export const AgentsProvider: React.FC<{
  agents: Agent[];
  myAgents: Agent[];
  children: ReactNode;
}> = ({ agents, myAgents, children }) => {
  const [selectedAgents, setSelectedAgents] = useState<{
    [key: string]: Agent;
  }>({});

  const setSelectedAgent = (agent: Agent) => {
    // if 2 agents are selected, remove the first one
    setSelectedAgents((prev) => {
      const prevKeys = Object.keys(prev);
      if (prev[agent.id]) {
        const newState = { ...prev };
        delete newState[agent.id];
        return newState;
      }
      if (prevKeys.length >= 2) {
        const newState = { ...prev };
        delete newState[prevKeys[0]];
        return { ...newState, [agent.id]: agent };
      }
      return { ...prev, [agent.id]: agent };
    });
  };

  return (
    <AgentsContext.Provider
      value={{ selectedAgents, setSelectedAgent, agents, myAgents }}
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
