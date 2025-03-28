"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { FileUpload } from "./file-upload"

interface CreatePostModalProps {
  onClose: () => void
  onSubmit: (caption: string, file: File | null) => void
}

export default function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(caption, file)
  }

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-900 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-1">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write a caption..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Upload Image</label>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <FileUpload onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!caption || !file}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

