import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: number;
  user_id: string;
  posts_id: number;
  text: string;
  created_at: string;
  username?: string;
  name?: string;
}

interface CommentModalProps {
  postId: number;
  comments: Comment[];
  loading: boolean;
  onClose: () => void;
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  comments,
  loading,
  onClose,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Comments</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-white">
                    {comment.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(comment.created_at)}
                  </div>
                </div>
                <p className="mt-1 text-white/50 ">{comment.text}</p>
              </div>
            ))
          )}
        </div>
        
        {isAuthenticated && (
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
