import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, systemMessage } = await req.json();
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `Your instructions are: "${systemMessage}"`,
    messages,
    maxTokens: 100,
  });

  return result.toDataStreamResponse();
}
