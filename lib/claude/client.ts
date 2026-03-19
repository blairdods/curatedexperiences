import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export { anthropic };

export const MODELS = {
  concierge: "claude-sonnet-4-6" as const,
  agent: "claude-haiku-4-5-20251001" as const,
};
