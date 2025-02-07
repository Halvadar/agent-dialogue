"use client";
import { createContext, useContext, useState } from "react";
import { ModelOptions } from "../types/modelTypes";

const ModelProviderContext = createContext<{
  model: ModelOptions;
  setModel: (model: ModelOptions) => void;
}>({
  model: ModelOptions.ANTHROPIC,
  setModel: () => {},
});

export const ModelProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [model, setModel] = useState<ModelOptions>(ModelOptions.OPENAI);
  return (
    <ModelProviderContext.Provider value={{ model, setModel }}>
      {children}
    </ModelProviderContext.Provider>
  );
};

export const useModelProvider = () => {
  return useContext(ModelProviderContext);
};
