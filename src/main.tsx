import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/context/AuthContext";
import { configureApiAuth } from "@/api/apiClient.ts";
import './index.css'
import { TechnologiesProvider } from "./context/TechnologiesContext.tsx";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.tsx";

configureApiAuth(() => localStorage.getItem("token"));

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TechnologiesProvider>
          <AppRouter />
        </TechnologiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
