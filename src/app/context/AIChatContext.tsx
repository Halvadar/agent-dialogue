"use client";
import { Message, UseChatHelpers, UseChatOptions, useChat } from "ai/react";
import React, { createContext, ReactNode, useEffect, useRef } from "react";

type AIChatContextType = UseChatHelpers;

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

const callbacks: { [key: string]: ((message: Message) => void)[] } = {
  onFinish: [],
};
const options: UseChatOptions = {
  onFinish: (message) => {
    callbacks.onFinish.forEach((callback) => callback(message));
  },
};

export const AIChatProvider: React.FC<
  {
    children: ReactNode;
  } & UseChatOptions
> = ({ children, ...defaultOptions }) => {
  const chat = useChat({ ...defaultOptions, ...options });

  return (
    <AIChatContext.Provider value={chat}>{children}</AIChatContext.Provider>
  );
};

export const useAIChat = (options: {
  [key: string]: (...args: any[]) => void | Promise<void>;
}) => {
  useEffect(() => {
    const optionsRef = options;
    Object.entries(optionsRef).forEach(([key, func]) => {
      callbacks[key] = !callbacks[key] ? [func] : [...callbacks[key], func];
    });
    return () => {
      Object.entries(optionsRef).forEach(([key, func]) => {
        callbacks[key] = callbacks[key].filter((f) => f !== func);
      });
    };
  }, [options]);

  const context = React.useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChat must be used within a AIChatProvider");
  }
  return context;
};
