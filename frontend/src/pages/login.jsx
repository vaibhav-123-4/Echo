import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./login-form";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login({ email, password });
    
    if (response?.error) { 
      console.error("Login error:", response.error);
      return alert(response.error.message);
    }
    
    if (response?.user) { 
      console.log("User logged in:", response.user);
      alert("Login successful!");
      navigate("/home");
    }
  };

  return (
    <LoginForm 
      email={email} 
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
};

export default Login;
