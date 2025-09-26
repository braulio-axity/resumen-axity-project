import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/context/AuthContext";
import { configureApiAuth } from "@/api/technologies";
import './index.css'
import App from './App.tsx'
import { TechnologiesProvider } from "./context/TechnologiesContext.tsx";

configureApiAuth(() => localStorage.getItem("token"));

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <TechnologiesProvider>
        <App />
      </TechnologiesProvider>
    </AuthProvider>
  </React.StrictMode>
);
