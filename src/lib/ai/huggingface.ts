import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.EXPO_PUBLIC_HF_TOKEN);

export async function askAI(prompt: string) {
  const chatCompletion = await client.chatCompletion({
    model: "TeichAI/Qwen3-4B-Thinking-2507-Gemini-2.5-Flash-Distill:featherless-ai",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  return chatCompletion.choices[0].message;
}
