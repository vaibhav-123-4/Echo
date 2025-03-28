import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginForm from "../components/login-page"
import Cookies from "js-cookie";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await login({
        email,
        password
      });

      if (data.error) {
        throw new Error(data.error.message || "Login failed");
      }
      
      // Store the session in cookies
      Cookies.set('access_token', data.session.access_token, { expires: 7 });
      Cookies.set('refresh_token', data.session.refresh_token, { expires: 30 });
      
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      setTimeout(() => navigate("/home"), 1000);
      
    } catch (err: any) {
      toast.error(err.message || "An error occurred during login", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm 
        email={email} 
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loading={loading}
    />
  );
};

export default Login;
