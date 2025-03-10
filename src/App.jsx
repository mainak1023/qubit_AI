"use client"

import { useState, useRef, useEffect } from "react"
import "./App.css"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import ParticleBackground from "./ParticleBackground"
import CommandPalette from "./CommandPalette"

function App() {
    const [chatHistory, setChatHistory] = useState([])
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [generatingAnswer, setGeneratingAnswer] = useState(false)
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

    const chatContainerRef = useRef(null)

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [chatHistory])

    async function generateAnswer(e) {
        e.preventDefault()
        if (!question.trim()) return

        setGeneratingAnswer(true)
        const currentQuestion = question
        setQuestion("") // Clear input immediately after sending

        // Add user question to chat history
        setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }])

        try {
            const API_KEY = import.meta.env.VITE_CH_KEY
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                method: "post",
                data: {
                    contents: [{ parts: [{ text: question }] }],
                },
            })

            const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"]
            setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }])
            setAnswer(aiResponse)
        } catch (error) {
            console.log(error)
            setChatHistory((prev) => [
                ...prev,
                {
                    type: "answer",
                    content: "Sorry - Something went wrong. Please try again!",
                },
            ])
        }
        setGeneratingAnswer(false)
    }

    const handleCommand = (commandId) => {
        switch (commandId) {
            case "clear":
                setChatHistory([])
                break
            case "help":
                setChatHistory((prev) => [
                    ...prev,
                    {
                        type: "answer",
                        content:
                            "# Available Commands\n\n- `/clear` - Clear chat history\n- `/help` - Show this help message\n- `/theme` - Toggle between light and dark mode\n- `/about` - Show information about Qubit AI\n\nYou can also press `Cmd+K` or `Ctrl+K` to open the command palette.",
                    },
                ])
                break
            case "about":
                setChatHistory((prev) => [
                    ...prev,
                    {
                        type: "answer",
                        content:
                            "# About Qubit AI\n\nQubit AI is powered by Google's Gemini 2.0 Flash model. It can help you with general knowledge questions, creative writing, problem-solving, and more.\n\nThis interface was designed with a futuristic, cyberpunk-inspired aesthetic to enhance your AI interaction experience.",
                    },
                ])
                break
            default:
                break
        }
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div id="particles-js" className="absolute inset-0 opacity-30"></div>
            </div>

            <ParticleBackground />

            <div className="h-full max-w-5xl mx-auto flex flex-col p-3 relative z-10">
                {/* Header with tech-inspired design */}
                <header className="text-center py-4 relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
                    <a
                        href="https://github.com/mainak1023/bingo_AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                    >
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 mr-2 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-300">
                                <div className="text-2xl font-mono animate-pulse">Q</div>
                            </div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 group-hover:from-purple-600 group-hover:via-blue-500 group-hover:to-cyan-400 transition-all duration-700">
                                Qubit AI
                            </h1>
                        </div>
                        <div className="text-xs text-blue-400 mt-1 opacity-70">Powered by Gemini 2.0</div>
                    </a>

                    <div className="absolute right-2 top-4 flex space-x-2">
                        <button
                            className="terminal-toggle p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-xs flex items-center"
                            onClick={() => setIsCommandPaletteOpen(true)}
                        >
                            <span className="mr-1">⌘</span>K
                        </button>
                    </div>
                </header>

                {/* Chat Container with cyberpunk styling */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-900 border border-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.3)] p-4 hide-scrollbar"
                >
                    {chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl border border-gray-700 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                                        <span className="text-2xl">🧠</span>
                                    </div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                        Quantum Interface
                                    </h2>
                                </div>

                                <p className="text-gray-400 mb-6">
                                    Access the quantum realm of information. What would you like to explore today?
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
                                        <span className="text-cyan-400 group-hover:text-cyan-300">💡</span>{" "}
                                        <span className="text-gray-300">Knowledge Base</span>
                                    </div>
                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
                                        <span className="text-cyan-400 group-hover:text-cyan-300">🔧</span>{" "}
                                        <span className="text-gray-300">Tech Solutions</span>
                                    </div>
                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
                                        <span className="text-cyan-400 group-hover:text-cyan-300">📝</span>{" "}
                                        <span className="text-gray-300">Content Generation</span>
                                    </div>
                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
                                        <span className="text-cyan-400 group-hover:text-cyan-300">🤔</span>{" "}
                                        <span className="text-gray-300">Problem Solving</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-center">
                                    <div className="px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-gray-400 text-sm flex items-center">
                                        <span className="mr-2">Press</span>
                                        <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mr-1">/</kbd>
                                        <span>to start</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`mb-6 ${chat.type === "question" ? "text-right" : "text-left"} animate-fadeIn`}
                                >
                                    <div className="flex items-center mb-1">
                                        {chat.type === "answer" && (
                                            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center mr-2 text-xs">Q</div>
                                        )}
                                        <div className={`text-xs ${chat.type === "question" ? "text-blue-400" : "text-cyan-400"}`}>
                                            {chat.type === "question" ? "YOU" : "QUBIT AI"}
                                        </div>
                                        {chat.type === "question" && (
                                            <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center ml-2 text-xs">
                                                <span className="text-xs">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={`inline-block max-w-[85%] p-4 rounded-lg overflow-auto hide-scrollbar ${chat.type === "question"
                                                ? "bg-blue-600 bg-opacity-30 border border-blue-500 text-white rounded-tr-none"
                                                : "bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none"
                                            }`}
                                    >
                                        <ReactMarkdown className="overflow-auto hide-scrollbar prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
                                            {chat.content}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    {generatingAnswer && (
                        <div className="text-left">
                            <div className="flex items-center mb-1">
                                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center mr-2 text-xs">Q</div>
                                <div className="text-xs text-cyan-400">QUBIT AI</div>
                            </div>
                            <div className="inline-block bg-gray-800 border border-gray-700 p-4 rounded-lg rounded-tl-none">
                                <div className="flex space-x-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form with futuristic design */}
                <form
                    onSubmit={generateAnswer}
                    className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-4 relative"
                >
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-white placeholder-gray-500"
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
                            ></textarea>
                            <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                                Press <kbd className="px-1 bg-gray-800 rounded text-xs">⏎</kbd> to send
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-20 ${generatingAnswer ? "opacity-50 cursor-not-allowed" : "relative overflow-hidden group"
                                }`}
                            disabled={generatingAnswer}
                        >
                            {!generatingAnswer && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}
                            <span className="relative z-10">{generatingAnswer ? "Processing..." : "Send"}</span>
                        </button>
                    </div>
                </form>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} onCommand={handleCommand} />
        </div>
    )
}

export default App

