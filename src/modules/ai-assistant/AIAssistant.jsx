import React, { useState, useEffect, useRef } from 'react';
import { askGemini } from './geminiService';
import './AIAssistant.css';

// Professional Modern Vector Icons
const Icons = {
  Menu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Bot: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2"></circle>
    </svg>
  ),
  Attachment: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  Camera: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
  Mic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  ThumbsUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
  ),
  ThumbsDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Speaker: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  ),
  Trophy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34"></path>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
    </svg>
  )
};
const ProIcons = {
  Pin: ({ active }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  Archive: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1"></rect>
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path>
      <line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
  ),
  Unarchive: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 14 4 9 9 4"></polyline>
      <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
    </svg>
  ),
  Chat: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Paperclip: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
      <circle cx="9" cy="9" r="2"></circle>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
  ),
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z"></path>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
    </svg>
  ),
  Document: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  )
};
const AIAssistant = () => {
  const [language, setLanguage] = useState('Hinglish');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! Main aapka shop assistant hoon. Stock ya sales ke baare me kuch bhi poochein.',
      liked: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
const [viewArchive, setViewArchive] = useState(false);
const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileAcceptType, setFileAcceptType] = useState("*");

  const togglePinChat = (index, e) => {
    e.stopPropagation();
    setHistory(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const toggleArchiveChat = (index, e) => {
    e.stopPropagation();
    setHistory(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, isArchived: !item.isArchived } : item))
    );
  };
  // Play & Win Quiz States
  const [showGameModal, setShowGameModal] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(15);
  const [streak, setStreak] = useState(0);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  const quizQuestions = [
    {
      q: "Grocery dukaan me Low Stock Alert ka sabse bada benefit kya hai?",
      options: [
        "Customer bina saaman ke wapas na laute",
        "Zyada space consume karna",
        "Saaman ki keemat double karna",
        "Billing speed slow karna"
      ],
      ans: 0,
      tip: "Stockout rokna retail sales bachane ka sabse important rule hai."
    },
    {
      q: "FMCG / Dairy items (Doodh, Dahi, Bread) ke liye kaunsa method use hota hai?",
      options: [
        "LIFO (Last In First Out)",
        "FIFO (First In First Out)",
        "Random Pick",
        "Highest Price First"
      ],
      ans: 1,
      tip: "Purana stock pehle bechne se expiry ka loss 0% ho jata hai."
    },
    {
      q: "Agar Maggi ka purchase price ₹10 aur selling price ₹15 hai, toh Gross Margin kitna hua?",
      options: ["₹5 (33.3%)", "₹10 (100%)", "₹2 (15%)", "₹0"],
      ans: 0,
      tip: "Profit = Selling Price - Cost Price (₹15 - ₹10 = ₹5)."
    },
    {
      q: "Dead Stock ka kya matlab hota hai?",
      options: [
        "Jo customer ka favourite ho",
        "Jo stock lambe samay se bik na raha ho",
        "Jo online order par aaya ho",
        "Free me mila sample item"
      ],
      ans: 1,
      tip: "Dead stock block hui working capital hoti hai, ispar discount nikalna behtar hai."
    },
    {
      q: "Barcode Scanner use karne ka sabse fast faayda kya hai?",
      options: [
        "Manual typing error khatam aur instant billing",
        "Store ka electricity bill kam karna",
        "Item ka weight badhana",
        "Free internet milna"
      ],
      ans: 0,
      tip: "Barcode system checkout time 70% fast kar deta hai."
    },
    {
      q: "Khata/Udhaar (Dues) collect karne ka sabse smart automated tarika?",
      options: [
        "Ghar jakar ladna",
        "WhatsApp automated payment reminder bhejna",
        "Saaman bechna band kar dena",
        "Register me pen se likhte rehna"
      ],
      ans: 1,
      tip: "Digital reminder 3x fast cash collection laata hai."
    },
    {
      q: "Inventory Turnover Ratio kya darshata hai?",
      options: [
        "Dukaan ka size kitna square feet hai",
        "Saal me kitni baar poora stock bik kar naya aaya",
        "Staff ki attendance",
        "Dukaan ka closing time"
      ],
      ans: 1,
      tip: "High turnover = Zyada tezi se bikne wala business aur zyada cash flow."
    }
  ];

  // Quiz timer
  useEffect(() => {
    let interval = null;
    if (showGameModal && !quizFinished && timer > 0 && selectedOption === null) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && selectedOption === null) {
      handleQuizAnswer(-1);
    }
    return () => clearInterval(interval);
  }, [showGameModal, timer, selectedOption, quizFinished]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition (Mic Input)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'English' ? 'en-US' : 'hi-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn("Speech error:", event.error);
        }
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  // Text-To-Speech strictly synchronized with selected Language Toggle
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      
      if (language === 'English') {
        utterance.lang = 'en-US';
      } else {
        const hasDevanagari = /[\u0900-\u097F]/.test(clean);
        utterance.lang = hasDevanagari ? 'hi-IN' : 'en-IN';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // New Chat session
  const handleNewChat = () => {
    if (messages.length > 1) {
      const summaryTitle = messages[1]?.text?.slice(0, 26) || 'Chat Session';
      setHistory(prev => [{ id: Date.now(), title: summaryTitle, data: messages }, ...prev]);
    }
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: language === 'English' 
          ? 'Hello! I am your store assistant. Ask me anything about stock, sales or dues.'
          : 'Namaste! Main aapka shop assistant hoon. Stock ya sales ke baare me kuch bhi poochein.',
        liked: null
      }
    ]);
    setSelectedFile(null);
  };

  // Copy Action
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Edit User Query Action (restores query to input field and focuses)
  const handleEditQuery = (text) => {
    const cleanedText = text.replace(/^\[Attached.*?\]\s*/, '');
    setInput(cleanedText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Feedback Toggle
  const handleFeedback = (id, type) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, liked: m.liked === type ? null : type } : m))
    );
  };

  // Export Conversation
  const handleExportChat = () => {
    const chatText = messages
      .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shop-Chat-${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Camera Toggle
  const toggleCamera = async () => {
    if (isCameraOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setIsCameraOpen(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        }, 150);
      } catch (err) {
        alert("Camera permission blocked ya camera unavailable.");
      }
    }
  };

  // Main Handle Send Controller with Strict Language Enforcement
  const handleSend = async (overridePrompt) => {
    const textQuery = overridePrompt !== undefined ? overridePrompt : input;
    if ((!textQuery.trim() && !selectedFile) || loading) return;

    let fullPrompt = textQuery;
    let fileInfo = null;
    if (selectedFile) {
      fileInfo = { name: selectedFile.name, type: selectedFile.type };
      fullPrompt = `[Attached File: ${selectedFile.name}] ${textQuery}`;
    }

    // Force model language based on header toggle
    if (language === 'English') {
      fullPrompt = `${fullPrompt} (Please reply strictly in English language)`;
    } else {
      fullPrompt = `${fullPrompt} (Kripya Hinglish ya Hindi me jawab dein)`;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textQuery,
      file: fileInfo
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setLoading(true);

    try {
      const response = await askGemini(fullPrompt, language);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response,
        liked: null
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Auto-Speak AI response immediately
      speakText(response);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: language === 'English' 
            ? 'Please check your live backend connection.' 
            : 'Backend live connection check karein.', 
          liked: null 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quiz Answer Handler
  const handleQuizAnswer = (selectedIdx) => {
    setSelectedOption(selectedIdx);
    const isCorrect = selectedIdx === quizQuestions[quizIndex].ans;

    if (isCorrect) {
      const bonus = streak >= 2 ? 25 : 15;
      setQuizScore(prev => prev + bonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setTimer(15);
      } else {
        setQuizFinished(true);
      }
    }, 1400);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setStreak(0);
    setSelectedOption(null);
    setTimer(15);
    setQuizFinished(false);
    setShowGameModal(false);
  };

  const chips = language === 'English' ? [
    "Which items have low stock?",
    "What is the total store stock value?",
    "Show today's sales",
    "Which items are out of stock?"
  ] : [
    "Low stock items kaunse hain?",
    "Dukaan ka total stock value kitna hai?",
    "Aaj ke sales dikhao",
    "Kaunsa item out of stock hai?"
  ];

  return (
    <div className="assistant-wrapper">
      {/* Sidebar Overlay History */}
      {showHistory && (
        <aside className="assistant-sidebar">
          <div className="sidebar-header">
            <h4>{language === 'English' ? 'Past Chat Sessions' : 'Pichli Chat Sessions'}</h4>
            <button className="close-sidebar-btn" onClick={() => setShowHistory(false)}>✕</button>
          </div>
          {/* Tabs for Normal vs Archived */}
         {/* Tabs for Normal vs Archived */}
          <div className="sidebar-section-header">
            <button 
              type="button" 
              className={`archive-tab-btn ${!viewArchive ? 'active' : ''}`}
              onClick={() => setViewArchive(false)}
            >
              <ProIcons.Chat />
              <span>Chats</span>
            </button>
            <button 
              type="button" 
              className={`archive-tab-btn ${viewArchive ? 'active' : ''}`}
              onClick={() => setViewArchive(true)}
            >
              <ProIcons.Archive />
              <span>Archived</span>
            </button>
          </div>

          <div className="sidebar-list">
            {!viewArchive ? (
              <>
                {/* 1. PINNED SECTION */}
                {history && history.filter(item => item.isPinned && !item.isArchived).length > 0 && (
                  <div className="history-category">
                    <div className="section-label">
                      <ProIcons.Pin active={true} />
                      <span>Pinned</span>
                    </div>
                    {history.map((item, index) => {
                      if (!item.isPinned || item.isArchived) return null;
                      return (
                        <div
                          key={item.id || index}
                          className="history-card"
                          onClick={() => {
                            setMessages(item.data);
                            setShowHistory(false);
                          }}
                        >
                          <div className="card-info">
                            <span className="hist-icon"><ProIcons.Chat /></span>
                            <span className="hist-text">{item.title}</span>
                          </div>
                          <div className="card-actions">
                            <button
                              type="button"
                              className="action-icon-btn active"
                              title="Unpin"
                              onClick={(e) => togglePinChat(index, e)}
                            >
                              <ProIcons.Pin active={true} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Archive"
                              onClick={(e) => toggleArchiveChat(index, e)}
                            >
                              <ProIcons.Archive />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. RECENT SECTION */}
                <div className="history-category">
                  {history && history.filter(item => item.isPinned && !item.isArchived).length > 0 && (
                    <div className="section-label">Recent</div>
                  )}

                  {history.filter(item => !item.isArchived).length === 0 ? (
                    <p className="empty-history">
                      {language === 'English' ? 'No saved chats yet.' : 'Abhi tak koi chat save nahi hui.'}
                    </p>
                  ) : (
                    history.map((item, index) => {
                      if (item.isPinned || item.isArchived) return null;
                      return (
                        <div
                          key={item.id || index}
                          className="history-card"
                          onClick={() => {
                            setMessages(item.data);
                            setShowHistory(false);
                          }}
                        >
                          <div className="card-info">
                            <span className="hist-icon"><ProIcons.Chat /></span>
                            <span className="hist-text">{item.title}</span>
                          </div>
                          <div className="card-actions">
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Pin chat"
                              onClick={(e) => togglePinChat(index, e)}
                            >
                              <ProIcons.Pin active={false} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Archive"
                              onClick={(e) => toggleArchiveChat(index, e)}
                            >
                              <ProIcons.Archive />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* 3. ARCHIVED SECTION */
              <div className="history-category">
                <div className="section-label">
                  <ProIcons.Archive />
                  <span>Archived Chats</span>
                </div>
                {history.filter(item => item.isArchived).length === 0 ? (
                  <p className="empty-history">
                    {language === 'English' ? 'No archived chats.' : 'Koi archived chat nahi hai.'}
                  </p>
                ) : (
                  history.map((item, index) => {
                    if (!item.isArchived) return null;
                    return (
                      <div
                        key={item.id || index}
                        className="history-card"
                        onClick={() => {
                          setMessages(item.data);
                          setShowHistory(false);
                        }}
                      >
                        <div className="card-info">
                          <span className="hist-icon"><ProIcons.Archive /></span>
                          <span className="hist-text">{item.title}</span>
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="unarchive-pill-btn"
                            title="Unarchive"
                            onClick={(e) => toggleArchiveChat(index, e)}
                          >
                            <ProIcons.Unarchive />
                            <span>Restore</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Gamified Play & Win Pro Interactive Arena Modal */}
      {showGameModal && (
        <div className="modal-backdrop">
          <div className="quiz-modal-box">
            <div className="quiz-header">
              <div className="quiz-title-tag">
                <Icons.Trophy />
                <span>Retail Mastermind Arena</span>
              </div>
              <button className="close-modal-btn" onClick={() => setShowGameModal(false)}>✕</button>
            </div>

            {!quizFinished ? (
              <div className="quiz-body">
                <div className="quiz-stats-ribbon">
                  <span className="q-count">Q {quizIndex + 1}/{quizQuestions.length}</span>
                  <div className="timer-badge">⏱️ {timer}s</div>
                  <span className="streak-badge">🔥 {streak} Streak</span>
                  <span className="score-badge">Points: {quizScore}</span>
                </div>

                <div className="timer-progress-track">
                  <div className="timer-fill" style={{ width: `${(timer / 15) * 100}%` }}></div>
                </div>

                <h4 className="question-headline">{quizQuestions[quizIndex].q}</h4>

                <div className="quiz-options-list">
                  {quizQuestions[quizIndex].options.map((opt, i) => {
                    let btnClass = "quiz-opt-card";
                    if (selectedOption !== null) {
                      if (i === quizQuestions[quizIndex].ans) btnClass += " correct-opt";
                      else if (selectedOption === i) btnClass += " wrong-opt";
                      else btnClass += " faded-opt";
                    }
                    return (
                      <button
                        key={i}
                        className={btnClass}
                        disabled={selectedOption !== null}
                        onClick={() => handleQuizAnswer(i)}
                      >
                        <span className="opt-letter">{['A', 'B', 'C', 'D'][i]}</span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedOption !== null && (
                  <div className="explanation-pill">
                    💡 <strong>Tip:</strong> {quizQuestions[quizIndex].tip}
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-finish-arena">
                <div className="win-badge-icon">🏆</div>
                <h3>Grand Retail Score: {quizScore} XP</h3>
                <p>Aapki dukaan management knowledge rank: <strong>A+ Pro Retailer</strong></p>
                <div className="reward-coupon-box">
                  <span>Reward Coupon:</span>
                  <strong>GROCERY-AI-PRO</strong>
                </div>
                <button className="claim-action-btn" onClick={resetQuiz}>
                  Claim Reward & Return
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="assistant-card">
        {/* Top Header Card */}
        <div className="assistant-header">
          <div className="header-left-side">
            <button className="header-control-btn" onClick={() => setShowHistory(true)} title="History">
              <Icons.Menu />
              <span>Menu</span>
            </button>
            <button className="header-control-btn" onClick={handleNewChat} title="New Chat">
              <Icons.Plus />
              <span>New Chat</span>
            </button>
            
            {/* Professional AI Sparkle Avatar */}
            <div className="avatar-icon-box pro-ai-glow">
              <Icons.Bot />
            </div>

            <div className="header-text">
              <h2>AI Shop Assistant</h2>
              <p>Powered by Groq Open AI</p>
            </div>
          </div>

          <div className="header-right-side">
            <button className="export-btn" onClick={handleExportChat} title="Download Conversation">
              <Icons.Download />
              <span>Export</span>
            </button>
            <div className="lang-toggle-container">
              <button
                className={`lang-btn ${language === 'Hinglish' ? 'active' : ''}`}
                onClick={() => setLanguage('Hinglish')}
              >
                🌐 Hinglish
              </button>
              <button
                className={`lang-btn ${language === 'English' ? 'active' : ''}`}
                onClick={() => setLanguage('English')}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Live Camera Scanner Box */}
        {isCameraOpen && (
          <div className="camera-preview-container">
            <video ref={videoRef} autoPlay playsInline muted />
            <button className="close-camera-btn" onClick={toggleCamera}>✕ Close Camera</button>
          </div>
        )}

        {/* Chat Feed */}
        <div className="chat-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-row ${msg.sender}`}>
              {msg.sender === 'ai' && (
                <div className="bot-bullet pro-badge">
                  <Icons.Bot />
                </div>
              )}

              <div className="bubble-wrapper">
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.file && (
                    <div className="attached-file-preview">
                      <Icons.Attachment />
                      <span>{msg.file.name}</span>
                    </div>
                  )}
                  <span className="msg-text-content">{msg.text}</span>
                  {msg.sender === 'ai' && (
                    <button className="inline-speak-btn" onClick={() => speakText(msg.text)} title="Listen Answer">
                      <Icons.Speaker />
                    </button>
                  )}
                </div>

                {/* USER QUERY ACTIONS: Copy & Edit */}
                {msg.sender === 'user' && (
                  <div className="bubble-actions user-actions">
                    <button
                      className={`react-btn ${copiedId === msg.id ? 'copied' : ''}`}
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy my query"
                    >
                      <Icons.Copy />
                      {copiedId === msg.id && <span className="copy-tag">Copied!</span>}
                    </button>
                    <button
                      className="react-btn"
                      onClick={() => handleEditQuery(msg.text)}
                      title="Edit this query"
                    >
                      <Icons.Edit />
                    </button>
                  </div>
                )}

                {/* AI ACTIONS: Like, Dislike, Copy */}
                {msg.sender === 'ai' && (
                  <div className="bubble-actions">
                    <button
                      className={`react-btn ${msg.liked === 'up' ? 'active' : ''}`}
                      onClick={() => handleFeedback(msg.id, 'up')}
                      title="Helpful"
                    >
                      <Icons.ThumbsUp />
                    </button>
                    <button
                      className={`react-btn ${msg.liked === 'down' ? 'active' : ''}`}
                      onClick={() => handleFeedback(msg.id, 'down')}
                      title="Not helpful"
                    >
                      <Icons.ThumbsDown />
                    </button>
                    <button
                      className={`react-btn ${copiedId === msg.id ? 'copied' : ''}`}
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy text"
                    >
                      <Icons.Copy />
                      {copiedId === msg.id && <span className="copy-tag">Copied!</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-row ai">
              <div className="bot-bullet pro-badge pulse-dot">
                <Icons.Bot />
              </div>
              <div className="message-bubble ai typing">
                <span>
                  {language === 'English' ? 'AI is analyzing inventory...' : 'AI inventory analyse kar raha hai...'}
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Interactive Play & Win Ribbon */}
        <div className="gamify-bar">
          <button className="play-win-btn" onClick={() => setShowGameModal(true)}>
            <Icons.Trophy />
            <span>Play & Win</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chips-container">
          {chips.map((chip, idx) => (
            <button key={idx} className="chip-btn" onClick={() => handleSend(chip)}>
              ✦ {chip}
            </button>
          ))}
        </div>

        {/* Selected File Badge */}
        {selectedFile && (
          <div className="selected-attachment-bar">
            <span className="file-info-label">
              <Icons.Attachment />
              {selectedFile.name} (Attached)
            </span>
            <button className="remove-file-btn" onClick={() => setSelectedFile(null)}>✕</button>
          </div>
        )}

        {/* Bottom Input Controls */}
        <div className="input-toolbar-box">
         <input
  type="file"
  ref={fileInputRef}
  style={{ display: 'none' }}
  accept={fileAcceptType}
  onChange={handleFileChange}
/>
        <div className="attach-menu-wrapper" style={{ position: 'relative', display: 'inline-flex' }}>
          <button
            type="button"
            className={`tool-btn ${showAttachMenu ? 'cam-active' : ''}`}
            title="Attach Photo, Video or Document"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            <Icons.Attachment />
          </button>

          {showAttachMenu && (
            <div className="attach-dropdown-menu">
              <button
                type="button"
                className="attach-option-item"
                onClick={() => {
                  setFileAcceptType("image/*");
                  setShowAttachMenu(false);
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
              >
                <span className="opt-icon"><ProIcons.Image /></span>
                <span>Photo</span>
              </button>

              <button
                type="button"
                className="attach-option-item"
                onClick={() => {
                  setFileAcceptType("video/*");
                  setShowAttachMenu(false);
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
              >
                <span className="opt-icon"><ProIcons.Video /></span>
                <span>Video</span>
              </button>

              <button
                type="button"
                className="attach-option-item"
                onClick={() => {
                  setFileAcceptType(".pdf,.doc,.docx,.txt");
                  setShowAttachMenu(false);
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
              >
                <span className="opt-icon"><ProIcons.Document /></span>
                <span>PDF / Document</span>
              </button>
            </div>
          )}
        </div>

          <button
            className={`tool-btn ${isCameraOpen ? 'cam-active' : ''}`}
            onClick={toggleCamera}
            title="Scan with Camera"
          >
            <Icons.Camera />
          </button>

          <input
            ref={inputRef}
            type="text"
            className="main-chat-input"
            placeholder={language === 'English' ? "Ask about stock, dues or sales..." : "Stock, dues ya sales ke baare me poochein..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            className={`mic-tool-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleMic}
            title={isListening ? "Listening..." : "Click to Speak"}
          >
            <Icons.Mic />
          </button>

          <button className="send-tool-btn" onClick={() => handleSend()} title="Send">
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;