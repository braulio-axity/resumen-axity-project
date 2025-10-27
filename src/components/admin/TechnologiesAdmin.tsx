// src/components/admin/TechnologiesAdmin.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Tag,
  Palette,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Toaster, toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import type {
  Technology,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
} from "@/types/technology";
import {
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "@/api/technologies";
import { useTechnologiesContext } from "@/context/TechnologiesContext";
import AdminSuggestionsTab from "./AdminSuggestionsTab";

const CATEGORY_OPTIONS = [
  "Frontend/UI",
  "Backend",
  "Cloud/DevOps",
  "Base de Datos",
  "Mobile",
  "Testing/QA",
  "Data",
  "AI/ML",
  "APIs/Integraciones",
  "Security",
];

type FormState = {
  mode: "create" | "edit";
  open: boolean;
  submitting: boolean;
  values: {
    id?: string;
    name: string;
    version: string;
    category: string;
    color: string;
  };
};

const TABS = [
  { key: 'dashboard', label: 'Tecnologías' },
  { key: 'suggestions', label: 'Sugerencias'},
];

export default function TechnologiesAdmin() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = !!user && (user as any)?.role === "ADMIN";
  const [active, setActive] = useState<string>('dashboard');

  // 👉 Fuente de datos global via Provider
  const { items: globalItems, loading: ctxLoading, refresh } = useTechnologiesContext();

  // Estado de UI local (filtros/paginación/Dialog)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    mode: "create",
    open: false,
    submitting: false,
    values: { name: "", version: "", category: "", color: "" },
  });

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  // Filtro en cliente usando el catálogo global
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (globalItems ?? []).filter((t) => {
      const okSearch =
        !s ||
        t.name.toLowerCase().includes(s) ||
        (t.version ?? "").toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s);
      const okCategory = !category || t.category === category;
      return okSearch && okCategory;
    });
  }, [globalItems, search, category]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);


  function openCreate() {
    setForm({
      mode: "create",
      open: true,
      submitting: false,
      values: { name: "", version: "", category: "", color: "" },
    });
  }

  function openEdit(tech: Technology) {
    setForm({
      mode: "edit",
      open: true,
      submitting: false,
      values: {
        id: tech.id,
        name: tech.name,
        version: tech.version ?? "",
        category: tech.category,
        color: tech.color ?? "",
      },
    });
  }

  function closeForm() {
    setForm((prev) => ({ ...prev, open: false, submitting: false }));
  }

  function handleChange<K extends keyof FormState["values"]>(
    key: K,
    val: FormState["values"][K]
  ) {
    setForm((prev) => ({ ...prev, values: { ...prev.values, [key]: val } }));
  }

  function validateForm(values: FormState["values"]) {
    if (!values.name.trim()) return "El nombre es obligatorio.";
    if (!values.category.trim()) return "La categoría es obligatoria.";
    if (values.version && values.version.length > 50) return "Versión demasiado larga.";
    if (values.color && values.color.length > 30) return "Color demasiado largo.";
    return null;
  }

  async function submitForm() {
    const err = validateForm(form.values);
    if (err) {
      toast.warning(err);
      return;
    }
    setForm((p) => ({ ...p, submitting: true }));

    try {
      if (form.mode === "create") {
        const payload: CreateTechnologyPayload = {
          name: form.values.name.trim(),
          version: form.values.version.trim() || undefined,
          category: form.values.category.trim(),
          color: form.values.color.trim() || undefined,
        };
        await createTechnology(payload);
        toast.success("Tecnología creada");
      } else {
        const id = form.values.id!;
        const payload: UpdateTechnologyPayload = {
          name: form.values.name.trim(),
          version:
            form.values.version.trim() === ""
              ? "" // si en edición se deja vacío, enviamos "" explícito
              : form.values.version.trim(),
          category: form.values.category.trim(),
          color: form.values.color.trim() === "" ? "" : form.values.color.trim(),
        };
        await updateTechnology(id, payload);
        toast.success("Tecnología actualizada");
      }
      closeForm();
      await refresh();

      if (page > 1 && pageItems.length === 0) {
        setPage((p) => Math.max(1, p - 1));
      }
    } catch (e: any) {
      toast.error(e.message ?? "Error al guardar");
    } finally {
      setForm((p) => ({ ...p, submitting: false }));
    }
  }

  async function confirmDeleteById() {
    const id = confirmDelete.id;
    if (!id) return;
    try {
      await deleteTechnology(id);
      toast.success("Tecnología eliminada");
      setConfirmDelete({ open: false });

      await refresh();

      if (page > 1 && pageItems.length === 1) {
        setPage((p) => Math.max(1, p - 1));
      }
    } catch (e: any) {
      toast.error(e.message ?? "Error al eliminar");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <Card className="p-8">
          <p>Inicia sesión para acceder.</p>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700 font-medium">403 • Solo Administradores</p>
            <p className="text-sm text-red-600">No tienes permisos para ver este módulo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <Toaster richColors position="top-right" />
      <div className="p-4">
        <nav className="mb-4 flex gap-4 border-b pb-2">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`pb-2 ${active === t.key ? 'border-b-2 border-emerald-600 font-semibold' : 'text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {active === 'dashboard' && (
          <>

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Administración de Tecnologías
          </h2>
          <p className="text-sm text-gray-500">Crea, edita y gestiona el catálogo.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva tecnología
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Buscar por nombre…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v === "__all__" ? "" : v);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas</SelectItem>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>
                {total} resultado{total === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla / Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b">
                  <th className="p-3 w-[32%]">Tecnología</th>
                  <th className="p-3 w-[18%]">Versión</th>
                  <th className="p-3 w-[22%]">Categoría</th>
                  <th className="p-3 w-[18%]">Color</th>
                  <th className="p-3 w-[10%] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {ctxLoading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        Cargando…
                      </td>
                    </tr>
                  ) : pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        No hay tecnologías para mostrar
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((t) => (
                      <motion.tr
                        key={t.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="border-b hover:bg-gray-50/50"
                      >
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-400">ID: {t.id}</div>
                        </td>
                        <td className="p-3">
                          {t.version ? (
                            <Badge
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {t.version}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                            {t.category}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {t.color ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-4 h-4 rounded"
                                style={{ backgroundColor: t.color }}
                                title={t.color}
                              />
                              <span className="text-sm text-gray-700">{t.color}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
                              <Edit3 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setConfirmDelete({ open: true, id: t.id, name: t.name })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between p-3">
            <div className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

          </>
        )}
        {active === 'suggestions' && <AdminSuggestionsTab />}
      </div>

      {/* Dialog Crear/Editar */}
      <Dialog open={form.open} onOpenChange={(open) => setForm((p) => ({ ...p, open }))}>
        <DialogContent className="sm:max-w-[520px] ax-dialog">
          <DialogHeader>
            <DialogTitle>
              {form.mode === "create" ? "Nueva tecnología" : "Editar tecnología"}
            </DialogTitle>
            <DialogDescription>
              Completa la información.{" "}
              <span className="text-gray-500">
                El nombre y la categoría son obligatorios.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej: React, Python, Docker…"
                value={form.values.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Versión</Label>
              <Input
                placeholder="Ej: 18, 3.12, 1.27…"
                value={form.values.version}
                onChange={(e) => handleChange("version", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={form.values.category || ""}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="#A855F7 o css color"
                  value={form.values.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                />
                <Input
                  type="color"
                  className="w-12 p-1"
                  value={form.values.color || "#ffffff"}
                  onChange={(e) => handleChange("color", e.target.value)}
                  title="Selector de color"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancelar
            </Button>
            <Button
              disabled={form.submitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => void submitForm()}
            >
              <Palette className="h-4 w-4 mr-2" />
              {form.mode === "create" ? "Crear" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación Eliminar */}
      <AlertDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete((p) => ({ ...p, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tecnología</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que deseas eliminar <b>{confirmDelete.name}</b>? Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => void confirmDeleteById()}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
