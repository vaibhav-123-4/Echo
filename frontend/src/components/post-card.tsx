"use client"

import type React from "react"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  className?: string
  title?: string | React.ReactNode
  image?: string
  likes?: number
  comments?: number
  onLike?: () => void
  onComment?: () => void
}

export default function PostCard({
  className,
  title,
  image,
  likes = 0,
  comments = 0,
  onLike,
  onComment,
}: PostCardProps) {
  return (
    <div
      className={cn(
        "group/bento flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-purple-900/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={image || "/placeholder.svg?height=300&width=500"}
            alt={typeof title === "string" ? title : "Image"}
            className="object-cover transition-transform duration-700 group-hover/bento:scale-110"
          />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="font-medium text-white truncate">{title}</div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-gray-300 hover:text-purple-400 transition-colors"
          >
            <Heart className="h-4 w-4 transition-all duration-300 hover:fill-purple-500 hover:stroke-purple-500" />
            <span className="text-xs">{likes}</span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center gap-1.5 text-gray-300 hover:text-purple-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4 transition-all duration-300" />
            <span className="text-xs">{comments}</span>
          </button>

          <div className="ml-auto h-5 w-5 rounded-full bg-purple-600/20 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

