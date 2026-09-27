import { useState } from "react";
import "../AIAssistant.css";

function AIAssistant({ onBack }) {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(
    "Hi! 👋 I'm your ShopManager AI Assistant. Ask me about sales, stock, products or your shop."
  );

  const getAnswer = (text) => {
    const question = text.toLowerCase();

    if (question.includes("sales")) {
      return "📈 Your sales are performing well. Sales are up 18.4% compared with the previous period.";
    }

    if (
      question.includes("stock") ||
      question.includes("inventory")
    ) {
      return "📦 You currently have 14 low-stock products. Pepsi, Milk and Maggi should be restocked soon.";
    }

    if (
      question.includes("product") ||
      question.includes("best")
    ) {
      return "🏆 Your best-selling products are Maggi, Pepsi, Parle-G and Milk.";
    }

    if (
      question.includes("pepsi") ||
      question.includes("maggi")
    ) {
      return "💡 Maggi and Pepsi are among your fastest-selling products. Consider keeping extra stock.";
    }

    if (
      question.includes("today") ||
      question.includes("revenue")
    ) {
      return "💰 Today's revenue is ₹8,450 from 37 bills.";
    }

    if (
      question.includes("hello") ||
      question.includes("hi")
    ) {
      return "👋 Hello! I'm ready to help you manage your shop.";
    }

    return "🤖 I can help you with sales, inventory, low stock, products and business insights. Try asking: 'What are my best-selling products?'";
  };

  const handleAsk = () => {
    if (!message.trim()) return;

    setAnswer(getAnswer(message));
    setMessage("");
  };

  const askQuestion = (question) => {
    setAnswer(getAnswer(question));
  };

  return (
    <div className="ai-page">

      <button className="ai-back" onClick={onBack}>
        ← Dashboard
      </button>

      <div className="ai-container">

        <div className="ai-header">

          <div className="big-ai-icon">
            🤖
          </div>

          <p className="ai-label">
            SHOPMANAGER AI
          </p>

          <h1>Your Smart Shop Assistant</h1>

          <p>
            Ask questions about your shop in simple language.
          </p>

        </div>


        <div className="chat-box">

          <div className="bot-message">

            <div className="bot-avatar">
              🤖
            </div>

            <div>
              <strong>ShopManager AI</strong>

              <p>{answer}</p>
            </div>

          </div>


          <div className="suggestions">

            <button onClick={() => askQuestion("How are my sales?")}>
              📈 How are my sales?
            </button>

            <button onClick={() => askQuestion("Which products are best?")}>
              🏆 Best products?
            </button>

            <button onClick={() => askQuestion("Which stock is low?")}>
              ⚠️ Low stock?
            </button>

            <button onClick={() => askQuestion("What is today's revenue?")}>
              💰 Today's revenue?
            </button>

          </div>


          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask something about your shop..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
            />

            <button onClick={handleAsk}>
              Ask AI →
            </button>

          </div>

        </div>


        <div className="ai-capabilities">

          <div>
            📊
            <strong>Sales Analysis</strong>
            <small>Understand your sales</small>
          </div>

          <div>
            📦
            <strong>Stock Insights</strong>
            <small>Find products needing attention</small>
          </div>

          <div>
            💡
            <strong>Recommendations</strong>
            <small>Get smart shop suggestions</small>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;