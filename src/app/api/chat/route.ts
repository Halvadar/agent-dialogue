import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, systemMessage } = await req.json();
  console.log(messages, systemMessage);
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    messages,
    maxTokens: 1000,
  });
  console.log("active");

  return result.toDataStreamResponse();
}
