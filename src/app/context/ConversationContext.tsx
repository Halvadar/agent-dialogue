"use client";
import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context state
interface ConversationContextType {
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
}

// Create the context with a default value
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

// Create a provider component
export const ConversationProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  return (
    <ConversationContext.Provider
      value={{
        activeConversation,
        setActiveConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the ConversationsContext
export const useConversations = () => {
  const context = React.useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversations must be used within a ConversationsProvider"
    );
  }
  return context;
};
