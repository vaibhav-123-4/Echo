"use client"

import { useState, useEffect } from "react"
import { LogOut, PlusCircle, X } from "lucide-react"
import LogoutButton from "../components/logout-button"
import axios from "axios"
import { toast } from "react-toastify"
import { FileUpload } from "../components/file-upload"

// Add a new utility function for image compression
const compressImage = (file: File, maxSizeMB: number = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1200; // Limit max dimension
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Adjust quality based on file size
        let quality = 0.7; // Start with 70% quality
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes) {
          quality = Math.min(maxSizeBytes / file.size, 0.7);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object from the compressed Blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
interface LayoutProps {
  children: React.ReactNode;
  setUser: (user: any | null) => void;
}

export default function Layout({ children, setUser }: LayoutProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Get current user from local storage on component mount
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);
  
  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      // Generate and display preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Show file size warning if too large
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB
        toast.warn("File size is large and will be compressed before upload", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    setLoading(true);

    try {
      // Compress the image before sending
      // const compressedImage = await compressImage(file, 1); // Compress to max 1MB
      const user_id = "9cf9e8ca-76c3-4342-851f-6473825605b0";

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("pic", file);
      
      const config = {
        headers: {
          'Accept': 'application/json',
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB max size for axios
        maxBodyLength: 10 * 1024 * 1024,
      };
      
      const response = await axios.post(
        `http://localhost:3000/posts/new/${user_id}`, 
        formData,
        config
      );

      console.log("Post created response:", response.data);
  
      toast.success("Post created successfully!", {
        position: "top-right",
        autoClose: 1000,
      });
  
      // Clear form and close modal after successful upload
      setCaption("");
      setFile(null);
      setFilePreview(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating post:", error);
      
      toast.error("Failed to create post. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFile(null);
    setFilePreview(null);
    setCaption("");
  };
  
  return (
    <div className="dark min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-purple-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
            <h1 className="text-xl font-bold text-white">Echo</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Create Post</span>
            </button>

            <LogoutButton 
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </LogoutButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Floating Create Post Button (Mobile) */}
      <button
        onClick={openCreateModal}
        className="fixed sm:hidden bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <PlusCircle className="h-6 w-6" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Create a Post</h2>
              <button 
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border p-3 w-full rounded-lg bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
              
              <div className="rounded-lg overflow-hidden">
                <FileUpload onChange={handleFileChange} />
                {filePreview && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-300 mb-2">
                      Selected file: {file?.name} ({((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                      
                    </div>
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md border border-gray-700"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={closeCreateModal}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

