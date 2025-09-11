import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { GraduationCap, Award, Edit3, Trash2, BookOpen, Calendar, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WizardEducationStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

export function WizardEducationStep({ data, updateData, addXP }: WizardEducationStepProps) {
  const [activeSection, setActiveSection] = useState<"education" | "certifications" | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState(-1);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState(-1);
  
  const [currentEducation, setCurrentEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    year: "",
    gpa: "",
    honors: ""
  });

  const [currentCertification, setCurrentCertification] = useState({
    name: "",
    issuer: "",
    year: "",
    credentialId: "",
    expiryDate: ""
  });

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      const education = data.education || [];
      if (editingEducationIndex >= 0) {
        education[editingEducationIndex] = currentEducation;
        updateData("education", education);
        setEditingEducationIndex(-1);
      } else {
        updateData("education", [...education, currentEducation]);
        addXP(25);
        if (education.length + 1 === 1) {
          addXP(20, "Académico");
        }
      }
      resetEducationForm();
    }
  };

  const addCertification = () => {
    if (currentCertification.name && currentCertification.issuer) {
      const certifications = data.certifications || [];
      if (editingCertificationIndex >= 0) {
        certifications[editingCertificationIndex] = currentCertification;
        updateData("certifications", certifications);
        setEditingCertificationIndex(-1);
      } else {
        updateData("certifications", [...certifications, currentCertification]);
        addXP(30);
        if (certifications.length + 1 >= 2) {
          addXP(40, "Certificado Pro");
        }
      }
      resetCertificationForm();
    }
  };

  const editEducation = (index: number) => {
    const education = data.education || [];
    setCurrentEducation(education[index]);
    setEditingEducationIndex(index);
    setActiveSection("education");
  };

  const editCertification = (index: number) => {
    const certifications = data.certifications || [];
    setCurrentCertification(certifications[index]);
    setEditingCertificationIndex(index);
    setActiveSection("certifications");
  };

  const removeEducation = (index: number) => {
    const education = data.education || [];
    updateData("education", education.filter((_: any, i: number) => i !== index));
  };

  const removeCertification = (index: number) => {
    const certifications = data.certifications || [];
    updateData("certifications", certifications.filter((_: any, i: number) => i !== index));
  };

  const resetEducationForm = () => {
    setCurrentEducation({ institution: "", degree: "", field: "", year: "", gpa: "", honors: "" });
    setActiveSection(null);
    setEditingEducationIndex(-1);
  };

  const resetCertificationForm = () => {
    setCurrentCertification({ name: "", issuer: "", year: "", credentialId: "", expiryDate: "" });
    setActiveSection(null);
    setEditingCertificationIndex(-1);
  };

  const getDegreeIcon = (degree: string) => {
    const icons = {
      "Técnico": "🔧",
      "Licenciatura": "🎓",
      "Ingeniería": "⚙️",
      "Maestría": "🎖️",
      "Doctorado": "👨‍🎓",
      "Bootcamp": "⚡",
      "Certificado": "📜"
    };
    return (icons as Record<string, string>)[degree] ?? "📚";
  };

  const getCertificationBadgeColor = (issuer: string) => {
    const colors = {
      "AWS": "bg-orange-100 text-orange-800 border-orange-200",
      "Microsoft": "bg-blue-100 text-blue-800 border-blue-200",
      "Google": "bg-green-100 text-green-800 border-green-200",
      "Oracle": "bg-red-100 text-red-800 border-red-200",
      "Salesforce": "bg-blue-100 text-blue-800 border-blue-200",
      "Adobe": "bg-purple-100 text-purple-800 border-purple-200"
    };
    
    for (const [company, colorClass] of Object.entries(colors)) {
      if (issuer.toLowerCase().includes(company.toLowerCase())) {
        return colorClass;
      }
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const educationCount = data.education?.length || 0;
  const certificationCount = data.certifications?.length || 0;
  const totalCount = educationCount + certificationCount;

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full"
        >
          <GraduationCap className="h-4 w-4" />
          <span className="font-medium">
            {totalCount === 0 ? "Comparte tu formación académica" : `${totalCount} elementos de formación`}
          </span>
        </motion.div>
      </div>

      {/* Action Cards */}
      {!activeSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education Card */}
          <Card className="border-2 border-dashed border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer group"
                onClick={() => setActiveSection("education")}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Educación Formal</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Títulos, grados y formación académica
              </p>
              {educationCount > 0 && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  {educationCount} registrado{educationCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="border-2 border-dashed border-yellow-200 hover:border-yellow-300 transition-colors cursor-pointer group"
                onClick={() => setActiveSection("certifications")}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Certificaciones</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Certificados profesionales y cursos
              </p>
              {certificationCount > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {certificationCount} registrada{certificationCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Education Form */}
      {activeSection === "education" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {editingEducationIndex >= 0 ? "Editar Educación" : "Agregar Educación Formal"}
                  </h3>
                </div>
                <Button variant="ghost" onClick={() => setActiveSection(null)}>
                  ← Volver
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Institución *</Label>
                    <Input
                      placeholder="Universidad/Instituto"
                      value={currentEducation.institution}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Título/Grado *</Label>
                    <Select onValueChange={(value) => setCurrentEducation(prev => ({ ...prev, degree: value }))}>
                      <SelectTrigger className="bg-white shadow-sm">
                        <SelectValue placeholder="Selecciona el grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Técnico">🔧 Técnico</SelectItem>
                        <SelectItem value="Licenciatura">🎓 Licenciatura</SelectItem>
                        <SelectItem value="Ingeniería">⚙️ Ingeniería</SelectItem>
                        <SelectItem value="Maestría">🎖️ Maestría</SelectItem>
                        <SelectItem value="Doctorado">👨‍🎓 Doctorado</SelectItem>
                        <SelectItem value="Bootcamp">⚡ Bootcamp</SelectItem>
                        <SelectItem value="Certificado">📜 Certificado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Campo de estudio</Label>
                    <Input
                      placeholder="Ej: Ingeniería en Sistemas"
                      value={currentEducation.field}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Año de graduación</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={currentEducation.year}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={addEducation}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 shadow-lg"
                    disabled={!currentEducation.institution || !currentEducation.degree}
                  >
                    {editingEducationIndex >= 0 ? "Actualizar" : "Guardar"} Educación
                  </Button>
                  <Button variant="outline" onClick={resetEducationForm}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Certifications Form */}
      {activeSection === "certifications" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {editingCertificationIndex >= 0 ? "Editar Certificación" : "Agregar Certificación"}
                  </h3>
                </div>
                <Button variant="ghost" onClick={() => setActiveSection(null)}>
                  ← Volver
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nombre de la certificación *</Label>
                    <Input
                      placeholder="Ej: AWS Solutions Architect"
                      value={currentCertification.name}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Emisor *</Label>
                    <Input
                      placeholder="Ej: Amazon Web Services"
                      value={currentCertification.issuer}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">ID de credencial</Label>
                    <Input
                      placeholder="ID o número"
                      value={currentCertification.credentialId}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Año de obtención</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={currentCertification.year}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fecha de expiración</Label>
                    <Input
                      type="date"
                      value={currentCertification.expiryDate}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={addCertification}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 shadow-lg"
                    disabled={!currentCertification.name || !currentCertification.issuer}
                  >
                    {editingCertificationIndex >= 0 ? "Actualizar" : "Guardar"} Certificación
                  </Button>
                  <Button variant="outline" onClick={resetCertificationForm}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Display Lists */}
      {!activeSection && (educationCount > 0 || certificationCount > 0) && (
        <div className="space-y-6">
          {/* Education List */}
          {educationCount > 0 && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Educación Formal ({educationCount})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {data.education.map((edu: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        className="group bg-emerald-50 p-4 rounded-xl border border-emerald-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-2xl">{getDegreeIcon(edu.degree)}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                              <p className="font-medium text-emerald-700">{edu.institution}</p>
                              {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                              {edu.year && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {edu.year}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editEducation(index)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit3 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications List */}
          {certificationCount > 0 && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Certificaciones Profesionales ({certificationCount})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {data.certifications.map((cert: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        className="group bg-yellow-50 p-4 rounded-xl border border-yellow-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Award className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{cert.name}</h4>
                              <Badge className={`text-xs mt-1 ${getCertificationBadgeColor(cert.issuer)}`}>
                                {cert.issuer}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editCertification(index)}
                              className="h-6 w-6 p-0 hover:bg-blue-100 rounded"
                            >
                              <Edit3 className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(index)}
                              className="h-6 w-6 p-0 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {cert.year && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Obtenida en {cert.year}
                            </div>
                          )}
                          {cert.credentialId && (
                            <div className="font-mono bg-white px-2 py-1 rounded">
                              ID: {cert.credentialId}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Star className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900 mb-3">💡 Maximiza el valor de tu formación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                <div>
                  <p className="font-medium mb-1">🎓 Educación:</p>
                  <ul className="space-y-1">
                    <li>• Incluye bootcamps y cursos intensivos</li>
                    <li>• Menciona proyectos destacados</li>
                    <li>• No olvides especializaciones</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">🏆 Certificaciones:</p>
                  <ul className="space-y-1">
                    <li>• Cloud y seguridad son muy valoradas</li>
                    <li>• Incluye cursos online reconocidos</li>
                    <li>• Mantén certificaciones actualizadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}