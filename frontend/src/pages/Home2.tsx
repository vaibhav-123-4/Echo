import { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const Home = () => {
  const { logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<LikedPosts>({});
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, number>>({});
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

  interface Post {
    id: number;
    pic?: string;
    caption: string;
    likes: number;
  }

  interface LikedPosts {
    [key: number]: boolean;
  }

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

  return (
    <div></div>
    
    // <div>
    //   <h1 className="page-header">Home Page</h1>

    //   <div className="mb-6 flex justify-between">
    //     <button 
    //       onClick={() => setShowCreatePost(prev => !prev)}
    //       className="button-primary"
    //     >
    //       {showCreatePost ? "Cancel" : "Create Post"}
    //     </button>
    //     <button 
    //       onClick={handleLogout}
    //       className={loading ? "button-disabled" : "button-primary"}
    //     >
    //       {loading ? "Logging Out" : "Log Out"}
    //     </button>
    //   </div>

    //   {showCreatePost && <CreatePost />}

    //   {loading && <p className="loading-message">Loading posts...</p>}
    //   {error && <p className="error-message">{error}</p>}
    //   {!loading && posts.length === 0 && !error && <p className="no-posts-message">No posts yet.</p>}
    //   {!loading && posts.length > 0 && (
    //     <BentoGrid className="bento-grid">
    //       {posts.map((post, i) => (
    //         <BentoGridItem
    //           key={i}
    //           image={post.pic || undefined}
    //           title={`${post.caption}`}
    //           likes={likes[post.id]}
    //           comments={0}
    //           onLike={() => handleLike(post.id)}
    //           className="bento-grid-item"
    //         />
    //       ))}
    //     </BentoGrid>
    //   )}
    // </div>
  );
};

export default Home;
