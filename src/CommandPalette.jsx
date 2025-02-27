"use client"

import { useState, useEffect, useRef } from "react"

export default function CommandPalette({ onCommand, isOpen, setIsOpen }) {
    const [searchTerm, setSearchTerm] = useState("")
    const inputRef = useRef(null)

    const commands = [
        { id: "clear", name: "Clear chat", description: "Clear all chat history", icon: "🧹" },
        { id: "help", name: "Help", description: "Show available commands", icon: "❓" },
        { id: "theme", name: "Toggle theme", description: "Switch between light and dark mode", icon: "🌓" },
        { id: "about", name: "About", description: "About Qubit AI", icon: "ℹ️" },
    ]

    const filteredCommands = commands.filter(
        (command) =>
            command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            command.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen(!isOpen)
            }

            if (e.key === "Escape" && isOpen) {
                setIsOpen(false)
            }

            if (e.key === "/" && !isOpen && !e.target.closest("textarea")) {
                e.preventDefault()
                setIsOpen(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, setIsOpen])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
                            placeholder="Search commands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                        <ul>
                            {filteredCommands.map((command) => (
                                <li key={command.id}>
                                    <button
                                        className="w-full text-left p-3 hover:bg-gray-800 flex items-center transition-colors"
                                        onClick={() => {
                                            onCommand(command.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        <span className="mr-3 text-xl">{command.icon}</span>
                                        <div>
                                            <div className="font-medium text-white">{command.name}</div>
                                            <div className="text-sm text-gray-400">{command.description}</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-400">No commands found</div>
                    )}
                </div>

                <div className="p-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                    <div>
                        <kbd className="px-2 py-1 bg-gray-800 rounded mr-1">↑</kbd>
                        <kbd className="px-2 py-1 bg-gray-800 rounded mr-1">↓</kbd>
                        to navigate
                    </div>
                    <div>
                        <kbd className="px-2 py-1 bg-gray-800 rounded mr-1">Enter</kbd>
                        to select
                    </div>
                    <div>
                        <kbd className="px-2 py-1 bg-gray-800 rounded">Esc</kbd>
                        to close
                    </div>
                </div>
            </div>
        </div>
    )
}

