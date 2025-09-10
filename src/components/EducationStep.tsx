import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { GraduationCap, Plus, Trash2, Award } from "lucide-react";
import { useState } from "react";

interface EducationStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export function EducationStep({ data, updateData }: EducationStepProps) {
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  
  const [currentEducation, setCurrentEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    year: ""
  });

  const [currentCertification, setCurrentCertification] = useState({
    name: "",
    issuer: "",
    year: "",
    credentialId: ""
  });

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      const education = data.education || [];
      updateData("education", [...education, currentEducation]);
      setCurrentEducation({ institution: "", degree: "", field: "", year: "" });
      setShowEducationForm(false);
    }
  };

  const addCertification = () => {
    if (currentCertification.name && currentCertification.issuer) {
      const certifications = data.certifications || [];
      updateData("certifications", [...certifications, currentCertification]);
      setCurrentCertification({ name: "", issuer: "", year: "", credentialId: "" });
      setShowCertificationForm(false);
    }
  };

  const removeEducation = (index: number) => {
    const education = data.education || [];
    updateData("education", education.filter((_: any, i: number) => i !== index));
  };

  const removeCertification = (index: number) => {
    const certifications = data.certifications || [];
    updateData("certifications", certifications.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Educación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Educación
          </CardTitle>
          <CardDescription>
            📚 Desde bootcamps hasta maestrías, todo aprendizaje suma puntos de experiencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.education && data.education.length > 0 && (
            <div className="space-y-3">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      {edu.field && <p className="text-sm">{edu.field}</p>}
                      {edu.year && <p className="text-xs text-muted-foreground">{edu.year}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showEducationForm ? (
            <Button onClick={() => setShowEducationForm(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Educación
            </Button>
          ) : (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institución *</Label>
                  <Input
                    placeholder="Universidad/Instituto"
                    value={currentEducation.institution}
                    onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título/Grado *</Label>
                  <Select onValueChange={(value) => setCurrentEducation(prev => ({ ...prev, degree: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Técnico">Técnico</SelectItem>
                      <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                      <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                      <SelectItem value="Maestría">Maestría</SelectItem>
                      <SelectItem value="Doctorado">Doctorado</SelectItem>
                      <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                      <SelectItem value="Certificado">Certificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Campo de estudio</Label>
                  <Input
                    placeholder="Ej: Ingeniería en Sistemas"
                    value={currentEducation.field}
                    onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Año de graduación</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={currentEducation.year}
                    onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addEducation}>Guardar</Button>
                <Button variant="outline" onClick={() => setShowEducationForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificaciones
          </CardTitle>
          <CardDescription>
            🏆 ¿Tienes badges de AWS, Azure, Google? ¡Es hora de presumir tus logros!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.certifications && data.certifications.length > 0 && (
            <div className="space-y-3">
              {data.certifications.map((cert: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-xs font-mono bg-background px-2 py-1 rounded mt-1 inline-block">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.year && <p className="text-xs text-muted-foreground mt-1">{cert.year}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showCertificationForm ? (
            <Button onClick={() => setShowCertificationForm(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Certificación
            </Button>
          ) : (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la certificación *</Label>
                  <Input
                    placeholder="Ej: AWS Solutions Architect"
                    value={currentCertification.name}
                    onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emisor *</Label>
                  <Input
                    placeholder="Ej: Amazon Web Services"
                    value={currentCertification.issuer}
                    onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID de credencial</Label>
                  <Input
                    placeholder="ID o número de certificado"
                    value={currentCertification.credentialId}
                    onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Año de obtención</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={currentCertification.year}
                    onChange={(e) => setCurrentCertification(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addCertification}>Guardar</Button>
                <Button variant="outline" onClick={() => setShowCertificationForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}