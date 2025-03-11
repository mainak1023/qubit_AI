"use client"

import { useState, useEffect, useRef } from "react"

export default function CommandPalette({ onCommand, isOpen, setIsOpen }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeIndex, setActiveIndex] = useState(0)
    const inputRef = useRef(null)
    const commandListRef = useRef(null)

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
        // Reset active index when filtered results change
        setActiveIndex(0)
    }, [searchTerm])

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
            setSearchTerm("")
        }
    }, [isOpen])

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((prevIndex) => (prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
        } else if (e.key === "Enter" && filteredCommands.length > 0) {
            e.preventDefault()
            executeCommand(filteredCommands[activeIndex].id)
        }
    }

    useEffect(() => {
        // Scroll active item into view
        if (commandListRef.current && filteredCommands.length > 0) {
            const activeElement = commandListRef.current.querySelector(`[data-index="${activeIndex}"]`)
            if (activeElement) {
                activeElement.scrollIntoView({ block: "nearest" })
            }
        }
    }, [activeIndex])

    const executeCommand = (commandId) => {
        onCommand(commandId)
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "zoomIn 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards" }}
            >
                <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Search commands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div ref={commandListRef} className="max-h-72 overflow-y-auto scrollbar-thin">
                    {filteredCommands.length > 0 ? (
                        <ul>
                            {filteredCommands.map((command, index) => (
                                <li key={command.id} data-index={index}>
                                    <button
                                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${index === activeIndex
                                                ? "bg-gray-100 dark:bg-gray-800/70"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            }`}
                                        onClick={() => executeCommand(command.id)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                    >
                                        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 text-xl">
                                            {command.icon}
                                        </span>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{command.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{command.description}</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 mb-1 opacity-70"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <p>No commands found</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Try a different search term</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                >
                                    <path d="m12 19-7-7 7-7" />
                                    <path d="M19 12H5" />
                                </svg>
                            </kbd>
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                >
                                    <path d="m12 5 7 7-7 7" />
                                    <path d="M5 12h14" />
                                </svg>
                            </kbd>
                        </div>
                        <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </kbd>
                        <span>to select</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            Esc
                        </kbd>
                        <span>to close</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

