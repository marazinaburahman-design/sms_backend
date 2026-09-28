import Groq from "groq-sdk";
import { z } from "zod";

// Validation schema
const askAISchema = z.object({
  instructions: z.string().min(1, "Instructions required"),
  input: z.string().min(1, "Input data required")
});

export const askAI = async ({ instructions, input }) => {
  // Validate inputs
  const validated = askAISchema.parse({ instructions, input });

  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  try {
    // Create Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Use chat.completions
    const message = await groq.chat.completions.create({
      model: process.env.AI_MODEL || "mixtral-8x7b-32768",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${validated.instructions}\n\nDATA:\n${validated.input}`
        }
      ]
    });

    // Get the text from response
    const text = message.choices[0].message.content?.trim();

    if (!text) {
      const error = new Error("Groq returned an empty response");
      error.statusCode = 502;
      throw error;
    }

    return text;
  } catch (error) {
    console.error("Groq API error:", error);

    // User-friendly message for internet/Groq connection problems
    const isConnectionError =
      error?.name === "APIConnectionError" ||
      error?.cause?.code === "ENOTFOUND" ||
      error?.cause?.code === "ECONNREFUSED" ||
      error?.cause?.code === "ETIMEDOUT";

    if (isConnectionError) {
      const connectionError = new Error(
        "AI service unavailable. Please check your internet connection and try again."
      );

      connectionError.statusCode = 502;
      throw connectionError;
    }

    // Other Groq errors
    const newError = new Error(
      error?.message || "Groq API request failed"
    );

    newError.statusCode = error?.statusCode || 502;
    throw newError;
  }
};