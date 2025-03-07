"use client";
import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { auth, signInWithGoogle, logOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Send, LogOut, User } from "lucide-react";
import remarkGfm from "remark-gfm";

function App() {
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadChatHistory(user.uid);
      } else {
        setUser(null);
      }
    });
  }, []);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const API_KEY = import.meta.env.VITE_CH_KEY;
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: "You are a programming assistant. Always give well-structured coding solutions. " + question,
                },
              ],
            },
          ],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      const newChatHistory = [...chatHistory, { type: "answer", content: aiResponse }];

      setChatHistory(newChatHistory);
      localStorage.setItem("chatHistory", JSON.stringify(newChatHistory));
    } catch (error) {
      console.log(error);
      setChatHistory((prev) => [...prev, { type: "answer", content: "Something went wrong. Try again!" }]);
    }
    setGeneratingAnswer(false);
  }

  function loadChatHistory(userId) {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <button onClick={signInWithGoogle} className="bg-blue-600 px-6 py-3 rounded-md">
          Sign in to use AI
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="h-full max-w-5xl mx-auto flex flex-col p-3 relative z-10">
        {/* Header */}
        <header className="text-center py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
            Qubit AI
          </h1>
          <div className="relative">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="User"
                className="w-8 h-8 rounded-full border border-gray-500"
                onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
              />
              <User size={20} />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-md">
                <button onClick={logOut} className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-700">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Chat Section */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 p-4 hide-scrollbar">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`mb-4 flex ${chat.type === "question" ? "justify-end" : "justify-start"}`}>
              <div className={`chat-bubble ${chat.type}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={generateAnswer} className="input-box">
          <textarea
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="2"
          />
          <button type="submit">
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
