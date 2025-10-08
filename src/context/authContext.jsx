import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Added role state
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Validate token with backend
  const validateToken = async (savedToken) => {

    try {
      const response = await axios.get(`${API_URL}/users/validate`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
      });

      // toast.success("Session restored");

      setUser(response.data.user);
      setRole(response.data.user.role); // Set role state


      // Save in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("authRole", response.data.user.role);
      return true;
    } catch (err) {
      console.error("Token validation failed:", err);
      toast.error("Session expired. Please login again.");
      return false;
    }
  };

  // 🔹 Load session on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedRole = localStorage.getItem("authRole"); // load saved role
    if (savedToken) {
      validateToken(savedToken).finally(() => {
        if (savedRole) setRole(savedRole); // fallback if needed
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      setToken(response.data.token);
      setUser(response.data.user);
      setRole(response.data.user.role); // Set role state


      // Save in localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("authRole", response.data.user.role);

      toast.success("Login successful!");
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.clear();
    toast("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);