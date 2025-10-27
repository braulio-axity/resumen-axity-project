import { Toaster } from "sonner";
import LoginCard from "@/components/LoginCard";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const url = new URL(window.location.href);
      const redirect = url.searchParams.get("redirect") || "/wizard/1";
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <Toaster position="top-right" />
      <LoginCard />
    </div>
  );
}