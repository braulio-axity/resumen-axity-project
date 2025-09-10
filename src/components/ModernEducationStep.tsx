import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { GraduationCap, Award, Plus, Edit3, Trash2, BookOpen, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModernEducationStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

export function ModernEducationStep({ data, updateData, addXP }: ModernEducationStepProps) {
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
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
    expiryDate: "",
    skillsLearned: []
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
        addXP(20);
        if (education.length + 1 === 1) {
          addXP(15, "Académico");
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
        addXP(25);
        if (certifications.length + 1 >= 2) {
          addXP(30, "Certificado Pro");
        }
      }
      resetCertificationForm();
    }
  };

  const editEducation = (index: number) => {
    const education = data.education || [];
    setCurrentEducation(education[index]);
    setEditingEducationIndex(index);
    setShowEducationForm(true);
  };

  const editCertification = (index: number) => {
    const certifications = data.certifications || [];
    setCurrentCertification(certifications[index]);
    setEditingCertificationIndex(index);
    setShowCertificationForm(true);
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
    setShowEducationForm(false);
    setEditingEducationIndex(-1);
  };

  const resetCertificationForm = () => {
    setCurrentCertification({ name: "", issuer: "", year: "", credentialId: "", expiryDate: "", skillsLearned: [] });
    setShowCertificationForm(false);
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
    return icons[degree] || "📚";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-white/80 to-emerald-50/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Formación y Certificaciones</h2>
                <p className="text-muted-foreground">
                  Tu aprendizaje continuo es tu mayor fortaleza. Cada curso suma a tu crecimiento profesional.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Educación Formal
          </h3>
          {!showEducationForm && (
            <Button 
              onClick={() => setShowEducationForm(true)}
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>

        {data.education && data.education.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {data.education.map((edu: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-2xl mt-1">{getDegreeIcon(edu.degree)}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="font-medium text-emerald-700">{edu.institution}</p>
                            {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                            <div className="flex items-center gap-4 mt-2">
                              {edu.year && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {edu.year}
                                </div>
                              )}
                              {edu.gpa && (
                                <Badge variant="secondary" className="text-xs">
                                  GPA: {edu.gpa}
                                </Badge>
                              )}
                              {edu.honors && (
                                <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                  {edu.honors}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editEducation(index)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {showEducationForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institución *</Label>
                    <Input
                      placeholder="Universidad/Instituto"
                      value={currentEducation.institution}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título/Grado *</Label>
                    <Select onValueChange={(value) => setCurrentEducation(prev => ({ ...prev, degree: value }))}>
                      <SelectTrigger className="bg-white border-0 shadow-sm">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Campo de estudio</Label>
                    <Input
                      placeholder="Ej: Ingeniería en Sistemas"
                      value={currentEducation.field}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año de graduación</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={currentEducation.year}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={addEducation}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                    disabled={!currentEducation.institution || !currentEducation.degree}
                  >
                    {editingEducationIndex >= 0 ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button variant="outline" onClick={resetEducationForm}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Certifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Certificaciones Profesionales
          </h3>
          {!showCertificationForm && (
            <Button 
              onClick={() => setShowCertificationForm(true)}
              variant="outline"
              size="sm"
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>

        {data.certifications && data.certifications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {data.certifications.map((cert: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Award className="h-5 w-5 text-yellow-600" />
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
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <Edit3 className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {cert.credentialId && (
                          <div className="font-mono bg-gray-50 px-2 py-1 rounded">
                            ID: {cert.credentialId}
                          </div>
                        )}
                        {cert.year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Obtenida en {cert.year}
                          </div>
                        )}
                        {cert.expiryDate && (
                          <div className="text-orange-600">
                            Expira: {cert.expiryDate}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {showCertificationForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la certificación *</Label>
                    <Input
                      placeholder="Ej: AWS Solutions Architect"
                      value={currentCertification.name}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emisor *</Label>
                    <Input
                      placeholder="Ej: Amazon Web Services"
                      value={currentCertification.issuer}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>ID de credencial</Label>
                    <Input
                      placeholder="ID o número"
                      value={currentCertification.credentialId}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año de obtención</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={currentCertification.year}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de expiración</Label>
                    <Input
                      type="date"
                      value={currentCertification.expiryDate}
                      onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="bg-white border-0 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={addCertification}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                    disabled={!currentCertification.name || !currentCertification.issuer}
                  >
                    {editingCertificationIndex >= 0 ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button variant="outline" onClick={resetCertificationForm}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900 mb-2">Maximiza el impacto de tu formación</h4>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Incluye cursos online relevantes de plataformas reconocidas</li>
                  <li>• Las certificaciones de cloud y seguridad son muy valoradas</li>
                  <li>• Menciona proyectos o trabajos finales destacados</li>
                  <li>• Los bootcamps y formación práctica cuentan como experiencia valiosa</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}