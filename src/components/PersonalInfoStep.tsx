import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface PersonalInfoStepProps {
  data: any;
  updateData: (field: string, value: string) => void;
}

export function PersonalInfoStep({ data, updateData }: PersonalInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>
          🎯 Empecemos por lo básico. Como todo buen código, necesitamos definir las variables principales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              placeholder="Tu nombre de pila"
              value={data.firstName || ""}
              onChange={(e) => updateData("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input
              id="lastName"
              placeholder="Tu apellido"
              value={data.lastName || ""}
              onChange={(e) => updateData("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu.email@ejemplo.com"
            value={data.email || ""}
            onChange={(e) => updateData("email", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            💡 Este será tu ID único en nuestro sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </Label>
            <Input
              id="phone"
              placeholder="+52 55 1234 5678"
              value={data.phone || ""}
              onChange={(e) => updateData("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación *
            </Label>
            <Select onValueChange={(value) => updateData("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cdmx">Ciudad de México</SelectItem>
                <SelectItem value="guadalajara">Guadalajara</SelectItem>
                <SelectItem value="monterrey">Monterrey</SelectItem>
                <SelectItem value="puebla">Puebla</SelectItem>
                <SelectItem value="queretaro">Querétaro</SelectItem>
                <SelectItem value="tijuana">Tijuana</SelectItem>
                <SelectItem value="other">Otra ciudad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm">
            🔒 <strong>Tranquil@:</strong> Tu información está más segura que un repositorio privado. 
            Solo Axity tendrá acceso a estos datos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}