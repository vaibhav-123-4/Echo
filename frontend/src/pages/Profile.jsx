import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/${id}/username`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));

    axios.get(`http://localhost:3000/api/posts?user_id=${id}`)
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <h1>Profile: {user.username}</h1>
      <h2>Posts:</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.caption}</p>
          {post.pic && <img src={post.pic} alt="Post" width="200px" />}
        </div>
      ))}
    </div>
  );
};

export default Profile;
