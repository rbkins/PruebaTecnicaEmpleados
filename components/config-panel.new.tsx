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

interface ConfigPanelProps {
  config: {
    fields: any[];
  };
  onConfigUpdate: (newConfig: any) => void;
}

export function ConfigPanel({ config, onConfigUpdate }: ConfigPanelProps) {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState({
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
    if (defaultFields.includes(fieldId)) return;
    const updatedFields = config.fields.filter((field) => field.id !== fieldId);
    onConfigUpdate({
      ...config,
      fields: updatedFields,
    });
  };

  const addNewField = () => {
    if (!newField.id || !newField.label) return;

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
    { value: "textarea", label: "Área de texto" },
    { value: "select", label: "Lista desplegable" },
  ];

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
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, id: e.target.value }))
                  }
                  placeholder="ej: fecha_nacimiento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-label">Etiqueta</Label>
                <Input
                  id="field-label"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="ej: Fecha de Nacimiento"
                />
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
                  <Badge variant="secondary" className="mb-2">
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
                      disabled={isDefaultField}
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
                        disabled={isDefaultField}
                        value={field.minLength || 0}
                        onChange={(e) =>
                          updateFieldProperty(
                            field.id,
                            "minLength",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
