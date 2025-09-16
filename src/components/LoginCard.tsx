import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const axityEmailRegex = /^[^\s@]+@axity\.com$/i;

export default function LoginCard() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = axityEmailRegex.test(email);
  const isPasswordValid = password.length >= 6;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError("El correo debe ser @axity.com");
      return;
    }
    if (!isPasswordValid) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("¡Bienvenido! Sesión iniciada correctamente.");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo iniciar sesión");
      toast.error("Error de autenticación");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Inicia sesión en Axity CV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo corporativo</Label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.nombre@axity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                  required
                />
              </div>
              {!isEmailValid && email.length > 0 && (
                <p className="text-xs text-red-600">
                  Debe ser un correo con dominio @axity.com
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isPasswordValid && password.length > 0 && (
                <p className="text-xs text-red-600">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                Credenciales incorrectas.
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !isEmailValid || !isPasswordValid}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              {submitting ? (
                "Validando…"
              ) : (
                <>
                  Entrar <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Solo correos @axity.com están permitidos.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
