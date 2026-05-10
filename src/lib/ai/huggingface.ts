//import { InferenceClient } from "@huggingface/inference";
import * as FileSystem from 'expo-file-system/legacy';
import {OpenAI} from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.EXPO_PUBLIC_HF_TOKEN,
});

export async function askAI(imageURI: string | string[]) {
  try {
    // Get first URI if array is passed
    const uri = Array.isArray(imageURI) ? imageURI[0] : imageURI;
    console.log("Image URI: ", uri);

    if (!uri) {
      throw new Error("No image URI provided");
    }

    console.log("🚀 askAI called with URI:", uri);

    // --- Copy image to permanent location (Important!) ---
    const fileName = `ai_temp_${Date.now()}.jpg`;
    const permanentUri = FileSystem.cacheDirectory + fileName;

    console.log("📋 Copying image to permanent location...");
    await FileSystem.copyAsync({ from: uri, to: permanentUri });

    console.log("📊 Getting file info...");
    const fileInfo = await FileSystem.getInfoAsync(permanentUri);
    console.log(`📁 File size: ${(fileInfo.size! / 1024 / 1024).toFixed(2)} MB`);

    // --- Convert to Base64 ---
    console.log("🔄 Converting to base64...");
    const base64 = await FileSystem.readAsStringAsync(permanentUri, {
      encoding: 'base64',
    });

    console.log(`✅ Base64 conversion done! Length: ${base64.length} chars`);

    // --- Send to Hugging Face ---
    console.log("🤖 Sending request to Hugging Face...");
    const chatCompletion = await client.chat.completions.create({
      model: "google/gemma-4-31B-it:novita",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
            {
              type: "text",
              text: `Analyze this product image and return ONLY a JSON object with no extra text, no markdown, no backticks. Use exactly this structure:
                {
                  "id": "auto-generated short uuid",
                  "name": "product name",
                  "material": "main material(s) used",
                  "origin": "Likely country and city of user",
                  "method": "manufacturing method",
                  "sustainability_score": "A 0-10 scoring product sustainability",
                  "description": "one sentence description of the product"
                }`,            
            },
          ],
        },
      ],
      max_tokens: 350,
      temperature: 0.7,
    });

    console.log("✅ askAI completed successfully");
    const message = chatCompletion.choices[0].message.content;
    const parsed = JSON.parse(message);
    return parsed;

  } catch (err: any) {
    console.error("❌ askAI Error:");
    console.error("Message:", err.message);
    console.error("Status:", err.status);
    throw err;
  }
}
