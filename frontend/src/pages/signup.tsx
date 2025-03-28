import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignUpPage from "../components/signup-page";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await signup({
        name,
        email,
        password,
      });
      
      const { data } = response;
      
      if (data.error) {
        throw new Error(data.error.message || "Signup failed");
      }
      
      if (data.session) {
        Cookies.set('access_token', data.session.access_token, { expires: 7 });
        Cookies.set('refresh_token', data.session.refresh_token, { expires: 30 });
        
        toast.success("Sign up successful! Navigating to home page!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during signup", {
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
    <SignUpPage
      name={name}
      setName={setName}
      email={email} 
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSignUp={handleSignup}
      loading={loading}
    />
  );
};

export default Signup;
