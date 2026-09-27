import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Send, Loader2, Bot, Sparkles, Globe } from 'lucide-react';
import { askGemini } from './geminiService';
import './AIAssistant.css';

const AIAssistant = () => {
  const [language, setLanguage] = useState('Hinglish'); // Default language state
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: 'Namaste! Main aapka shop assistant hoon. Stock ya sales ke baare me kuch bhi poochein.' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Quick Suggestion Chips (Language ke hisaab se)
  const suggestions = language === 'Hinglish' 
    ? [
        'Low stock items kaunse hain?',
        'Dukaan ka total stock value kitna hai?',
        'Aaj ke sales dikhao',
        'Kaunsa item out of stock hai?'
      ]
    : [
        'What are the low stock items?',
        'Total inventory valuation?',
        'Show today’s sales statistics',
        'Which products are out of stock?'
      ];

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'Hinglish' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Hinglish' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (manualText) => {
    const query = manualText || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Current selected language pass ho rahi hai
      const aiReply = await askGemini(query, language);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      speakText(aiReply);
    } catch (err) {
      const errorMsg = language === 'Hinglish' 
        ? '⚠️ AI se connect nahi ho paya. Kripya punah prayas karein.' 
        : '⚠️ Unable to connect to AI. Please try again.';
      setMessages((prev) => [...prev, { sender: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* 1. Header with Language Switcher */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-header-icon">
            <Bot size={26} color="#ffffff" />
          </div>
          <div className="ai-header-text">
            <h2>AI Shop Assistant</h2>
            <p>Powered by Google Gemini</p>
          </div>
        </div>

        {/* English / Hinglish Toggle Button */}
        <div className="language-selector">
          <Globe size={14} />
          <button 
            type="button"
            className={`lang-btn ${language === 'Hinglish' ? 'active' : ''}`}
            onClick={() => setLanguage('Hinglish')}
          >
            Hinglish
          </button>
          <button 
            type="button"
            className={`lang-btn ${language === 'English' ? 'active' : ''}`}
            onClick={() => setLanguage('English')}
          >
            English
          </button>
        </div>
      </div>

      {/* 2. Chat Area */}
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble-wrapper ${msg.sender}`}>
            {msg.sender === 'ai' && (
              <div className="avatar ai-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.sender === 'ai' && (
                <button 
                  className="speak-btn" 
                  onClick={() => speakText(msg.text)} 
                  title="Listen"
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble-wrapper ai">
            <div className="avatar ai-avatar">
              <Bot size={16} />
            </div>
            <div className="chat-bubble ai loading">
              <Loader2 className="spinner" size={16} /> {language === 'Hinglish' ? 'Soch raha hoon...' : 'Processing...'}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Quick Suggestion Pills */}
      <div className="suggestions-container">
        {suggestions.map((prompt, i) => (
          <button 
            key={i} 
            className="suggestion-chip" 
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
          >
            <Sparkles size={12} /> {prompt}
          </button>
        ))}
      </div>

      {/* 4. Input Row */}
      <div className="input-bar">
        <input
          type="text"
          placeholder={language === 'Hinglish' ? 'Stock, dues ya sales ke baare me poochein...' : 'Ask about stock, sales or dues...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className={`mic-btn ${isListening ? 'active' : ''}`}
          onClick={toggleListening}
          type="button"
          title={isListening ? 'Listening...' : 'Click to Speak'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button 
          className="send-btn" 
          onClick={() => handleSend()} 
          disabled={isLoading || !inputText.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;