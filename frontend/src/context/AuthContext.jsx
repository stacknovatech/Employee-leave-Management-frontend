

import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "@/services/authService";

export const AuthContext = createContext(null);

/**
 * Backend se jo raw error aata hai (like MongoDB cast errors),
 * usse user-friendly message me convert karo
 */
function cleanUpErrorMessage(rawMessage) {
  if (!rawMessage) return "Something went wrong. Please try again.";

  // MongoDB ObjectId cast error - matlab galat ID diya hai
  if (rawMessage.includes("Cast to ObjectId failed")) {
    return "Invalid Manager ID. Please enter a valid ID provided by your manager.";
  }

  // duplicate email error
  if (rawMessage.includes("duplicate") || rawMessage.includes("E11000")) {
    return "This email is already registered. Please use a different email or login.";
  }

  // validation errors
  if (rawMessage.includes("validation failed")) {
    return "Please check your inputs. Some fields have invalid values.";
  }

  // password related
  if (rawMessage.includes("Password") || rawMessage.includes("password")) {
    return rawMessage; // ye already readable hota hai
  }

  // agar message already clean hai toh wahi return karo
  return rawMessage;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();
        setCurrentUser(response.data.user);
      } catch (err) {
        // token invalid ya expired - clean up
        console.error("Session expired, logging out...", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const response = await loginUser({ email, password });
      const { user, token } = response.data;

      // save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (err) {
      const rawMsg = err.response?.data?.message || "Login failed. Please try again.";
      const errorMsg = cleanUpErrorMessage(rawMsg);
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setAuthError(null);
    try {
      const response = await registerUser(formData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (err) {
      const rawMsg = err.response?.data?.message || "Registration failed. Please try again.";
      const errorMsg = cleanUpErrorMessage(rawMsg);
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setAuthError(null);
  }, []);

  // -- Context value --
  const contextValue = {
    currentUser,
    isLoading,
    authError,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isEmployee: currentUser?.role === "employee",
    isManager: currentUser?.role === "manager",
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
