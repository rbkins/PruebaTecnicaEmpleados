"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Settings2 } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  minLength?: number;
  options: SelectOption[];
  isSelect?: boolean;
  apiEndpoint?: string;
  validations: {
    required: boolean;
    minLength?: number;
  };
}

interface ConfigPanelProps {
  config: {
    fields: Field[];
  };
  onConfigUpdate: (newConfig: any) => void;
}

export function ConfigPanel({ config, onConfigUpdate }: ConfigPanelProps) {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState<Field>({
    id: "",
    label: "",
    type: "text",
    required: false,
    minLength: 0,
    options: [],
    isSelect: false,
    apiEndpoint: "",
    validations: {
      required: false,
      minLength: 0,
    },
  });

  const updateFieldProperty = (
    fieldId: string,
    property: string,
    value: any
  ) => {
    const updatedFields = config.fields.map((field) =>
      field.id === fieldId ? { ...field, [property]: value } : field
    );

    onConfigUpdate({
      ...config,
      fields: updatedFields,
    });
  };

  const removeField = (fieldId: string) => {
    const defaultFields = [
      "nombres",
      "apellidos",
      "direccion",
      "genero",
      "departamento",
    ];

    if (defaultFields.includes(fieldId)) {
      return;
    }

    const updatedFields = config.fields.filter((field) => field.id !== fieldId);
    onConfigUpdate({
      ...config,
      fields: updatedFields,
    });
  };

  const [errors, setErrors] = useState<{ id?: string; label?: string }>({});

  const addNewField = () => {
    const newErrors: { id?: string; label?: string } = {};

    if (!newField.id) {
      newErrors.id = "El ID del campo es requerido";
    }
    if (!newField.label) {
      newErrors.label = "La etiqueta es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConfigUpdate({
      ...config,
      fields: [
        ...config.fields,
        {
          ...newField,
          validations: {
            required: newField.required,
            minLength:
              newField.type === "text" ? newField.minLength : undefined,
          },
        },
      ],
    });

    const fieldToAdd = {
      ...newField,
      id: newField.id.toLowerCase().replace(/\s+/g, "_"),
    };

    onConfigUpdate({
      ...config,
      fields: [...config.fields, fieldToAdd],
    });

    setNewField({
      id: "",
      label: "",
      type: "text",
      required: false,
      minLength: 0,
      options: [],
      isSelect: false,
      apiEndpoint: "",
      validations: {
        required: false,
        minLength: 0,
      },
    });
    setIsAddFieldOpen(false);
  };

  const fieldTypes = [
    { value: "text", label: "Texto" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Teléfono" },
    { value: "number", label: "Número" },
    { value: "date", label: "Fecha" },
    { value: "textarea", label: "Área de texto" },
    { value: "select", label: "Lista desplegable" },
  ];

  const [newOption, setNewOption] = useState({ value: "", label: "" });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Configuración de Campos</h3>
          <p className="text-sm text-muted-foreground">
            Modifica el comportamiento de cada campo del formulario. Los campos
            por defecto no se pueden eliminar.
          </p>
        </div>

        <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Campo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Campo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field-id">ID del Campo</Label>
                <Input
                  id="field-id"
                  value={newField.id}
                  onChange={(e) => {
                    setNewField((prev) => ({ ...prev, id: e.target.value }));
                    if (errors.id)
                      setErrors((prev) => ({ ...prev, id: undefined }));
                  }}
                  placeholder="ej: fecha_nacimiento"
                  className={errors.id ? "border-red-500" : ""}
                />
                {errors.id && (
                  <p className="text-sm text-red-500 mt-1">{errors.id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-label">Etiqueta</Label>
                <Input
                  id="field-label"
                  className={errors.label ? "border-red-500" : ""}
                  value={newField.label}
                  onChange={(e) => {
                    setNewField((prev) => ({ ...prev, label: e.target.value }));
                    if (errors.label)
                      setErrors((prev) => ({ ...prev, label: undefined }));
                  }}
                  placeholder="ej: Fecha de Nacimiento"
                />
                {errors.label && (
                  <p className="text-sm text-red-500 mt-1">{errors.label}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-type">Tipo de Campo</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value) =>
                    setNewField((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newField.type === "select" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Opciones</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Valor"
                        value={newOption.value}
                        onChange={(e) =>
                          setNewOption((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Etiqueta"
                        value={newOption.label}
                        onChange={(e) =>
                          setNewOption((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newOption.value && newOption.label) {
                            setNewField((prev) => ({
                              ...prev,
                              options: [...prev.options, newOption],
                            }));
                            setNewOption({ value: "", label: "" });
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {newField.options.length > 0 && (
                    <div className="space-y-2">
                      <Label>Opciones agregadas:</Label>
                      <div className="space-y-1">
                        {newField.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded"
                          >
                            <span>
                              {option.label} ({option.value})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewField((prev) => ({
                                  ...prev,
                                  options: prev.options.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={newField.required}
                  onCheckedChange={(checked) =>
                    setNewField((prev) => ({ ...prev, required: checked }))
                  }
                />
                <Label htmlFor="field-required">Campo obligatorio</Label>
              </div>

              {(newField.type === "text" || newField.type === "textarea") && (
                <div className="space-y-2">
                  <Label htmlFor="field-minLength">Longitud mínima</Label>
                  <Input
                    id="field-minLength"
                    type="number"
                    min="0"
                    value={newField.minLength}
                    onChange={(e) =>
                      setNewField((prev) => ({
                        ...prev,
                        minLength: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddFieldOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={addNewField}>Agregar Campo</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {config.fields.map((field) => {
          const isDefaultField = [
            "nombres",
            "apellidos",
            "direccion",
            "genero",
            "departamento",
          ].includes(field.id);
          return (
            <Card key={field.id}>
              <CardHeader className="pb-3">
                {isDefaultField && (
                  <Badge variant="secondary" className="mb-2 mr-2">
                    Campo por defecto
                  </Badge>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{field.label}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Obligatorio
                      </Badge>
                    )}
                  </div>

                  {!isDefaultField && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateFieldProperty(field.id, "required", checked)
                      }
                    />
                    <Label htmlFor={`required-${field.id}`}>
                      Campo obligatorio
                    </Label>
                  </div>

                  {(field.type === "text" || field.type === "textarea") && (
                    <div className="space-y-2">
                      <Label htmlFor={`minlength-${field.id}`}>
                        Longitud mínima
                      </Label>
                      <Input
                        id={`minlength-${field.id}`}
                        type="number"
                        min="0"
                        value={field.minLength || 0}
                        onChange={(e) =>
                          updateFieldProperty(
                            field.id,
                            "minLength",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  ID:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    {field.id}
                  </code>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
