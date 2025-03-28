import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import Signup from "./pages/signup";

import HeroGeometric from "./pages/HeroGeometric"
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccessRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  console.log(auth)
  return auth && auth.user ? <Navigate to="/home" /> : children ;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  console.log(auth);
  return auth && auth.user ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <AccessRoute>
              <HeroGeometric 
                badge="Made By Vaibhav"
                title1="WELCOME"
                title2="to Echo"
              />
            </AccessRoute>
          } />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<AccessRoute><Login /></AccessRoute>} />
          <Route path="/signup" element={<AccessRoute><Signup /></AccessRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
}
</>
  );
};

export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import Home from "./Home";
// import Login from "./Login";
// import Signup from "./Signup";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

