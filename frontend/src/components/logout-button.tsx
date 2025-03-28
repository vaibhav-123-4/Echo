import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer", 
  children = "Logout"
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    
    navigate('/login');
  };

  return (
    <button 
      className={className}
      onClick={handleLogout}
    >
      {children}
    </button>
  );
};

export default LogoutButton;
