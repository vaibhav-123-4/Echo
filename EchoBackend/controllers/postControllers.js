import { supabase } from "file:///C:/Users/Vaibhav%20Sharma/Desktop/codes/Echo/EchoBackend/app/supabase.js";

import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createPost = async (req, res) => {
  try {
    // Use multer to handle file upload
    upload.single('pic')(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
      }

      const { caption } = req.body;
      const user_id = req.params.user_id;

      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: Please log in" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Generate a unique filename
      const fileName = `${user_id}_${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = `${user_id}/${fileName}`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(400).json({ error: uploadError.message });
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Insert post into Supabase database
      const { data, error } = await supabase
        .from("posts")
        .insert([{ pic: imageUrl, caption, user_id }])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        message: "Post created successfully",
        post: data,
      });
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 📜 Fetch all posts
export const getPosts = async (req, res) => {
  try {
    console.log("Fetching posts...");

    const { data, error } = await supabase
      .from("posts")
      .select("*");

    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Fetched Posts:", data);
    res.status(200).json({ posts: data });
  } catch (err) {
    console.error("Unexpected Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ❌ Delete a post (Only if the user owns it)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.params.user_id;

    if (!id) return res.status(400).json({ error: "Post ID is required" });
    if (!user_id) return res.status(401).json({ error: "Unauthorized: Please log in" });

    // Validate UUID
    const isValidUUID = (str) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    // Fetch the post to check ownership before deleting
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("user_id, pic")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user_id !== user_id) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own posts" });
    }

    // Extract the file path from the URL to delete from storage
    const imageUrl = post.pic;
    const filePath = imageUrl.split('/').slice(-2).join('/'); // Gets the user_id/filename format

    // Delete image from storage bucket
    const { error: storageError } = await supabase.storage
      .from('posts')
      .remove([filePath]);
      
    if (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue with post deletion even if image deletion fails
    }

    // Delete post from database
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", id);

    if (deleteError) {
      console.error("Supabase error:", deleteError);
      return res.status(400).json({ error: deleteError.message });
    }

    res.status(200).json({
      message: `Post with id ${id} deleted successfully.`,
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
