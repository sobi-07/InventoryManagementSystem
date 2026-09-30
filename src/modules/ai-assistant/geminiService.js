const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const fetchLiveProducts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error("Backend fetch error:", err);
    return [];
  }
};

export const askGemini = async (prompt) => {
  if (!GROQ_API_KEY) {
    return "API Key missing hai, kripya check karein.";
  }

  const products = await fetchLiveProducts();

  let storeContext = "";
  if (products.length > 0) {
    let totalStockValue = 0;
    const lowStockItems = [];

    const productDetails = products.map(p => {
      const stockVal = (p.stock || 0) * (p.price || 0);
      totalStockValue += stockVal;
      const threshold = p.minStockThreshold || 5;
      if ((p.stock || 0) <= threshold) {
        lowStockItems.push(`${p.name} (${p.stock} bacha hai)`);
      }
      return `- ${p.name}: Stock = ${p.stock} ${p.unit || 'units'}, Price = ₹${p.price}, Min Threshold = ${threshold}`;
    }).join("\n");

    storeContext = `
Dukaan ka live inventory data:
${productDetails}
Kul stock value: ₹${totalStockValue}
Kam stock wale items: ${lowStockItems.length > 0 ? lowStockItems.join(", ") : "Sabhi items sufficient hain."}
`;
  } else {
    storeContext = "Dukaan mein abhi koi items listed nahi hain.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `Aap ek professional grocery shop AI manager ho. 
Dukaan ke real-time database summary ke aadhar par jawab dein:
${storeContext}

CRITICAL LANGUAGE & VOICE RULES:
1. User ne jis bhasha aur script me sawal poocha hai, STRICTLY usi me jawab dein:
   - Agar user Shuddh Hindi (Devanagari) me pooche: Toh Shuddh Hindi me jawab dein (e.g. "मैगी का 20 किग्रा स्टॉक उपलब्ध है।").
   - Agar user Hinglish (Roman Hindi) me pooche: Toh Hinglish me jawab dein (e.g. "Maggi ka 20 kg stock bacha hai.").
   - Agar user English me pooche: Toh pure English me answer karein (e.g. "Maggi has 20 kg in stock.").
2. Jawab short, crisp aur practical rakhein (1-2 sentences) taaki bolne me natural lage.`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("AI Assistant Error:", err);
    return "Maaf kijiye, system busy hai. Kripya dobara koshish karein.";
  }
};