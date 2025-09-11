import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Award, Plus, Edit3, Trash2, BookOpen, Calendar, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* =========================
   Tipos y utilidades
   ========================= */

const degreeIcons = {
  "Técnico": "🔧",
  "Licenciatura": "🎓",
  "Ingeniería": "⚙️",
  "Maestría": "🎖️",
  "Doctorado": "👨‍🎓",
  "Bootcamp": "⚡",
  "Certificado": "📜",
  "Diplomado": "📋",
} as const;

type Degree = keyof typeof degreeIcons;

export type Education = {
  institution: string;
  degree: string; // usamos string porque el usuario puede escribir libremente, pero abajo “narroweamos”
  field: string;
  year: string;
  gpa: string;
  honors: string;
  location: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  credentialId: string;
  expiryDate: string;
  verificationUrl: string;
};

function getDegreeIcon(degree: string): string {
  const key = degree as Degree;
  return degreeIcons[key] ?? "📚";
}

function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

/* =========================
   Props del componente principal
   ========================= */

interface DashboardEducationStepProps {
  data: {
    education?: Education[];
    certifications?: Certification[];
    // permite campos extra sin romper:
    [key: string]: unknown;
  };
  updateData: (field: string, value: unknown) => void;
  addXP: (points: number, achievement?: string) => void;
}

/* =========================
   Componente principal
   ========================= */

export function DashboardEducationStep({ data, updateData, addXP }: DashboardEducationStepProps) {
  const [activeTab, setActiveTab] = useState<string>("education");
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number>(-1);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<number>(-1);

  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: "",
    degree: "",
    field: "",
    year: "",
    gpa: "",
    honors: "",
    location: "",
  });

  const [currentCertification, setCurrentCertification] = useState<Certification>({
    name: "",
    issuer: "",
    year: "",
    credentialId: "",
    expiryDate: "",
    verificationUrl: "",
  });

  const degreeTypes: Degree[] = [
    "Técnico",
    "Licenciatura",
    "Ingeniería",
    "Maestría",
    "Doctorado",
    "Bootcamp",
    "Certificado",
    "Diplomado",
  ];

  const topCertificationProviders: string[] = [
    "AWS",
    "Microsoft",
    "Google Cloud",
    "Oracle",
    "Salesforce",
    "Adobe",
    "Cisco",
    "VMware",
    "Red Hat",
    "IBM",
    "PMP",
    "Scrum.org",
    "Coursera",
    "Udacity",
    "Platzi",
    "edX",
  ];

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      const education = (data.education || []) as Education[];
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
      const certifications = (data.certifications || []) as Certification[];
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
    const education = (data.education || []) as Education[];
    setCurrentEducation(education[index]);
    setEditingEducationIndex(index);
    setShowEducationForm(true);
  };

  const editCertification = (index: number) => {
    const certifications = (data.certifications || []) as Certification[];
    setCurrentCertification(certifications[index]);
    setEditingCertificationIndex(index);
    setShowCertificationForm(true);
  };

  const removeEducation = (index: number) => {
    const education = (data.education || []) as Education[];
    updateData(
      "education",
      education.filter((_, i) => i !== index)
    );
  };

  const removeCertification = (index: number) => {
    const certifications = (data.certifications || []) as Certification[];
    updateData(
      "certifications",
      certifications.filter((_, i) => i !== index)
    );
  };

  const resetEducationForm = () => {
    setCurrentEducation({
      institution: "",
      degree: "",
      field: "",
      year: "",
      gpa: "",
      honors: "",
      location: "",
    });
    setShowEducationForm(false);
    setEditingEducationIndex(-1);
  };

  const resetCertificationForm = () => {
    setCurrentCertification({
      name: "",
      issuer: "",
      year: "",
      credentialId: "",
      expiryDate: "",
      verificationUrl: "",
    });
    setShowCertificationForm(false);
    setEditingCertificationIndex(-1);
  };

  const getCertificationBadgeColor = (issuer: string) => {
    const colors: Record<string, string> = {
      AWS: "bg-orange-100 text-orange-800 border-orange-200",
      Microsoft: "bg-blue-100 text-blue-800 border-blue-200",
      Google: "bg-green-100 text-green-800 border-green-200",
      Oracle: "bg-red-100 text-red-800 border-red-200",
      Salesforce: "bg-blue-100 text-blue-800 border-blue-200",
      Adobe: "bg-purple-100 text-purple-800 border-purple-200",
    };

    for (const [company, colorClass] of Object.entries(colors)) {
      if (issuer.toLowerCase().includes(company.toLowerCase())) {
        return colorClass;
      }
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const educationCount = (data.education?.length || 0) as number;
  const certificationCount = (data.certifications?.length || 0) as number;
  const totalCount = educationCount + certificationCount;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{totalCount}</div>
            <div className="text-sm text-gray-600">Total elementos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{educationCount}</div>
            <div className="text-sm text-gray-600">Educación formal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{certificationCount}</div>
            <div className="text-sm text-gray-600">Certificaciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {data.certifications?.filter((cert: Certification) => !isExpired(cert.expiryDate)).length || 0}
            </div>
            <div className="text-sm text-gray-600">Vigentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Educación Formal ({educationCount})
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificaciones ({certificationCount})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Education Tab */}
            <TabsContent value="education" className="p-6 space-y-6">
              {/* Education List */}
              {educationCount > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">Tu Formación Académica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {(data.education as Education[]).map((edu, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -2 }}
                          className="group bg-emerald-50 border border-emerald-200 rounded-xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-2xl">{getDegreeIcon(edu.degree)}</div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">{edu.degree}</h4>
                                <p className="text-emerald-700 font-medium mb-1">{edu.institution}</p>
                                {edu.field && <p className="text-sm text-gray-600 mb-2">{edu.field}</p>}

                                <div className="flex flex-wrap gap-2">
                                  {edu.year && (
                                    <Badge variant="outline" className="text-xs">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {edu.year}
                                    </Badge>
                                  )}
                                  {edu.location && (
                                    <Badge variant="outline" className="text-xs">
                                      {edu.location}
                                    </Badge>
                                  )}
                                  {edu.honors && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      {edu.honors}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editEducation(index)}
                                className="p-1 hover:bg-blue-100 rounded"
                              >
                                <Edit3 className="h-3 w-3 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(index)}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Add Education Form */}
              <Card className={showEducationForm ? "border-2 border-emerald-300" : "border-dashed border-2 border-emerald-200"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    {editingEducationIndex >= 0 ? "Editar Educación" : "Agregar Educación Formal"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showEducationForm && editingEducationIndex === -1 ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-emerald-600" />
                      </div>
                      <Button onClick={() => setShowEducationForm(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Educación
                      </Button>
                    </div>
                  ) : (
                    <EducationForm
                      currentEducation={currentEducation}
                      setCurrentEducation={setCurrentEducation}
                      degreeTypes={degreeTypes}
                      onSave={addEducation}
                      onCancel={resetEducationForm}
                      isEditing={editingEducationIndex >= 0}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="p-6 space-y-6">
              {/* Certifications List */}
              {certificationCount > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">Tus Certificaciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {(data.certifications as Certification[]).map((cert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -2 }}
                          className="group bg-purple-50 border border-purple-200 rounded-xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Award className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1 text-sm leading-tight">{cert.name}</h4>
                                <Badge className={`text-xs mb-2 ${getCertificationBadgeColor(cert.issuer)}`}>{cert.issuer}</Badge>
                              </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editCertification(index)}
                                className="p-1 hover:bg-blue-100 rounded"
                              >
                                <Edit3 className="h-3 w-3 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCertification(index)}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            {cert.year && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>Obtenida en {cert.year}</span>
                              </div>
                            )}
                            {cert.expiryDate && (
                              <div className={`flex items-center gap-1 ${isExpired(cert.expiryDate) ? "text-red-600" : "text-green-600"}`}>
                                <Calendar className="h-3 w-3" />
                                <span>{isExpired(cert.expiryDate) ? "Expirada" : "Vigente hasta"} {cert.expiryDate}</span>
                              </div>
                            )}
                            {cert.credentialId && <div className="font-mono bg-white px-2 py-1 rounded text-xs">ID: {cert.credentialId}</div>}
                            {cert.verificationUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 w-full"
                                onClick={() => window.open(cert.verificationUrl, "_blank")}
                              >
                                🔗 Verificar
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Add Certification Form */}
              <Card className={showCertificationForm ? "border-2 border-purple-300" : "border-dashed border-2 border-purple-200"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-purple-600" />
                    {editingCertificationIndex >= 0 ? "Editar Certificación" : "Agregar Certificación"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showCertificationForm && editingCertificationIndex === -1 ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                      <Button onClick={() => setShowCertificationForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Certificación
                      </Button>
                    </div>
                  ) : (
                    <CertificationForm
                      currentCertification={currentCertification}
                      setCurrentCertification={setCurrentCertification}
                      topProviders={topCertificationProviders}
                      onSave={addCertification}
                      onCancel={resetCertificationForm}
                      isEditing={editingCertificationIndex >= 0}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================
   Sub-componentes tipados
   ========================= */

type EducationFormProps = {
  currentEducation: Education;
  setCurrentEducation: React.Dispatch<React.SetStateAction<Education>>;
  degreeTypes: Degree[];
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
};

function EducationForm({
  currentEducation,
  setCurrentEducation,
  degreeTypes,
  onSave,
  onCancel,
  isEditing,
}: EducationFormProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Institución *</Label>
          <Input
            placeholder="Universidad/Instituto"
            value={currentEducation.institution}
            onChange={(e) => setCurrentEducation((prev) => ({ ...prev, institution: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Título/Grado *</Label>
          <Select onValueChange={(value) => setCurrentEducation((prev) => ({ ...prev, degree: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el grado" />
            </SelectTrigger>
            <SelectContent>
              {degreeTypes.map((degree) => (
                <SelectItem key={degree} value={degree}>
                  {getDegreeIcon(degree)} {degree}
                </SelectItem>
              ))}
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
            onChange={(e) => setCurrentEducation((prev) => ({ ...prev, field: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Año de graduación</Label>
          <Input
            type="number"
            placeholder="2024"
            value={currentEducation.year}
            onChange={(e) => setCurrentEducation((prev) => ({ ...prev, year: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ubicación</Label>
          <Input
            placeholder="Ciudad, País"
            value={currentEducation.location}
            onChange={(e) => setCurrentEducation((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Honores/Distinciones</Label>
          <Input
            placeholder="Ej: Cum Laude, Mención Honorífica"
            value={currentEducation.honors}
            onChange={(e) => setCurrentEducation((prev) => ({ ...prev, honors: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          className="bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!currentEducation.institution || !currentEducation.degree}
        >
          {isEditing ? "Actualizar" : "Guardar"} Educación
        </Button>
      </div>
    </motion.div>
  );
}

type CertificationFormProps = {
  currentCertification: Certification;
  setCurrentCertification: React.Dispatch<React.SetStateAction<Certification>>;
  topProviders: string[];
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
};

function CertificationForm({
  currentCertification,
  setCurrentCertification,
  topProviders,
  onSave,
  onCancel,
  isEditing,
}: CertificationFormProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre de la certificación *</Label>
          <Input
            placeholder="Ej: AWS Solutions Architect"
            value={currentCertification.name}
            onChange={(e) => setCurrentCertification((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Emisor *</Label>
          <Select onValueChange={(value) => setCurrentCertification((prev) => ({ ...prev, issuer: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona o escribe" />
            </SelectTrigger>
            <SelectContent>
              {topProviders.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="O escribe otro emisor"
            value={currentCertification.issuer}
            onChange={(e) => setCurrentCertification((prev) => ({ ...prev, issuer: e.target.value }))}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Año de obtención</Label>
          <Input
            type="number"
            placeholder="2024"
            value={currentCertification.year}
            onChange={(e) => setCurrentCertification((prev) => ({ ...prev, year: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>ID de credencial</Label>
          <Input
            placeholder="ID o número"
            value={currentCertification.credentialId}
            onChange={(e) => setCurrentCertification((prev) => ({ ...prev, credentialId: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de expiración</Label>
          <Input
            type="date"
            value={currentCertification.expiryDate}
            onChange={(e) => setCurrentCertification((prev) => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>URL de verificación</Label>
        <Input
          placeholder="https://..."
          value={currentCertification.verificationUrl}
          onChange={(e) => setCurrentCertification((prev) => ({ ...prev, verificationUrl: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          disabled={!currentCertification.name || !currentCertification.issuer}
        >
          {isEditing ? "Actualizar" : "Guardar"} Certificación
        </Button>
      </div>
    </motion.div>
  );
}
