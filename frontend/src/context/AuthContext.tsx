import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface SignupResponse {
  user: Object;
  session: {
    access_token: string;
    refresh_token: string;
  };
  error?: {
    message: string;
  };
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends AuthCredentials {
  name: string;
}

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<any>;
  signup: (credentials: SignupCredentials) => Promise<any>;
  logout: () => {success: boolean};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const HOST = import.meta.env.VITE_BACKEND_HOST;

  //Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          // Just consider the user authenticated if the token exists
          // No backend validation needed
          setUser({});  // Set a placeholder user object
        } catch (error) {
          console.error("Error verifying authentication:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      const response = await axios.post<SignupResponse>(`${HOST}/auth/login`, credentials);
      if (response.data.session) {
        setUser({});  // Placeholder for user object
        return response;
      }
      return { data: { error: { message: "Login failed" } } };
    } catch (error: any) {
      return { data: { error: { message: error.message || "Login failed" } } };
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const { data } = await axios.post<SignupResponse>(`${HOST}/auth/signup`, credentials);

      if (data.error) {
        return { data };
      }

      const res = await axios.post<SignupResponse>(`${HOST}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      if (!res.data) {
        return { data: { error: { message: "Signup error" } } };
      }
      
      if (!res.data.session) {
        return { data: { error: { message: "No session token found" } } };
      }
      
      setUser({});  // Placeholder for user object
      return res;
    } catch (error: any) {
      return { data: { error: { message: error.message || "Signup failed" } } };
    }
  };

  const logout = () => {
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setUser(null);
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      signup,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
