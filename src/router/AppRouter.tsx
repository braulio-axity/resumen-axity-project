import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import WizardPage from "@/pages/WizardPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/wizard/1" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wizard/:step"
        element={
          <ProtectedRoute>
            <WizardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}