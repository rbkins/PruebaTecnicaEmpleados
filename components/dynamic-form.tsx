"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

import { Field, FormConfig, SelectOption } from "@/types/form";

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: any) => void;
}

export function DynamicForm({ config, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    config.fields.forEach((field) => {
      initialData[field.id] = field.type === "select" ? "" : "";
    });
    return initialData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^[0-9]{8}$/;
    return phoneRegex.test(value);
  };

  const handleInputChange = (
    fieldId: string,
    value: any,
    fieldType?: string
  ) => {
    // Para campos de teléfono, solo permitir números
    if (fieldType === "tel") {
      const numericValue = value.replace(/[^\d]/g, "");
      value = numericValue.slice(0, 8); // Limitar a 8 dígitos
    }

    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      const value = formData[field.id];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.id] = `${field.label} es obligatorio`;
      } else if (
        field.minLength &&
        value &&
        value.toString().length < field.minLength
      ) {
        newErrors[
          field.id
        ] = `${field.label} debe tener al menos ${field.minLength} caracteres`;
      } else if (field.type === "tel" && value && !validatePhoneNumber(value)) {
        newErrors[
          field.id
        ] = `${field.label} debe contener exactamente 8 dígitos numéricos`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(formData);
      setFormData({});
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const hasError = !!errors[field.id];
    const value = formData[field.id] || "";

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={hasError ? "border-destructive" : ""}
              placeholder={`Ingrese ${field.label.toLowerCase()}`}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(field.id, val)}
            >
              <SelectTrigger
                className={cn("w-full", hasError ? "border-destructive" : "")}
              >
                <SelectValue
                  placeholder={`Seleccione ${field.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {field.options && field.options.length > 0 ? (
                    field.options.map((option: SelectOption) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Cargando...
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) =>
                handleInputChange(field.id, e.target.value, field.type)
              }
              className={hasError ? "border-destructive" : ""}
              placeholder={
                field.type === "tel"
                  ? "12345678"
                  : `Ingrese ${field.label.toLowerCase()}`
              }
              pattern={field.type === "tel" ? "[0-9]{8}" : undefined}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.id]}</p>
            )}
            {field.type === "tel" && (
              <p className="text-sm text-muted-foreground">
                Formato: 8 dígitos numéricos
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="border-primary bg-primary/10">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            ¡Empleado registrado exitosamente!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.fields.map(renderField)}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? "Enviando..." : "Registrar Empleado"}
          </Button>
        </div>
      </form>
    </div>
  );
}
