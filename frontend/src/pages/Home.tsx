"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
import { BentoGrid } from "@/components/ui/bento-grid"
import PostCard from "@/components/post-card"
import Layout from "./layout"
import CreatePostModal from "@/components/create-post-modal"

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

export default function BentoGridDemo() {
  const { logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, number>>({});
  const [likedPosts, setLikedPosts] = useState<LikedPosts>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/posts")
      .then(response => {
        console.log("Fetched posts:", response.data);
        const fetchedPosts: Post[] = Array.isArray(response.data.posts) ? response.data.posts : [];
        setPosts(fetchedPosts);
        setLikes(fetchedPosts.reduce((acc, post) => ({ ...acc, [post.id]: post.likes }), {}));
        setComments(fetchedPosts.reduce((acc, post) => ({ ...acc, [post.id]: Math.floor(Math.random() * 20) + 1 }), {}));
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId: number): Promise<void> => {
    if (likedPosts[postId]) return;

    try {
      const response = await axios.post<{ success: boolean }>(`http://localhost:3000/posts/likes/${postId}`);
      if (response.status === 200 && response.data.success) {
        setLikes((prev) => ({ ...prev, [postId]: prev[postId] + 1 }));
        setLikedPosts({ ...likedPosts, [postId]: true });
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleComment = (postId: number): void => {
    setComments((prev) => ({ ...prev, [postId]: prev[postId] + 1 }));
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { success } = logout();
      if (!success) throw Error('Error while logging out');
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = (caption: string, file: File | null) => {
    if (caption && file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just create a new post with the file URL
      const newPost = {
        id: posts.length + 1,
        title: caption,
        caption: caption,
        image: URL.createObjectURL(file),
        likes: 0
      };

      setPosts((prev) => [newPost, ...prev]);
      setLikes((prev) => ({ ...prev, [newPost.id]: 0 }));
      setComments((prev) => ({ ...prev, [newPost.id]: 0 }));
      setIsCreateModalOpen(false);
    }
  }

  return (
    <Layout onCreatePost={() => setIsCreateModalOpen(true)} onLogout={handleLogout}>
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
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
              />
            ))}
          </BentoGrid>
        )}
      </div>

      {isCreateModalOpen && <CreatePostModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePost} />}
    </Layout>
  )
}

