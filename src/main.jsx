"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App1.jsx"
import "./index.css"
import { ThemeProvider } from "./ThemeContext.jsx"
import LoginPage from "./LoginPage.jsx"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

// Create a root component that handles authentication
function Root() {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <App /> : <LoginPage />
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>,
)

