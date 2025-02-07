import { LanguageModelV1, streamText } from "ai";

import { ModelOptions } from "../../types/modelTypes";

const getModelProvider = async (model: ModelOptions) => {
  if (model.includes("gpt")) {
    return import("@ai-sdk/openai").then((m) => () => m.openai(model));
  } else if (model.includes("deepseek")) {
    return import("@ai-sdk/deepseek").then(
      (m) => () => m.deepseek(model) as LanguageModelV1
    );
  } else if (model.includes("claude")) {
    return import("@ai-sdk/anthropic").then(
      (m) => () => m.anthropic(model) as LanguageModelV1
    );
  } else {
    throw new Error("Invalid model provider");
  }
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, systemMessage, model } = await req.json();

  const modelProvider = await getModelProvider(
    model || "claude-3-5-sonnet-20240620"
  );

  const result = streamText({
    model: modelProvider(),
    system: `Your instructions are: "${systemMessage}" \n\n Be concise and to the point. Try to engage and ask questions to the user. Also be responsive to the user's questions.`,
    messages,
    maxTokens: 150,
  });

  return result.toDataStreamResponse();
}
