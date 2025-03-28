"use client"

import type React from "react"
import { LogOut, PlusCircle } from "lucide-react"

interface LayoutProps {
    children: React.ReactNode;
    onCreatePost: () => void;
    onLogout: () => Promise<void>;
  }

export default function Layout({ children, onCreatePost }: LayoutProps) {
  const handleLogout = () => {
    // In a real app, you would implement actual logout logic here
    alert("Logged out successfully")
  }

  return (
    <div className="dark min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-purple-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
            <h1 className="text-xl font-bold text-white">PurpleGrid</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCreatePost}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Create Post</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Floating Create Post Button (Mobile) */}
      <button
        onClick={onCreatePost}
        className="fixed sm:hidden bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  )
}

