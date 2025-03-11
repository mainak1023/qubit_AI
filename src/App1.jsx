"use client"

import { useState, useRef, useEffect } from "react"
import "./App.css"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { auth } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import CommandPalette from "./CommandPalette"

function App() {
  const [user, setUser] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [question, setQuestion] = useState("")
  const [generatingAnswer, setGeneratingAnswer] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("✅ User logged in:", currentUser.email)
        setUser(currentUser)
        loadChatHistory(currentUser.uid)
      } else {
        console.log("❌ No user found, logging out...")
        setUser(null)
        setChatHistory([])
        localStorage.removeItem("chatHistory")
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  async function generateAnswer(e) {
    e.preventDefault()
    if (!question.trim()) return

    setGeneratingAnswer(true)
    const currentQuestion = question
    setQuestion("")

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }])

    try {
      const API_KEY = import.meta.env.VITE_CH_KEY

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text:
                    "You are a programming assistant. Always give well-structured coding solutions. " + currentQuestion,
                },
              ],
            },
          ],
        },
      )

      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."
      const newChatHistory = [
        ...chatHistory,
        { type: "question", content: currentQuestion },
        { type: "answer", content: aiResponse },
      ]

      setChatHistory(newChatHistory)
      localStorage.setItem("chatHistory", JSON.stringify(newChatHistory))
    } catch (error) {
      console.log(error)
      setChatHistory((prev) => [...prev, { type: "answer", content: "Something went wrong. Try again!" }])
    }
    setGeneratingAnswer(false)
  }

  function loadChatHistory(userId) {
    try {
      const savedHistory = localStorage.getItem("chatHistory")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        if (Array.isArray(parsedHistory)) {
          setChatHistory(parsedHistory)
        } else {
          console.warn("⚠️ Invalid chat history format detected. Resetting...")
          localStorage.removeItem("chatHistory")
          setChatHistory([])
        }
      }
    } catch (error) {
      console.error("⚠️ Corrupted chat history detected! Resetting...")
      localStorage.removeItem("chatHistory")
      setChatHistory([])
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth)
      console.log("🔴 User logged out")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  function handleCommand(commandId) {
    switch (commandId) {
      case "clear":
        setChatHistory([])
        localStorage.removeItem("chatHistory")
        break
      case "help":
        setChatHistory((prev) => [
          ...prev,
          {
            type: "answer",
            content:
              "# Available Commands\n\n- `/clear` - Clear chat history\n- `/help` - Show this help message\n- `/theme` - Toggle dark/light mode\n- `/about` - About Qubit AI",
          },
        ])
        break
      case "theme":
        document.documentElement.classList.toggle("dark")
        break
      case "about":
        setChatHistory((prev) => [
          ...prev,
          {
            type: "answer",
            content:
              "# About Qubit AI\n\nQubit AI is an intelligent coding assistant powered by Google's Gemini model. It helps you with programming questions, code explanations, and technical solutions.",
          },
        ])
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="h-full max-w-5xl mx-auto flex flex-col p-3 relative z-10">
        <header className="text-center py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
            Qubit AI
          </h1>
          <div className="relative">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={user?.photoURL || "https://via.placeholder.com/40"}
                alt="User"
                className="w-8 h-8 rounded-full border border-gray-500"
                onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-md">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Logout
                </button>
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(true)
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  Commands
                </button>
              </div>
            )}
          </div>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 p-4 hide-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 mb-4 opacity-50"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No messages yet</h3>
              <p className="max-w-sm">
                Start a conversation by typing a message below. Ask about coding, programming concepts, or technical
                questions.
              </p>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 flex ${chat.type === "question" ? "justify-end" : "justify-start"}`}>
                <div className={`chat-bubble ${chat.type}`}>
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      children={String(chat.content || "⚠️ Error: Empty content detected!")}
                      remarkPlugins={[remarkGfm]}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          {generatingAnswer && (
            <div className="flex justify-start mb-4">
              <div className="chat-bubble answer">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={generateAnswer} className="input-box">
          <textarea
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                generateAnswer(e)
              }
            }}
          />
          <button type="submit" disabled={generatingAnswer || !question.trim()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-6 w-6 ${!question.trim() ? "text-gray-500" : "text-blue-500"}`}
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>

      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} onCommand={handleCommand} />
    </div>
  )
}

export default App

