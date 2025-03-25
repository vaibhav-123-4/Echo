import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);  // Ensures default state is an array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/posts")
      .then(response => {
        console.log("Fetched posts:", response.data);
        setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-300 to-purple-300 animate-pulse">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
        Home Page
      </h1>
      {loading && <p className="text-blue-500 text-xl">Loading posts...</p>}
      {error && <p className="text-red-500 text-xl">{error}</p>}
      {!loading && posts.length === 0 && !error && <p className="text-lg">No posts yet.</p>}
      {!loading && posts.length > 0 && (
        <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="border p-4 rounded-lg shadow-2xl transform hover:rotate-2 hover:scale-105 transition duration-300 bg-white">
              {post.pic ? (
                <img
                  src={post.pic}
                  alt="Post"
                  className="w-full h-40 object-cover rounded-md"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <p className="text-gray-500">No Image</p>
              )}
              <p className="mt-2 font-semibold">{post.caption}</p>
              <p className="text-sm text-gray-500">Likes: {post.likes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
