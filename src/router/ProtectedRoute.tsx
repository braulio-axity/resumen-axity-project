import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "@/components/ui/Loading";

export default function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading show fullscreen label="Cargando información de tu CV..." size="lg" />;
    if (!isAuthenticated) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }
    return children;
}