import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<{
  user: UserPros | null;
  signup: (userData: UserPros) => Promise<void>;
  login: (userData: UserPros) => Promise<{ user: UserPros | null; error: any }>;
  logout: () => void;
}>({
  user: null,
  signup: async () => {},
  login: async () => ({ user: null, error: null }),
  logout: () => {},
});

interface UserPros {
  email: string,
  password: string
}

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPros | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (userData: UserPros) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const login = async (userData: UserPros) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { user: userData, error: null };  // Return the user object
    } catch (error) {
      return { user: null, error };  // Return the error if something goes wrong
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
