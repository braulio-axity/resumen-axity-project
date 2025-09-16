import { type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginCard from "@/components/LoginCard";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh grid place-items-center p-6">
        <LoginCard />
      </div>
    );
  }
  return <>{children}</>;
}
