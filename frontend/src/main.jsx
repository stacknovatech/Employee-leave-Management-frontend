
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import SocketListener from "@/components/SocketListener";

// react-query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// create a single QueryClient instance for the app
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketListener />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
