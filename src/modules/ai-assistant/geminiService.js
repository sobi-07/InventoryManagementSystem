import { inventoryData, salesData } from "./sampleData";

export async function askGemini(userMessage, language) {
  // Apni valid Gemini API key yaha quotes ke andar rakhein
  const apiKey = "AQ.Ab8RN6J3yALrFxLNYn8GkzYkj9nyvEb7Uifv3_oKxTV1wXjPfw";

  const systemInstruction = `
You are a smart AI Shop Assistant for a local Indian grocery/retail shop.
Here is the shop's live database:

INVENTORY:
${JSON.stringify(inventoryData, null, 2)}

SALES STATS:
${JSON.stringify(salesData, null, 2)}

INSTRUCTIONS:
1. Current Selected Language: ${language}.
2. If language is 'Hinglish', reply strictly in natural conversational Hinglish (Hindi written in Roman English script, e.g. "Aapke paas Cooking Oil sirf 3 bottles bachi hain").
3. If language is 'English', reply strictly in professional, friendly English.
4. Keep answers short, direct, and use bullet points or emojis where helpful.
5. If the user asks about an item not in the inventory, politely inform them it is out of stock or not available in the store.
`;

  const prompt = `${systemInstruction}\n\nUser Question: ${userMessage}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return `Error: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return language === "Hinglish"
      ? "⚠️ Network issue: AI se connect nahi ho paya."
      : "⚠️ Network issue: Unable to connect to AI.";
  }
}