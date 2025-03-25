import React from 'react'
import { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [pic, setPic] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
        const user_id = "9cf9e8ca-76c3-4342-851f-6473825605b0";
        await axios.post(`http://localhost:3000/posts/new/${user_id}`, { caption, pic });

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create a Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={pic}
          onChange={(e) => setPic(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
