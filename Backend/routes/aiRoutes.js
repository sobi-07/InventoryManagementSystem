const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');

router.post('/ask', async (req, res) => {
  const { query, language } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const products = await Product.find({});
    const sales = await Sale.find({}).sort({ createdAt: -1 }).limit(10);

    const systemPrompt = `
You are a smart AI Shop Assistant for a local Indian grocery/retail shop.
Live store data from MongoDB:

INVENTORY:
${JSON.stringify(products, null, 2)}

RECENT SALES:
${JSON.stringify(sales, null, 2)}

INSTRUCTIONS:
1. Selected Language: ${language || 'Hinglish'}.
2. If Hinglish: Reply in conversational Hinglish (Roman script, e.g. "Rice ka stock 10 kg bacha hai").
3. If English: Reply in simple, clear English.
4. If an item is missing or low in stock, clearly inform the user.
`;

    const prompt = `${systemPrompt}\n\nUser Question: ${query}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;