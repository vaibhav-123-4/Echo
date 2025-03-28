import React, { useState, ChangeEvent } from 'react';
import axios from "axios";
import { toast } from "react-toastify"; 

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Convert file to Base64 string using FileReader
 

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const user_id = "9cf9e8ca-76c3-4342-851f-6473825605b0";
        
        await axios.post(`http://localhost:3000/posts/new/${user_id}`, {
          caption,
          pic: base64data,
        });
    
        toast.success("Post created successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
    
        // Optionally, clear the form fields after successful upload
        setCaption("");
        setFile(null);
      } catch (error) {
        console.error("Error creating post:", error);
        
        toast.error("Failed to create post. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    };
    reader.readAsDataURL(file);

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
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
