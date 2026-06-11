import * as FileSystem from 'expo-file-system/legacy';
import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.EXPO_PUBLIC_HF_TOKEN,
});

const sustainabilityScore = `
    1. Energy: How much energy does the product use? Can we use less or adopt clean alternative energy sources?
        Product will have a higher score if the product requires lesser energy.
    2. Waste and Recycling: What waste does the product produce and where does it come from? Is it Hazardous?
        Can we find ways to recycle or upcycle waste materials? Product will have a higher score if it is 
        recyclable.
    3. Products and packaging: Does the product use sustainably sourced and eco-friendly materials? How does 
        manufacturing the product impact the environment? Is the packaging also safe for people and the planet?
        Product will have a higher score if the materials are eco-friendly.
    4. Water: How much water does the product use? How does making it waste? Do we use plastic bottles for water?
        Product will have a higher score if it doesn't require a lot of water during creation.
    5. Animals: Does the product use animal-derived materials such as leather, fur, wool, silk, or animal-tested 
        ingredients? Could synthetic, plant-based, or cruelty-free alternatives replace animal materials? Product
        will have a higher score if it uses lesser animal-derived materials.
`

export async function askAI(imageURI: string | string[], category: string) {
    try {
        // Get first URI if array  is passed
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

        // --- Convert to Base64 ---
        console.log("🔄 Converting to base64...");
        const base64 = await FileSystem.readAsStringAsync(permanentUri, {
            encoding: 'base64',
        });

        console.log(`✅ Base64 conversion done! Length: ${base64.length} chars`);

        // --- Send to Hugging Face ---
        console.log("🤖 Sending request to Hugging Face...");
        const chatCompletion = await client.chat.completions.create({
            model: "Qwen/Qwen3.5-35B-A3B:novita",
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
                            text: `You are analyzing a product image Digital Product Passport App.
                                The user has selected the category: "${category}".
                                FIRST, determine if the product in the image in image_url matches
                                the category "${category}. 
                                If it does not match, return only this JSON and nothing else:
                                {
                                "error": true,
                                "message": "The item does not match the category '${category}'. Please retake the photo or change your category.
                                }
                                
                                If it DOES match, return only JSON details about the product in this format and NOTHING else:
                                {
                                "name": "product name",
                                "material": "main material(s) used",
                                "origin": "Likely country and city of user",
                                "production_method": "manufacturing method",
                                "sustainability_score": "A 0-10 scoring product sustainability based on ${sustainabilityScore}",
                                "description": "one sentence description of the product"
                                }
                                Return raw JSON only. No Markdown, no Backticks, no extra text.`,
                        },
                    ],
                },
            ],
            max_tokens: 350,
            temperature: 0.3,
        });

        console.log("✅ askAI completed successfully");
        const message = chatCompletion.choices[0].message.content;
        if (!message) {
            throw new Error("AI response content is empty or null");
        }
        const parsed = JSON.parse(message);
        return parsed;

    } catch (err: any) {
        console.error("❌ askAI Error:");
        console.error("Message:", err.message);
        console.error("Status:", err.status);
        throw err;
    }
}

export async function askAIOnNewScore(response: string) {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "Qwen/Qwen3.5-35B-A3B:novita",
            messages: [
                {
                    role: "system",
                    content: `You are a precise JSON-only assistant. Always respond with valid JSON and nothing else. 
                    No explanation, no markdown, no backtics`
                },
                {
                    role: "user",
                    content: `Analyze this product metadata and return ONLY a JSON object with the sustainability score.
                        Product data: ${JSON.stringify(response, null, 2)}
                        Return exactly this format and nothing else:
                        {
                        "sustainability_score": "A 0-10 scoring product sustainability based on ${sustainabilityScore}",
                        }
                        Return raw JSON only. No Markdown, no Backticks, no extra text.`,
                },
            ],
            max_tokens: 350,
            temperature: 0.3,
        });

        console.log("AI analysis complete");
        const message = chatCompletion.choices[0].message.content;

        if (!message) {
            throw new Error("AI response null");
        }
        const parsed = JSON.parse(message);
        return parsed;

    } catch (err: any) {
        console.error("AI error: ")
        console.error("Message: ", err.message);
        console.error("Status: ", err.status);
        throw err;
    }
}
