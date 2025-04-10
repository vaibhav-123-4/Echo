"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
import { BentoGrid } from "@/components/ui/bento-grid"
import PostCard from "@/components/post-card"
import Layout from "./layout"
import CreatePostModal from "@/components/create-post-modal"
import CommentModal from "../components/comment-modal"
import LogoutButton from "@/components/logout-button"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

interface Post {
  id: number;
  pic?: string;
  caption: string;
  likes: number;
  title?: string;
  image?: string;
}

interface LikedPosts {
  [key: number]: boolean;
}

interface Comment {
  id: number;
  user_id: string;
  posts_id: number;
  text: string;
  created_at: string;
  username?: string;
  users?: {
    username?: string;
    name?: string;
  };
}

export default function BentoGridDemo() {
  const [user, setUser] = useState<any>(null);
  const { user: authUser, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, number>>({});
  const [likedPosts, setLikedPosts] = useState<LikedPosts>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        console.log("Fetched posts:", response.data);

        const fetchedPosts: Post[] = Array.isArray(response.data.posts) ? response.data.posts : [];
        setPosts(fetchedPosts);

        const likesData = await Promise.all(
          fetchedPosts.map(async (post) => {
            const likesResponse = await axios.get(`http://localhost:3000/posts/likes/${post.id}`);
            return { [post.id]: likesResponse.data.likes };
          })
        );

        const commentsData = await Promise.all(
          fetchedPosts.map(async (post) => {
            const commentsResponse = await axios.get(`http://localhost:3000/posts/comments/${post.id}`);
            return { [post.id]: commentsResponse.data.comments.length };
          })
        );

        setLikes(Object.assign({}, ...likesData));
        setComments(Object.assign({}, ...commentsData));
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: number): Promise<void> => {
    if (!isAuthenticated) {
      toast.info("Please log in to like posts", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (likedPosts[postId]) {
      toast.info("You already liked this post", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const accessToken = Cookies.get('access_token');

      if (!accessToken) {
        toast.error("Authentication error. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      const response = await axios.post<{ success: boolean; likes: number }>(
        `http://localhost:3000/posts/likes/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200 && response.data.success) {
        setLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));

        toast.success("Post liked!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
        });
      }
    } catch (error: any) {
      console.error("Error liking the post:", error);
      const errorMessage = error.response?.data?.error || "Failed to like the post. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchComments = async (postId: number) => {
    setCommentLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/posts/comments/${postId}`);
      if (response.data && Array.isArray(response.data.comments)) {
        const commentsWithUsernames = response.data.comments.map((comment: Comment) => ({
          ...comment,
          username: comment.users?.username || "Anonymous User",
          name: comment.users?.name || "Anonymous",
          created_at: comment.created_at || new Date().toISOString(),
        }));
        setPostComments(commentsWithUsernames);
        setComments((prev) => ({ ...prev, [postId]: commentsWithUsernames.length }));
      } else {
        setPostComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setPostComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleComment = (postId: number): void => {
    console.log("Comment button clicked for post:", postId); // Add debug log

    if (!isAuthenticated) {
      toast.info("Please log in to comment", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    setCurrentPostId(postId);
    fetchComments(postId);
    setIsCommentModalOpen(true);
    console.log("Modal should be open:", postId, isCommentModalOpen); // Debug modal state
  };

  const handleAddComment = async (comment: string) => {
    if (!currentPostId || !isAuthenticated) {
            toast.error("You must be logged in to comment", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const accessToken = Cookies.get('access_token');

      if (!accessToken) {
        toast.error("Authentication error. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }
  
      // Send the comment with the correct field name 'text'
      const response = await axios.post(
        `http://localhost:3000/posts/comments/${currentPostId}/e7188bc4-98b5-40c1-b07c-791e48836de5`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Comment response:", response.data);
      if (response.status === 200 || response.status === 201) {
        // Refresh comments after adding
        fetchComments(currentPostId);
        toast.success("Comment added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
     
    } catch (error: any) {
      console.error("Error adding comment:", error);
      const errorMessage = error.response?.data?.error || "Failed to add comment. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setCurrentPostId(null);
    setPostComments([]);
  };

  const handleCreatePost = (caption: string, file: File | null) => {
    if (!isAuthenticated || !authUser) {
      toast.info("Please log in to create posts", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (caption && file) {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("pic", file);

      try {
        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
          toast.error("Authentication error. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/login");
          return;
        }

        const user_id = authUser.id;
        axios
          .post(`http://localhost:3000/posts/new/${user_id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${accessToken}`
            },
          })
          .then((response) => {
            if (response.data) {
              const newPost = {
                id: response.data.id || Date.now(),
                caption: caption,
                image: URL.createObjectURL(file),
                likes: 0,
              };
              setPosts((prev) => [newPost, ...prev]);
              setLikes((prev) => ({ ...prev, [newPost.id]: 0 }));
              setComments((prev) => ({ ...prev, [newPost.id]: 0 }));
              toast.success("Post created successfully!", {
                position: "top-right",
                autoClose: 1000,
              });
            }
          })
          .catch((error) => {
            console.error("Error creating post:", error);
            toast.error("Failed to create post. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          });
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Failed to create post. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
    setIsCreateModalOpen(false);
  };

  return (
    <Layout setUser={setUser}>
      <div className="dark min-h-screen bg-gray-950 py-10 px-4">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading posts...</div>
        ) : (
          <BentoGrid className="max-w-7xl mx-auto">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title || post.caption}
                image={post.pic || post.image || "/placeholder.svg?height=300&width=500"}
                likes={likes[post.id] || 0}
                comments={comments[post.id] || 0}
                isLiked={!!likedPosts[post.id]}
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
              />
            ))}
          </BentoGrid>
        )}
      </div>
      {isCommentModalOpen && currentPostId !== null && (
        <CommentModal
          postId={currentPostId}
          comments={postComments}
          loading={commentLoading}
          onClose={closeCommentModal}
          onAddComment={handleAddComment}
        />
      )}
      <footer className="text-center text-gray-500 mt-10">
        <p>&copy; {new Date().getFullYear()} Echo. All rights reserved.</p>
        <p>Made by Vaibhav</p>
      </footer>
    </Layout>
  )
}

