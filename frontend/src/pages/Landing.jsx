import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <h1 className="text-5xl font-bold text-white mb-8 animate-pulse">Welcome!</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-indigo-500 font-bold py-2 px-4 rounded shadow-lg hover:scale-110 transition duration-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-500 font-bold py-2 px-4 rounded shadow-lg hover:scale-110 transition duration-300"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Landing;
