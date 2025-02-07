let modelProvider: () => LanguageModelV1;

switch (process.env.MODEL_PROVIDER) {
  case "openai":
    modelProvider = await import("@ai-sdk/openai").then(
      (m) => () => m.openai("gpt-4o-mini")
    );
    break;
  case "deepseek":
    modelProvider = await import("@ai-sdk/deepseek").then(
      (m) => () => m.deepseek("deepseek-chat") as LanguageModelV1
    );
    break;
  default:
    throw new Error("Invalid model provider");
}

import { LanguageModelV1, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, systemMessage } = await req.json();
  const result = streamText({
    model: modelProvider(),
    system: `Your instructions are: "${systemMessage}" \n\n Be concise and to the point. Try to engage and ask questions to the user. Also be responsive to the user's questions.`,
    messages,
    maxTokens: 150,
  });

  return result.toDataStreamResponse();
}
