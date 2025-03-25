import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface SignupResponse {
    error?: {
      message: string;
    };
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = (await signup({ email, password }).catch((err) => ({
      error: { message: err.message || "An error occurred" },
    }))) as SignupResponse;
    
    if (response?.error) {
      return alert(response.error.message);
    }
  
    alert("Sign up successful! Navigating to login page!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse">
      <div className="bg-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition duration-500">
        <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          Signup
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
