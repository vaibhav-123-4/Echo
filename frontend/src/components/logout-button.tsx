import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer", 
  children = "Logout"
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { success } = logout();
      if (!success) throw Error('Error while logging out');
      localStorage.removeItem("user");
      
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout. Please try again.");
      toast.error("Failed to logout. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : children}
    </button>
  );
};

export default LogoutButton;
